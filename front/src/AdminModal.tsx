import { useState, useEffect } from 'react';
import CatalogueModal from './CatalogueModal';
import CorpusFileList from './components/CorpusFileList';
import KDocsModal from './KDocsModal';

interface AdminModalProps {
  systemPrompt: string;
  needsReindex: boolean;
  backend: string;
  techLevel: string;
  techLevels: { id: string; label: string }[];
  onTechLevelChange: (level: string) => void;
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
  techLevel,
  techLevels,
  onTechLevelChange,
  onReindex,
  onSave,
  onSaveSystemPrompt,
  onSaveJson,
  onOpenDoc,
  onClose,
}: AdminModalProps) {
  const [title, setTitle] = useState('');
  const [categorie, setCategorie] = useState('');
  const [service, setService] = useState('');
  const [equipes, setEquipes] = useState('');
  const [statut, setStatut] = useState('Publié');
  const [commentaire, setCommentaire] = useState('');
  const [content, setContent] = useState('');
  const [corpusMsg, setCorpusMsg] = useState('');

  const [editablePrompt, setEditablePrompt] = useState(systemPrompt);
  const [promptMsg, setPromptMsg] = useState('');

  const [mdFiles, setMdFiles] = useState<{ path: string; title: string }[]>([]);

  const [catalogueContent, setCatalogueContent] = useState('');
  const [showCatalogue, setShowCatalogue] = useState(false);
  const [showKDocs, setShowKDocs] = useState(false);

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

  async function handleSaveCorpus() {
    if (!title.trim() || !content.trim()) {
      setCorpusMsg('Titre et contenu requis');
      return;
    }
    const today = new Date().toLocaleDateString('fr-FR');
    const frontmatter = [
      '---',
      `title: ${title.trim()}`,
      categorie.trim() ? `catégorie: ${categorie.trim()}` : 'catégorie: ',
      service.trim() ? `service: ${service.trim()}` : 'service: ',
      equipes.trim() ? `équipes: ${equipes.trim()}` : 'équipes: ',
      `dernière_revision: ${today}`,
      `statut: ${statut}`,
      commentaire.trim() ? `commentaire: ${commentaire.trim()}` : null,
      '---',
    ].filter(Boolean).join('\n');
    const fullContent = `${frontmatter}\n\n${content.trim()}`;
    try {
      const data = await onSave(title, fullContent);
      setCorpusMsg(`✅ Fichier créé : ${data.path}`);
      setTitle('');
      setCategorie('');
      setService('');
      setEquipes('');
      setStatut('Publié');
      setCommentaire('');
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

  async function handleRestoreDefault() {
    try {
      const res = await fetch(`${backend}/system-prompt/default`);
      if (!res.ok) throw new Error('Fichier défaut introuvable');
      setEditablePrompt(await res.text());
      setPromptMsg('Pré-prompt par défaut restauré — cliquez sur Sauvegarder pour appliquer');
    } catch (e) {
      setPromptMsg(`Erreur : ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return (
    <>
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
                placeholder="Titre de la procédure *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="admin-input"
              />
              <div className="admin-meta-grid">
                <input
                  type="text"
                  placeholder="Catégorie (ex : Système d'exploitation)"
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                  className="admin-input"
                />
                <input
                  type="text"
                  placeholder="Service (ex : Tous services)"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="admin-input"
                />
                <input
                  type="text"
                  placeholder="Équipes (ex : Boutique IT)"
                  value={equipes}
                  onChange={(e) => setEquipes(e.target.value)}
                  className="admin-input"
                />
                <select
                  className="admin-select"
                  value={statut}
                  onChange={(e) => setStatut(e.target.value)}
                >
                  <option value="Publié">Publié</option>
                  <option value="Brouillon">Brouillon</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Commentaire (note à l'attention du technicien)"
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                className="admin-input"
              />
              <textarea
                placeholder="Contenu en markdown... *"
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
            <CorpusFileList
              files={mdFiles}
              onSelect={(path, title) => { onOpenDoc(path, title); onClose(); }}
            />
          </section>

          {/* ── Section Catalogue IT ────────────────────────────────── */}
          <section className="admin-section">
            <h2 className="admin-section-title">Catalogue IT</h2>
            <p className="admin-section-desc">
              Éditeur structuré de <code>catalogue-it.json</code> — CRUD par onglets (services, matériel, applications, outils).
            </p>
            <button
              className="btn-cat-open"
              onClick={() => setShowCatalogue(true)}
              disabled={!catalogueContent}
            >
              {catalogueContent ? '📋 Ouvrir l\'éditeur du catalogue' : 'Chargement...'}
            </button>
            {showCatalogue && catalogueContent && (
              <CatalogueModal
                initialContent={catalogueContent}
                onSave={async (json) => {
                  await onSaveJson(json);
                  setCatalogueContent(json);
                }}
                onClose={() => setShowCatalogue(false)}
              />
            )}
          </section>

          {/* ── Section Profil technicien ────────────────────────────── */}
          <section className="admin-section">
            <h2 className="admin-section-title">Profil technicien</h2>
            <p className="admin-section-desc">
              Indique ton niveau de support pour que l'assistant adapte ses conseils d'escalade.
            </p>
            <select
              className="admin-select"
              value={techLevel}
              onChange={(e) => onTechLevelChange(e.target.value)}
            >
              {techLevels.map(l => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </section>

          {/* ── Section Sources ─────────────────────────────────────── */}
          <section className="admin-section">
            <h2 className="admin-section-title">Sources</h2>
            <p className="admin-section-desc">
              Gérez les KB sources (KBOffs) et les KDocs générés, et leur statut de référencement.
            </p>
            <button className="btn-cat-open" onClick={() => setShowKDocs(true)}>
              Ouvrir le gestionnaire de sources
            </button>
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
              <button className="btn-restore-default" onClick={handleRestoreDefault}>Restaurer le défaut</button>
              {promptMsg && <span className="admin-msg">{promptMsg}</span>}
            </div>
          </section>

        </div>

        <div className="admin-modal-footer">
          <button className="btn-admin-close" onClick={onClose}>Fermer</button>
        </div>

      </div>
    </div>

    {showKDocs && (
      <KDocsModal backend={backend} onClose={() => setShowKDocs(false)} />
    )}
    </>
  );
}
