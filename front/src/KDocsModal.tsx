import { useState, useEffect } from 'react';
import CorpusFileList from './components/CorpusFileList';

interface KDocsFile {
  path: string;
  name: string;
  folder: string;
}

interface Reference {
  path: string;
  status: 'selected' | 'passed';
  passedAt: string | null;
}

interface Props {
  backend: string;
  onClose: () => void;
}

export default function KDocsModal({ backend, onClose }: Props) {
  const [files, setFiles] = useState<KDocsFile[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [selectedFile, setSelectedFile] = useState<KDocsFile | null>(null);
  const [pendingStatus, setPendingStatus] = useState<'selected' | 'passed'>('selected');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchFiles();
    fetchReferences();
  }, []);

  async function fetchFiles() {
    try {
      const res = await fetch(`${backend}/kdocs/files`);
      if (res.ok) setFiles(await res.json());
    } catch { /* backend absent */ }
  }

  async function fetchReferences() {
    try {
      const res = await fetch(`${backend}/kdocs/references`);
      if (res.ok) {
        const data = await res.json();
        setReferences(data.references ?? []);
      }
    } catch { /* backend absent */ }
  }

  function getRef(path: string): Reference | undefined {
    return references.find(r => r.path === path);
  }

  function handleDoubleClick(path: string) {
    const file = files.find(f => f.path === path);
    if (!file) return;
    const existing = getRef(path);
    setPendingStatus(existing?.status ?? 'selected');
    setSelectedFile(file);
    setMsg('');
  }

  async function handleSave() {
    if (!selectedFile) return;
    try {
      const res = await fetch(`${backend}/kdocs/references`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: selectedFile.path, status: pendingStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReferences(data.references ?? []);
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
      setReferences(data.references ?? []);
      setSelectedFile(null);
      setMsg('');
    } catch (e) {
      setMsg(`Erreur : ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  const corpusFiles = files.map(f => ({ path: f.path, title: f.name }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card admin-modal-card" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <span className="modal-title">Sources KDocs</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body admin-modal-body">

          <section className="admin-section">
            <h2 className="admin-section-title">
              Fichiers disponibles ({files.length})
            </h2>
            <p className="admin-section-desc">
              Double-cliquez sur un fichier pour lui attribuer un statut.
            </p>
            <CorpusFileList
              files={corpusFiles}
              onDoubleClick={(path) => handleDoubleClick(path)}
              emptyMessage="Aucun fichier dans KBOffs ou KDocs."
              renderBadge={(path) => {
                const ref = getRef(path);
                if (!ref) return null;
                return (
                  <span className={`kdocs-badge kdocs-badge--${ref.status}`}>
                    {ref.status}
                  </span>
                );
              }}
            />
          </section>

          {selectedFile && (
            <section className="admin-section">
              <h2 className="admin-section-title">Statut — {selectedFile.name}</h2>
              <div className="kdocs-status-options">
                <label>
                  <input
                    type="radio"
                    name="kdocs-status"
                    value="selected"
                    checked={pendingStatus === 'selected'}
                    onChange={() => setPendingStatus('selected')}
                  />
                  {' '}selected
                </label>
                <label>
                  <input
                    type="radio"
                    name="kdocs-status"
                    value="passed"
                    checked={pendingStatus === 'passed'}
                    onChange={() => setPendingStatus('passed')}
                  />
                  {' '}passed
                </label>
              </div>
              <div className="admin-save-row">
                <button className="btn-save" onClick={handleSave}>Enregistrer</button>
                {getRef(selectedFile.path) && (
                  <button className="btn-restore-default" onClick={handleRemove}>
                    Retirer
                  </button>
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
