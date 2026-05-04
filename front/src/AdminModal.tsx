import { useState } from 'react';

interface AdminModalProps {
  systemPrompt: string;
  needsReindex: boolean;
  onReindex: () => void;
  onSave: (title: string, content: string) => Promise<{ path: string }>;
  onClose: () => void;
}

export default function AdminModal({ systemPrompt, needsReindex, onReindex, onSave, onClose }: AdminModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [msg, setMsg] = useState('');

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      setMsg('Titre et contenu requis');
      return;
    }
    try {
      const data = await onSave(title, content);
      setMsg(`✅ Fichier créé : ${data.path}`);
      setTitle('');
      setContent('');
    } catch (e) {
      setMsg(`Erreur : ${e instanceof Error ? e.message : String(e)}`);
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
                <button className="btn-save" onClick={handleSave}>Sauvegarder</button>
                {msg && <span className="admin-msg">{msg}</span>}
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
              className="admin-textarea admin-textarea--disabled"
              rows={4}
              value={systemPrompt}
              disabled
              placeholder="Aucun pré-prompt chargé"
            />
            <p className="admin-coming-soon">✏️ Édition depuis l'interface — disponible prochainement</p>
          </section>

        </div>

        <div className="admin-modal-footer">
          <button className="btn-admin-close" onClick={onClose}>Fermer</button>
        </div>

      </div>
    </div>
  );
}
