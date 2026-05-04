import { useState } from 'react';

interface AdminModalProps {
  systemPrompt: string;
  needsReindex: boolean;
  theme: 'dark' | 'light';
  onReindex: () => void;
  onSave: (title: string, content: string) => Promise<{ path: string }>;
  onSaveSystemPrompt: (content: string) => Promise<void>;
  onToggleTheme: (t: 'dark' | 'light') => void;
  onClose: () => void;
}

export default function AdminModal({
  systemPrompt,
  needsReindex,
  theme,
  onReindex,
  onSave,
  onSaveSystemPrompt,
  onToggleTheme,
  onClose,
}: AdminModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [corpusMsg, setCorpusMsg] = useState('');

  const [editablePrompt, setEditablePrompt] = useState(systemPrompt);
  const [promptMsg, setPromptMsg] = useState('');

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

          {/* ── Section Préférences ──────────────────────────────────── */}
          <section className="admin-section">
            <h2 className="admin-section-title">Préférences</h2>
            <div className="admin-theme-row">
              <span className="admin-label">Thème</span>
              <div className="theme-toggle">
                <button
                  className={`theme-btn ${theme === 'dark' ? 'theme-btn--active' : ''}`}
                  onClick={() => onToggleTheme('dark')}
                >
                  🌙 Sombre
                </button>
                <button
                  className={`theme-btn ${theme === 'light' ? 'theme-btn--active' : ''}`}
                  onClick={() => onToggleTheme('light')}
                >
                  ☀️ Clair
                </button>
              </div>
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
