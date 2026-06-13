import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { splitNote } from '../note';

// Sépare le frontmatter (--- … ---) du corps markdown, en extrait le titre et les autres
// champs (clé/valeur). Le titre sert d'en-tête ; les autres champs forment le bloc méta.
function parseDoc(raw: string): { title: string; meta: [string, string][]; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { title: '', meta: [], body: raw };
  let title = '';
  const meta: [string, string][] = [];
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i > 0) {
      const key = line.slice(0, i).trim();
      const val = line.slice(i + 1).trim();
      if (!key || !val) continue;
      if (key === 'title') title = val;
      else meta.push([key, val]);
    }
  }
  return { title, meta, body: m[2] };
}

interface Props {
  title: string;
  fileId?: string;       // identifiant du fichier (ex. KDOC00001) préfixé au titre
  subtitle?: string;     // section du document d'où provient le chunk cliqué
  content: string;
  meta?: string;
  isJson?: boolean;
  onSave?: (content: string) => Promise<void>;
  onClose: () => void;
}

export default function DocViewerModal({ title, fileId, subtitle, content, meta, isJson, onSave, onClose }: Props) {
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

  // Découpage du document pour l'affichage (hors JSON / hors édition)
  const { main, note } = splitNote(localContent);
  const { title: docTitle, meta: docMeta, body } = parseDoc(main);
  // Titre d'en-tête : « <fileId> — <vrai titre> » ; à défaut, l'étiquette du chunk reçue
  const headerTitle = (fileId ? `${fileId} — ` : '') + (docTitle || title);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <div className="doc-viewer-titlebar">
            <span className="doc-viewer-title">📄 {headerTitle}</span>
            {subtitle && <span className="doc-viewer-subtitle">{subtitle}</span>}
          </div>
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
            {docMeta.length > 0 && (
              <dl className="doc-meta">
                {docMeta.map(([k, v]) => (
                  <div className="doc-meta-row" key={k}>
                    <dt className="doc-meta-key">{k}</dt>
                    <dd className="doc-meta-val">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            <ReactMarkdown>{body}</ReactMarkdown>
            {note && (
              <div className="doc-note">
                <div className="doc-note-title">💡 Note technicien</div>
                <ReactMarkdown>{note}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
