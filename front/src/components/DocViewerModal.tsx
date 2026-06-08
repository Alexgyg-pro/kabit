import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  title: string;
  content: string;
  meta?: string;
  isJson?: boolean;
  onSave?: (content: string) => Promise<void>;
  onClose: () => void;
}

export default function DocViewerModal({ title, content, meta, isJson, onSave, onClose }: Props) {
  const [isEditing, setIsEditing]     = useState(false);
  const [editContent, setEditContent] = useState('');
  const [localContent, setLocalContent] = useState(content);
  const [saving, setSaving]           = useState(false);
  const [msg, setMsg]                 = useState('');

  function startEdit() {
    setEditContent(localContent);
    setIsEditing(true);
    setMsg('');
  }

  async function handleSave() {
    if (!onSave) return;
    setSaving(true);
    setMsg('');
    try {
      await onSave(editContent);
      setLocalContent(editContent);
      setIsEditing(false);
    } catch (e) {
      setMsg(`Erreur : ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <span className="modal-title">📄 {title}</span>
          <div className="modal-header-actions">
            {onSave && !isEditing && (
              <button className="btn-doc-edit" onClick={startEdit}>✏️ Modifier</button>
            )}
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {meta && <div className="modal-meta">{meta}</div>}

        {isEditing ? (
          <div className="modal-edit-body">
            <textarea
              className="doc-edit-textarea"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="modal-edit-footer">
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? 'Enregistrement…' : 'Sauvegarder'}
              </button>
              <button
                className="btn-doc-cancel"
                onClick={() => { setIsEditing(false); setMsg(''); }}
              >
                Annuler
              </button>
              {msg && <span className="admin-msg">{msg}</span>}
            </div>
          </div>
        ) : isJson ? (
          <div className="modal-body">
            <pre className="catalogue-display">{localContent}</pre>
          </div>
        ) : (
          <div className="modal-body">
            <ReactMarkdown>{localContent}</ReactMarkdown>
          </div>
        )}

      </div>
    </div>
  );
}
