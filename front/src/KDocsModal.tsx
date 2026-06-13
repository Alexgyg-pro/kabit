import { useState, useEffect } from 'react';
import CorpusFileList from './components/CorpusFileList';
import KBOffViewerModal from './KBOffViewerModal';
import DocViewerModal from './components/DocViewerModal';

interface KDocsFile {
  path: string;
  name: string;
  folder: string;
  title?: string;   // titre lisible extrait du fichier (H1 pour KB, frontmatter pour KDoc)
}

interface KBOffsRef {
  id: string;
  file: string;
  title?: string;
  status: 'selected' | 'out' | 'duplicate' | 'done';
  kdoc?: string;          // fichier de l'unique KDoc généré depuis cette KB ('' = aucun)
  updatedAt: string;
}

interface KDocRef {
  id: string;
  file: string;
  title?: string;
  status: 'testing' | 'passed' | 'rejected';
  source_kb?: string;
  updatedAt?: string;
  createdAt?: string;
}

interface References {
  kboffs: KBOffsRef[];
  kdocs: KDocRef[];
}

type Folder = 'kboffs' | 'kdocs';

const KBOFFS_STATUSES = ['selected', 'out', 'duplicate', 'done'] as const;
const KDOCS_STATUSES  = ['testing', 'passed', 'rejected'] as const;

interface Props {
  backend: string;
  groqApiKey: string;
  groqModel: string;
  onClose: () => void;
}

