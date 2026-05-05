import { useState, useEffect } from 'react';

interface AdminModalProps {
  systemPrompt: string;
  needsReindex: boolean;
  backend: string;
  onReindex: () => void;
  onSave: (title: string, content: string) => Promise<{ path: string }>;
  onSaveSystemPrompt: (content: string) => Promise<void>;
  onSaveJson: (content: string) => Promise<void>;
  onOpenDoc: (path: string, title: string) => Promise<void>;
  onClose: () => void;
}

export default function AdminModal({
  systemPrompt,
  needsReindex,
  backend,
  onReindex,
  onSave,
  onSaveSystemPrompt,
  onSaveJson,
  onOpenDoc,
  onClose,
}: AdminModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [corpusMsg, setCorpusMsg] = useState('');

  const [editablePrompt, setEditablePrompt] = useState(systemPrompt);
  const [promptMsg, setPromptMsg] = useState('');

  const [mdFiles, setMdFiles] = useState<{ path: string; title: string }[]>([]);

  const [catalogueContent, setCatalogueContent] = useState('');
  const [catalogueMsg, setCatalogueMsg] = useState('');
  const [catalogueLoading, setCatalogueLoading] = useState(false);

  async function fetchCatalogue() {
    try {
      const res = await fetch(`${backend}/corpus/file?path=catalogue-it.json`);
      if (res.ok) setCatalogueContent(await res.text());
    } catch { /* backend absent */ }
  }

  async function fetchMdFiles() {
    try {
      const res = await fetch(`${backend}/corpus/list`);
      if (!res.ok) return;
      const files: { path: string; title: string }[] = await res.json();
      setMdFiles(files.filter(f => f.path.endsWith('.md')).sort((a, b) => a.title.localeCompare(b.title)));
    } catch { /* backend absent */ }
  }

  useEffect(() => { fetchMdFiles(); fetchCatalogue(); }, []);

  async function handleSaveCatalogue() {
    try {
      JSON.parse(catalogueContent);
    } catch (e) {
      setCatalogueMsg(`JSON invalide : ${e instanceof Error ? e.message : String(e)}`);
      return;
    }
    setCatalogueLoading(true);
    setCatalogueMsg('Enregistrement et réindexation en cours...');
    try {
      await onSaveJson(catalogueContent);
      setCatalogueMsg('✅ Réindexation terminée.');
    } catch (e) {
      setCatalogueMsg(`Erreur : ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setCatalogueLoading(false);
    }
  }

  async function handleSaveCorpus() {
    if (!title.trim() || !content.trim()) {
      setCorpusMsg('Titre et contenu requis');
      return;
    }
    try {
      const data = await onSave(title, content);
      setCorpusMsg(`✅ Fichier créé : ${data.path}`);
      setTitle('');
      setContent('');
      fetchMdFiles();
    } catch (e) {
      setCorpusMsg(`Erreur : ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  async function handleSavePrompt() {
    try {
      await onSaveSystemPrompt(editablePrompt);
      setPromptMsg('✅ Pré-prompt sauvegardé');
    } catch (e) {
      setPromptMsg(`Erreur : ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card admin-modal-card" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <span className="modal-title">⚙ Administration</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body admin-modal-body">

          {/* ── Section Corpus ───────────────────────────────────────── */}
          <section className="admin-section">
            <h2 className="admin-section-title">Corpus</h2>

            <div className="admin-reindex-row">
              <button
                className={`btn-reindex ${needsReindex ? 'pulse' : ''}`}
                onClick={onReindex}
              >
                Réindexer le corpus
              </button>
              {needsReindex && (
                <span className="admin-reindex-hint">Nouveau fichier en attente d'indexation</span>
              )}
            </div>

            <div className="admin-form">
              <label className="admin-label">Ajouter une procédure</label>
              <input
                type="text"
                placeholder="Titre de la procédure"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="admin-input"
              />
              <textarea
                placeholder="Contenu en markdown..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="admin-textarea"
                rows={8}
              />
              <div className="admin-save-row">
                <button className="btn-save" onClick={handleSaveCorpus}>Sauvegarder</button>
                {corpusMsg && <span className="admin-msg">{corpusMsg}</span>}
              </div>
            </div>
          </section>

          {/* ── Section Fiches du corpus ─────────────────────────────── */}
          <section className="admin-section">
            <h2 className="admin-section-title">Fiches du corpus ({mdFiles.length})</h2>
            {mdFiles.length === 0 ? (
              <p className="admin-section-desc">Aucune fiche .md dans le corpus.</p>
            ) : (
              <ul className="corpus-file-list">
                {mdFiles.map((file) => (
                  <li
                    key={file.path}
                    className="corpus-file-item"
                    onClick={() => { onOpenDoc(file.path, file.title); onClose(); }}
                  >
                    <span className="corpus-file-icon">📄</span>
                    <span className="corpus-file-title">{file.title}</span>
                    <span className="corpus-file-path">{file.path}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ── Section Catalogue IT ────────────────────────────────── */}
          <section className="admin-section">
            <h2 className="admin-section-title">Catalogue IT</h2>
            <p className="admin-section-desc">
              Édition directe de <code>catalogue-it.json</code>. Le JSON est validé avant sauvegarde — une erreur bloque l'enregistrement.
            </p>
            <textarea
              className="admin-textarea admin-textarea--json"
              rows={15}
              value={catalogueContent}
              onChange={(e) => { setCatalogueContent(e.target.value); setCatalogueMsg(''); }}
              spellCheck={false}
              placeholder="Chargement du catalogue..."
            />
            <div className="admin-save-row">
              <button className="btn-save" onClick={handleSaveCatalogue} disabled={catalogueLoading || !catalogueContent}>
                {catalogueLoading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              {catalogueMsg && <span className="admin-msg">{catalogueMsg}</span>}
            </div>
          </section>

          {/* ── Section Pré-prompt ───────────────────────────────────── */}
          <section className="admin-section">
            <h2 className="admin-section-title">Pré-prompt</h2>
            <p className="admin-section-desc">
              Instructions système envoyées au modèle avant chaque échange (fichier <code>system-prompt.md</code>).
            </p>
            <textarea
              className="admin-textarea"
              rows={5}
              value={editablePrompt}
              onChange={(e) => setEditablePrompt(e.target.value)}
              placeholder="Entrez les instructions système..."
            />
            <div className="admin-save-row">
              <button className="btn-save" onClick={handleSavePrompt}>Sauvegarder</button>
              {promptMsg && <span className="admin-msg">{promptMsg}</span>}
            </div>
          </section>

        </div>

        <div className="admin-modal-footer">
          <button className="btn-admin-close" onClick={onClose}>Fermer</button>
        </div>

      </div>
    </div>
  );
}
