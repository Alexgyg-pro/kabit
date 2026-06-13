import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `Tu es un assistant de rédaction technique pour une base de connaissance IT support.

Ta tâche : transformer la KB source en une fiche de procédure au format KABIT, en restant FIDÈLE à son contenu.

FORMAT ATTENDU — respecte-le impérativement, y compris le frontmatter :
---
title: [titre court et descriptif]
catégorie: [ex : Poste de travail, Réseau, Messagerie, Système d'exploitation…]
service: [ex : Tous services]
équipes: [ex : Support N1]
dernière_revision: [date fournie au format JJ/MM/AAAA]
statut: Publié
---

## Symptômes / Contexte
[description courte du problème]

## ⚠️ Précautions
[à inclure UNIQUEMENT si la KB contient un avertissement, un risque ou une condition préalable — reprends-le fidèlement ; sinon, omets cette section]

## Procédure
[étapes numérotées, claires et actionnables]

## Vérification
[comment confirmer que le problème est résolu, Y COMPRIS la consigne d'escalade si la KB en mentionne une]

## Notes
[à inclure UNIQUEMENT si la KB contient des remarques utiles ou des renvois vers d'autres KB — sinon, omets cette section]

RÈGLES :
- Vocabulaire technicien N1 IT, phrases claires
- Reformule pour la clarté, mais ne SUPPRIME aucune information opérationnelle : avertissements de sécurité, conditions préalables, consignes d'escalade, renvois vers d'autres KB
- Aucune mention d'auteur, de ServiceNow, de codes internes KB
- Ne jamais dépasser 3000 caractères au total (frontmatter inclus)
- Si la KB contient plusieurs procédures distinctes, garde la principale en détail et mentionne brièvement les autres dans les Notes

Réponds uniquement avec le contenu de la fiche (frontmatter inclus), sans aucun commentaire.`;

interface KDocsFile {
  path: string;
  name: string;
  folder: string;
}

interface Props {
  backend: string;
  groqApiKey: string;
  groqModel: string;
  file: KDocsFile;
  existingKdocPath?: string;   // KDoc déjà généré pour cette KB (chargé dans l'éditeur)
  onClose: () => void;
  onSaved: () => void;
}

export default function KBOffViewerModal({ backend, groqApiKey, groqModel, file, existingKdocPath, onClose, onSaved }: Props) {
  const [content, setContent]       = useState('');
  const [loading, setLoading]       = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated]   = useState('');
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [msg, setMsg]               = useState('');

  useEffect(() => { fetchContent(); if (existingKdocPath) loadExistingKdoc(); }, []);

  async function fetchContent() {
    try {
      const res = await fetch(`${backend}/kdocs/file?path=${encodeURIComponent(file.path)}`);
      if (res.ok) setContent(await res.text());
      else setMsg('Impossible de charger le fichier.');
    } catch {
      setMsg('Backend inaccessible.');
    } finally {
      setLoading(false);
    }
  }

  // Cette KB a déjà un KDoc : on le charge dans l'éditeur (évite un doublon à l'enregistrement)
  async function loadExistingKdoc() {
    try {
      const res = await fetch(`${backend}/kdocs/file?path=${encodeURIComponent(existingKdocPath!)}`);
      if (res.ok) {
        setGenerated((await res.text()).trim());
        setMsg('KDoc existant chargé — modifie et enregistre, ou clique « Regénérer ».');
      }
    } catch { /* le KDoc lié est introuvable : on laissera générer un nouveau */ }
  }

  async function handleGenerate() {
    if (!groqApiKey) { setMsg('Clé API Groq manquante.'); return; }
    setGenerating(true);
    setMsg('');
    setGenerated('');
    setSaved(false);
    try {
      const today = new Date().toLocaleDateString('fr-FR');
      const res = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqApiKey}` },
        body: JSON.stringify({
          model: groqModel,
          temperature: 0.3,
          max_tokens: 1500,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `Date du jour : ${today}\n\nKB SOURCE :\n\n${content}` },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? 'Erreur Groq');
      setGenerated(data.choices[0].message.content.trim());
    } catch (e) {
      setMsg(`Erreur : ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch(`${backend}/kdocs/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: generated, sourceKBPath: file.path }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg(`Enregistré : ${data.path}`);
      setSaved(true);
      onSaved();
    } catch (e) {
      setMsg(`Erreur : ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card kdoc-viewer-card" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <span className="modal-title">{file.name}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body kdoc-viewer-body">

          {/* ── Contenu de la KB ── */}
          <div className="kdoc-viewer-section">
            <h3 className="kdoc-viewer-section-title">KB source</h3>
            <div className="kdoc-kb-content">
              {loading
                ? <p className="admin-section-desc">Chargement…</p>
                : <ReactMarkdown>{content}</ReactMarkdown>
              }
            </div>
          </div>

          {/* ── Zone de génération ── */}
          <div className="kdoc-viewer-section">
            <h3 className="kdoc-viewer-section-title">KDoc généré</h3>

            {!generated && (
              <div className="admin-save-row">
                <button
                  className="btn-save"
                  onClick={handleGenerate}
                  disabled={loading || generating || !content}
                >
                  {generating ? 'Génération en cours…' : 'Générer un KDoc'}
                </button>
                {msg && <span className="admin-msg">{msg}</span>}
              </div>
            )}

            {generated && (
              <>
                <textarea
                  className="admin-textarea kdoc-generated-textarea"
                  value={generated}
                  onChange={(e) => setGenerated(e.target.value)}
                  rows={18}
                />
                <div className="admin-save-row">
                  {!saved && (
                    <button className="btn-save" onClick={handleSave} disabled={saving}>
                      {saving ? 'Enregistrement…' : 'Enregistrer dans KDocs/'}
                    </button>
                  )}
                  <button
                    className="btn-restore-default"
                    onClick={handleGenerate}
                    disabled={generating}
                  >
                    Regénérer
                  </button>
                  {msg && <span className="admin-msg">{msg}</span>}
                </div>
              </>
            )}
          </div>

        </div>

        <div className="admin-modal-footer">
          <button className="btn-admin-close" onClick={onClose}>Fermer</button>
        </div>

      </div>
    </div>
  );
}
