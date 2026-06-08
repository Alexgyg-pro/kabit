import { useState, useEffect } from 'react';
import CorpusFileList from './components/CorpusFileList';

interface KDocsFile {
  path: string;
  name: string;
  folder: string;
}

interface KBOffsRef {
  id: string;
  file: string;
  title?: string;
  status: 'selected' | 'out' | 'duplicate' | 'done';
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
  onClose: () => void;
}

export default function KDocsModal({ backend, onClose }: Props) {
  const [files, setFiles]           = useState<KDocsFile[]>([]);
  const [references, setReferences] = useState<References>({ kboffs: [], kdocs: [] });
  const [folder, setFolder]         = useState<Folder>('kboffs');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<KDocsFile | null>(null);
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

  function handleSelect(path: string) {
    const file = files.find(f => f.path === path);
    if (!file) return;
    const ref = getRef(file);
    const defaultStatus = file.folder === 'KBOffs' ? 'selected' : 'testing';
    setPendingStatus(ref?.status ?? defaultStatus);
    setPendingTitle(ref?.title ?? '');
    setSelectedFile(file);
    setMsg('');
  }

  async function handleSave() {
    if (!selectedFile) return;
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
  const corpusFiles  = visible.map(f => ({ path: f.path, title: f.name }));

  const emptyMsg = statusFilter === 'unreferenced'
    ? 'Aucun fichier non répertorié.'
    : statusFilter === 'all'
    ? `Aucun fichier dans ${folder === 'kboffs' ? 'KBOffs' : 'KDocs'}.`
    : `Aucun fichier avec le statut « ${statusFilter} ».`;

  return (
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

            {folder === 'kboffs' && statusFilter === 'all' && (
              <p className="admin-section-desc">
                Cliquez sur une KB pour lui attribuer un statut.
              </p>
            )}

            <CorpusFileList
              files={corpusFiles}
              onSelect={(path) => handleSelect(path)}
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
              <input
                type="text"
                placeholder="Titre (optionnel)"
                value={pendingTitle}
                onChange={(e) => setPendingTitle(e.target.value)}
                className="admin-input"
              />
              <div className="kdocs-status-options">
                {statusOptions.map(s => (
                  <label key={s}>
                    <input
                      type="radio"
                      name="kdocs-status"
                      value={s}
                      checked={pendingStatus === s}
                      onChange={() => setPendingStatus(s)}
                    />
                    {' '}{s}
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
  );
}