export default function KDocsModal({ backend, groqApiKey, groqModel, onClose }: Props) {
  const [files, setFiles]           = useState<KDocsFile[]>([]);
  const [references, setReferences] = useState<References>({ kboffs: [], kdocs: [] });
  const [folder, setFolder]         = useState<Folder>('kboffs');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<KDocsFile | null>(null);
  const [viewerFile, setViewerFile]     = useState<KDocsFile | null>(null);
  const [viewerKdocPath, setViewerKdocPath] = useState<string | null>(null);
  const [kdocViewer, setKdocViewer]     = useState<{ file: KDocsFile; content: string } | null>(null);
  const [pendingStatus, setPendingStatus] = useState<string>('selected');
  const [pendingTitle, setPendingTitle]   = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchFiles(); fetchReferences(); }, []);

  async function fetchFiles() {
    try {
      const res = await fetch(`${backend}/kdocs/files`);
      if (res.ok) setFiles(await res.json());
    } catch { /* backend absent */ }
  }

  async function fetchReferences() {
    try {
      const res = await fetch(`${backend}/kdocs/references`);
      if (res.ok) setReferences(await res.json());
    } catch { /* backend absent */ }
  }

  function getRef(file: KDocsFile): KBOffsRef | KDocRef | undefined {
    if (file.folder === 'KBOffs') return references.kboffs.find(r => r.file === file.name);
    return references.kdocs.find(r => r.file === file.name);
  }

  function folderFiles(): KDocsFile[] {
    const target = folder === 'kboffs' ? 'KBOffs' : 'KDocs';
    return files.filter(f => f.folder === target);
  }

  function visibleFiles(): KDocsFile[] {
    const base = folderFiles();
    if (statusFilter === 'all')          return base;
    if (statusFilter === 'unreferenced') return base.filter(f => !getRef(f));
    return base.filter(f => getRef(f)?.status === statusFilter);
  }

  function handleFolderChange(f: Folder) {
    setFolder(f);
    setStatusFilter('all');
    setSelectedFile(null);
    setMsg('');
  }

  async function handleDoubleClick(path: string) {
    const file = files.find(f => f.path === path);
    if (!file) return;
    if (file.folder === 'KBOffs') {
      // KDoc déjà généré pour cette KB : via la clé `kdoc`, sinon rattrapage via source_kb
      const ref = references.kboffs.find(r => r.file === file.name);
      const kdocFile = ref?.kdoc || references.kdocs.find(k => k.source_kb === file.path)?.file || '';
      setViewerKdocPath(kdocFile ? `KDocs/${kdocFile}` : null);
      setViewerFile(file);
    } else {
      const res = await fetch(`${backend}/kdocs/file?path=${encodeURIComponent(file.path)}`);
      if (res.ok) setKdocViewer({ file, content: await res.text() });
    }
  }

  function handleSelect(path: string) {
    const file = files.find(f => f.path === path);
    if (!file) return;
    const ref = getRef(file);
    // Pas de référence → statut neutre « none » (rien n'est attribué tant qu'on n'enregistre pas)
    setPendingStatus(ref?.status ?? 'none');
    setPendingTitle(ref?.title || file.title || file.name);
    setSelectedFile(file);
    setMsg('');
  }

  async function handleSave() {
    if (!selectedFile) return;
    // « none » = pas de statut : retirer des références si présent, sinon ne rien créer
    if (pendingStatus === 'none') {
      if (getRef(selectedFile)) {
        await handleRemove();
      } else {
        setSelectedFile(null);
        setMsg('');
      }
      return;
    }
    try {
      const res = await fetch(`${backend}/kdocs/references`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: selectedFile.path,
          status: pendingStatus,
          title: pendingTitle || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReferences(data);
      setMsg('Statut enregistré.');
      setSelectedFile(null);
    } catch (e) {
      setMsg(`Erreur : ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  async function handleRemove() {
    if (!selectedFile) return;
    try {
      const res = await fetch(`${backend}/kdocs/references`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: selectedFile.path }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReferences(data);
      setSelectedFile(null);
      setMsg('');
    } catch (e) {
      setMsg(`Erreur : ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  const kboffsCount = files.filter(f => f.folder === 'KBOffs').length;
  const kdocsCount  = files.filter(f => f.folder === 'KDocs').length;

  const statusFilters = folder === 'kboffs'
    ? [
        { key: 'all',          label: 'Toutes' },
        { key: 'unreferenced', label: 'Non répertoriées' },
        ...KBOFFS_STATUSES.map(s => ({ key: s, label: s })),
      ]
    : [
        { key: 'all',    label: 'Tous' },
        ...KDOCS_STATUSES.map(s => ({ key: s, label: s })),
      ];

  const statusOptions = folder === 'kboffs'
    ? KBOFFS_STATUSES
    : KDOCS_STATUSES;

  const visible      = visibleFiles();
  // Titre affiché : override `references` > titre lu dans le fichier > nom de fichier
  const corpusFiles  = visible.map(f => ({ path: f.path, title: getRef(f)?.title || f.title || f.name }));

  const emptyMsg = statusFilter === 'unreferenced'
    ? 'Aucun fichier non répertorié.'
    : statusFilter === 'all'
    ? `Aucun fichier dans ${folder === 'kboffs' ? 'KBOffs' : 'KDocs'}.`
    : `Aucun fichier avec le statut « ${statusFilter} ».`;

  return (
    <>
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card admin-modal-card kdocs-modal-card" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <span className="modal-title">Sources</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body admin-modal-body">
          <section className="admin-section">

            {/* ── Sélecteur de dossier ── */}
            <div className="kdocs-folder-tabs">
              <button
                className={`kdocs-folder-tab ${folder === 'kboffs' ? 'kdocs-folder-tab--active' : ''}`}
                onClick={() => handleFolderChange('kboffs')}
              >
                KBOffs ({kboffsCount})
              </button>
              <button
                className={`kdocs-folder-tab ${folder === 'kdocs' ? 'kdocs-folder-tab--active' : ''}`}
                onClick={() => handleFolderChange('kdocs')}
              >
                KDocs ({kdocsCount})
              </button>
            </div>

            {/* ── Filtres par statut ── */}
            <div className="kdocs-view-tabs">
              {statusFilters.map(f => (
                <button
                  key={f.key}
                  className={`kdocs-tab ${statusFilter === f.key ? 'kdocs-tab--active' : ''}`}
                  onClick={() => { setStatusFilter(f.key); setSelectedFile(null); setMsg(''); }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {statusFilter === 'all' && (
              <p className="admin-section-desc">
                {folder === 'kboffs'
                  ? 'Clic : attribuer un statut — Double-clic : ouvrir et générer un KDoc.'
                  : 'Clic : modifier le statut — Double-clic : visualiser et éditer le KDoc.'
                }
              </p>
            )}

            <CorpusFileList
              files={corpusFiles}
              onSelect={(path) => handleSelect(path)}
              onDoubleClick={(path) => handleDoubleClick(path)}
              selectedPath={selectedFile?.path}
              emptyMessage={emptyMsg}
              renderBadge={(path) => {
                const file = files.find(f => f.path === path);
                if (!file) return null;
                const ref = getRef(file);
                if (!ref) return null;
                return (
                  <span className={`kdocs-badge kdocs-badge--${ref.status}`}>
                    {ref.status}
                  </span>
                );
              }}
            />
          </section>

          {/* ── Formulaire de statut ── */}
          {selectedFile && (
            <section className="admin-section">
              <h2 className="admin-section-title">
                {getRef(selectedFile) ? 'Modifier' : 'Référencer'} — {selectedFile.name}
              </h2>
              <p className="kdocs-selected-title">{pendingTitle}</p>
              <div className="kdocs-status-options">
                {['none', ...statusOptions].map(s => (
                  <label key={s}>
                    <input
                      type="radio"
                      name="kdocs-status"
                      value={s}
                      checked={pendingStatus === s}
                      onChange={() => setPendingStatus(s)}
                    />
                    {' '}{s === 'none' ? 'none (non répertorié)' : s}
                  </label>
                ))}
              </div>
              <div className="admin-save-row">
                <button className="btn-save" onClick={handleSave}>Enregistrer</button>
                {getRef(selectedFile) && (
                  <button className="btn-restore-default" onClick={handleRemove}>Retirer</button>
                )}
                <button
                  className="btn-doc-cancel"
                  onClick={() => { setSelectedFile(null); setMsg(''); }}
                >
                  Annuler
                </button>
                {msg && <span className="admin-msg">{msg}</span>}
              </div>
            </section>
          )}

        </div>

        <div className="admin-modal-footer">
          <button className="btn-admin-close" onClick={onClose}>Fermer</button>
        </div>

      </div>
    </div>

    {viewerFile && (
      <KBOffViewerModal
        backend={backend}
        groqApiKey={groqApiKey}
        groqModel={groqModel}
        file={viewerFile}
        existingKdocPath={viewerKdocPath ?? undefined}
        onClose={() => { setViewerFile(null); setViewerKdocPath(null); }}
        onSaved={() => { fetchFiles(); fetchReferences(); setViewerFile(null); setViewerKdocPath(null); }}
      />
    )}

    {kdocViewer && (
      <DocViewerModal
        title={kdocViewer.file.name}
        fileId={kdocViewer.file.name.replace(/\.md$/, '')}
        content={kdocViewer.content}
        onSave={async (content) => {
          const res = await fetch(`${backend}/kdocs/file`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: kdocViewer.file.path, content }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
        }}
        onClose={() => setKdocViewer(null)}
      />
    )}
    </>
  );
}
