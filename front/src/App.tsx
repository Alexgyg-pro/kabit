import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { loadEmbedder, embed, cosineSimilarity } from './embeddings';
import { getAllDocs, putDoc, clearDocs, countDocs, DocRecord } from './db';
import AdminModal from './AdminModal';
import './App.css';

const BACKEND = 'http://localhost:3001';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GROQ_API_KEY: string | undefined = (import.meta as any).env?.VITE_GROQ_API_KEY;
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const THRESHOLD_JSON = 0.35;
const THRESHOLD_MD = 0.20;
const TOP_K = 5;

const GROQ_MODELS = [
  { id: 'llama-3.1-8b-instant',    label: 'Llama 3.1 8B (rapide)' },
  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B (meilleur)' },
  { id: 'gemma2-9b-it',            label: 'Gemma 2 9B' },
];

type AppStatus = 'init' | 'loading-model' | 'indexing' | 'ready' | 'error';

// Construit le texte d'embedding d'une fiche .md :
// métadonnées frontmatter converties en texte naturel + corps de la procédure
function mdEmbeddingText(content: string): string {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return content.slice(0, 2000);
  const frontmatter = match[1];
  const body = match[2];
  const get = (key: string) => {
    const m = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    return m ? m[1].trim() : '';
  };
  const header = [get('title'), get('catégorie'), get('service'), get('équipes'), get('commentaire')]
    .filter(Boolean).join(' — ');
  return (header ? header + '\n' : '') + body.slice(0, 2000);
}

interface JsonChunk {
  id: string;
  title: string;
  embeddingText: string;
  displayContent: string;
}

// Découpe un catalogue JSON structuré en chunks sémantiques dénormalisés (chaque chunk est autonome)
function extractCatalogueChunks(content: string, filePath: string): JsonChunk[] {
  type Obj = Record<string, unknown>;
  let data: Obj;
  try { data = JSON.parse(content); } catch { return []; }

  const chunks: JsonChunk[] = [];
  const co = String(data.entreprise ?? 'FinCorp');

  // ── Index lookups pour dénormalisation ─────────────────────────────────────
  const laptopById: Record<string, Obj> = {};
  const appById: Record<string, Obj> = {};
  const serviceById: Record<string, Obj> = {};

  const mat = data.materiel as Record<string, Obj[]> | undefined;
  if (mat) {
    for (const list of Object.values(mat))
      for (const lp of list) laptopById[String(lp.id)] = lp;
  }
  for (const app of (data.applications_metier as Obj[]) ?? [])
    appById[String(app.id)] = app;
  for (const svc of (data.services as Obj[]) ?? [])
    serviceById[String(svc.id)] = svc;

  // ── Chunks laptops ──────────────────────────────────────────────────────────
  if (mat) {
    const synos: Record<string, string> = {
      laptop_ordinaire:   'ordinateur laptop portable standard collaborateur poste travail',
      laptop_developpeur: 'ordinateur laptop portable développeur ingénieur data technique',
      laptop_luxe:        'ordinateur laptop portable cadre dirigeant direction premium luxe MacBook Surface',
    };
    for (const [cat, syno] of Object.entries(synos)) {
      for (const lp of mat[cat] ?? []) {
        const id = String(lp.id);
        // Noms de services en clair pour l'embedding (pas juste les IDs)
        const svcNames = ((lp.services_cibles as string[]) ?? [])
          .map(s => serviceById[s] ? `${s} ${serviceById[s].nom}` : s).join(' ');
        chunks.push({
          id: `${filePath}#${id}`,
          title: `${co} — Matériel : ${lp.modele} (${id})`,
          embeddingText: `${syno} ${id} ${lp.modele} ${lp.processeur} ${lp.ram} ${lp.stockage} ${lp.os} ${lp.profil} services ${svcNames}`,
          displayContent: JSON.stringify(lp, null, 2),
        });
      }
    }
  }

  // ── Chunks applications métier ──────────────────────────────────────────────
  for (const app of (data.applications_metier as Obj[]) ?? []) {
    const id = String(app.id);
    // Noms de services en clair
    const svcNames = ((app.services_cibles as string[]) ?? [])
      .map(s => serviceById[s] ? `${s} ${serviceById[s].nom}` : s).join(' ');
    chunks.push({
      id: `${filePath}#${id}`,
      title: `${co} — Application : ${app.nom} (${id})`,
      embeddingText: `application logiciel outil ${id} ${app.nom} ${app.editeur} ${app.type} ${app.licences} services ${svcNames} support ${app.contact_support}`,
      displayContent: JSON.stringify(app, null, 2),
    });
  }

  // ── Chunks services (dénormalisés : contient les détails laptops + apps) ────
  for (const svc of (data.services as Obj[]) ?? []) {
    const id = String(svc.id);
    // Remplace les IDs par des objets { id, modele, profil }
    const laptopsDetail = ((svc.laptops as string[]) ?? []).map(lid => {
      const lp = laptopById[lid];
      return lp ? { id: lid, modele: lp.modele, profil: lp.profil } : lid;
    });
    // Remplace les IDs par des objets { id, nom, type }
    const appsDetail = ((svc.applications_metier as string[]) ?? []).map(aid => {
      const a = appById[aid];
      return a ? { id: aid, nom: a.nom, type: a.type } : aid;
    });
    const svcDenorm = { ...svc, laptops: laptopsDetail, applications_metier: appsDetail };

    // Embedding enrichi avec les noms réels
    const lpNames = laptopsDetail.map(l => typeof l === 'object' ? `${(l as Obj).modele} ${(l as Obj).profil}` : l).join(' ');
    const appNames = appsDetail.map(a => typeof a === 'object' ? String((a as Obj).nom) : a).join(' ');
    chunks.push({
      id: `${filePath}#service-${id}`,
      title: `${co} — Service ${svc.nom} (${id})`,
      embeddingText: `service département équipe ${id} ${svc.nom} ${svc.description} ordinateurs laptops ${lpNames} applications logiciels ${appNames}`,
      displayContent: JSON.stringify(svcDenorm, null, 2),
    });
  }

  // ── Chunks outils support ───────────────────────────────────────────────────
  const support = data.support as Record<string, unknown> | undefined;
  for (const outil of (support?.outils as Obj[]) ?? []) {
    const id = String(outil.id);
    chunks.push({
      id: `${filePath}#${id}`,
      title: `${co} — Outil support : ${outil.nom}`,
      embeddingText: `outil support informatique console portail administration ${id} ${outil.nom} ${outil.type} ${outil.description} ${outil.acces}`,
      displayContent: JSON.stringify(outil, null, 2),
    });
  }

  return chunks;
}

interface Source {
  id: string;
  path: string;
  title: string;
  score: number;
  content: string;
}

interface HistoryEntry {
  role: 'user' | 'assistant';
  content: string;
}

const HISTORY_OPTIONS = [
  { value: '0', label: 'Aucun' },
  { value: '2', label: '2 derniers échanges' },
  { value: '4', label: '4 derniers échanges' },
  { value: '6', label: '6 derniers échanges' },
];

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    return saved;
  });

  function toggleTheme(t: 'dark' | 'light') {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    setTheme(t);
  }

  const [role, setRole] = useState<'tech' | 'admin'>(() => {
    return (localStorage.getItem('role') as 'tech' | 'admin') || 'tech';
  });

  function toggleRole() {
    const next = role === 'tech' ? 'admin' : 'tech';
    localStorage.setItem('role', next);
    setRole(next);
  }

  const [appStatus, setAppStatus] = useState<AppStatus>('init');
  const [statusMsg, setStatusMsg] = useState('Initialisation...');
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  const [docCount, setDocCount] = useState(0);
  const [needsReindex, setNeedsReindex] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const [systemPrompt, setSystemPrompt] = useState('');
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);

  const [question, setQuestion] = useState('');
  const [askedQuestion, setAskedQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Source | null>(null);
  const [isEditingDoc, setIsEditingDoc] = useState(false);
  const [editDocContent, setEditDocContent] = useState('');
  const [editDocMsg, setEditDocMsg] = useState('');

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyDepth, setHistoryDepth] = useState('0');
  const [copied, setCopied] = useState(false);


  const abortRef = useRef<AbortController | null>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    init();
  }, []);

  async function init() {
    setAppStatus('loading-model');
    setStatusMsg('Chargement du modèle d\'embedding...');
    try {
      await loadEmbedder((msg) => setStatusMsg(msg));
    } catch (e) {
      setAppStatus('error');
      setStatusMsg('Erreur chargement modèle embedding');
      return;
    }

    try {
      const spRes = await fetch(`${BACKEND}/system-prompt`);
      if (spRes.ok) setSystemPrompt(await spRes.text());
    } catch { /* backend absent, on continue sans pré-prompt */ }

    const count = await countDocs();
    if (count > 0) {
      setDocCount(count);
      setStatusMsg(`Cache prêt — ${count} documents`);
      setAppStatus('ready');
    } else {
      await runIndexing();
    }
  }

  // ── Indexation ────────────────────────────────────────────────────────────
  const runIndexing = useCallback(async () => {
    setAppStatus('indexing');
    setNeedsReindex(false);
    try {
      const listRes = await fetch(`${BACKEND}/corpus/list`);
      if (!listRes.ok) throw new Error('Backend inaccessible');
      const files: { path: string; title: string }[] = await listRes.json();

      if (files.length === 0) {
        setStatusMsg('Corpus vide — ajoutez des procédures via l\'admin');
        setAppStatus('ready');
        return;
      }

      await clearDocs();
      let totalDocs = 0;

      for (const file of files) {
        const contentRes = await fetch(`${BACKEND}/corpus/file?path=${encodeURIComponent(file.path)}`);
        const content = await contentRes.text();

        if (file.path.endsWith('.json')) {
          const chunks = extractCatalogueChunks(content, file.path);
          for (const chunk of chunks) {
            setStatusMsg(`Indexation — ${chunk.title}`);
            const embedding = await embed(chunk.embeddingText);
            await putDoc({
              id: chunk.id,
              path: file.path,
              title: chunk.title,
              content: chunk.displayContent,
              embedding,
              timestamp: Date.now(),
            });
            totalDocs++;
            setDocCount(totalDocs);
          }
        } else {
          setStatusMsg(`Indexation — ${file.title}`);
          const embedding = await embed(mdEmbeddingText(content));
          await putDoc({
            id: file.path,
            path: file.path,
            title: file.title,
            content,
            embedding,
            timestamp: Date.now(),
          });
          totalDocs++;
          setDocCount(totalDocs);
        }
      }
      setStatusMsg(`Cache prêt — ${totalDocs} documents indexés`);
      setAppStatus('ready');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatusMsg(`Erreur indexation : ${msg}`);
      setAppStatus('error');
    }
  }, []);

  // ── Question → RAG → Groq ────────────────────────────────────────────────
  async function handleAsk() {
    if (!question.trim() || isAsking) return;
    if (!GROQ_API_KEY) {
      setAnswer('Clé API Groq manquante — renseigne VITE_GROQ_API_KEY dans front/.env.local');
      return;
    }

    setIsAsking(true);
    setAskedQuestion(question);
    setAnswer('');
    setSources([]);

    try {
      // 1. Embedding de la question
      const qEmbed = await embed(question);

      // 2. Similarité cosinus avec tous les docs
      const docs = await getAllDocs();
      const scored = docs
        .map((doc) => ({ doc, score: cosineSimilarity(qEmbed, doc.embedding) }))
        .filter((r) => {
          const threshold = r.doc.path.endsWith('.json') ? THRESHOLD_JSON : THRESHOLD_MD;
          return r.score >= threshold;
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, TOP_K);

      if (scored.length === 0) {
        setAnswer('Aucune procédure correspondante trouvée dans le corpus. Reformulez votre question ou ajoutez des documents.');
        setIsAsking(false);
        return;
      }

      setSources(scored.map((r) => ({ id: r.doc.id, path: r.doc.path, title: r.doc.title, score: r.score, content: r.doc.content })));

      // 3. Contexte
      const contextBlocks = scored
        .map((r, i) => {
          const isJson = r.doc.path.endsWith('.json');
          const label = isJson ? 'DONNÉES STRUCTURÉES' : 'PROCÉDURE';
          // JSON : contenu brut intégral — le LLM lit nativement la structure
          // MD  : tronqué à 1500 chars (texte narratif, potentiellement long)
          const body = isJson ? r.doc.content : r.doc.content.slice(0, 1500);
          return `--- [${label}] Document ${i + 1} : ${r.doc.title} ---\n${body}`;
        })
        .join('\n\n');

      // 4. Historique + messages Groq (format chat)
      const depth = parseInt(historyDepth);
      const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
        {
          role: 'system',
          content:
            (systemPrompt ? systemPrompt.trim() + '\n\n' : '') +
            `Tu es un assistant pour techniciens support informatique chez FinCorp Solutions.\n` +
            `Les documents ci-dessous sont les procédures internes pertinentes. Utilise-les pour répondre.\n` +
            `Si un document est partiellement pertinent, exploite les informations disponibles pour aider le technicien.\n` +
            `Réponds en français, de façon précise et structurée.\n` +
            `Ne dis que tu n'as pas d'information que si les documents sont vraiment sans rapport avec la question.\n\n` +
            contextBlocks,
        },
      ];

      if (depth > 0 && history.length > 0) {
        history.slice(-depth * 2).forEach((h) =>
          messages.push({ role: h.role, content: h.content })
        );
      }

      messages.push({ role: 'user', content: question });

      // 5. Appel Groq streaming (API OpenAI-compatible)
      abortRef.current = new AbortController();
      const res = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({ model: selectedModel, messages, stream: true }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Groq erreur ${res.status}: ${err}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullAnswer = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const json = JSON.parse(data);
            const token = json.choices?.[0]?.delta?.content;
            if (token) {
              fullAnswer += token;
              setAnswer(fullAnswer);
              answerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
          } catch { /* chunk SSE incomplet */ }
        }
      }

      // Historique
      setHistory((prev) => [
        ...prev,
        { role: 'user', content: question },
        { role: 'assistant', content: fullAnswer },
      ]);
      setQuestion('');
    } catch (e: unknown) {
      if ((e as { name?: string }).name === 'AbortError') {
        setAnswer((prev) => prev + '\n\n[Arrêté par l\'utilisateur]');
      } else {
        const msg = e instanceof Error ? e.message : String(e);
        setAnswer(`Erreur : ${msg}`);
      }
    } finally {
      setIsAsking(false);
    }
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  function handleCopy() {
    const text = `Q : ${askedQuestion}\n\nR : ${answer}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  }

  // ── Admin ─────────────────────────────────────────────────────────────────
  async function handleAdminSave(title: string, content: string): Promise<{ path: string }> {
    const res = await fetch(`${BACKEND}/corpus/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setNeedsReindex(true);
    return data;
  }

  async function handleOpenCorpusDoc(path: string, title: string): Promise<void> {
    const res = await fetch(`${BACKEND}/corpus/file?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error(`Impossible de charger ${path}`);
    const content = await res.text();
    setSelectedDoc({ id: path, path, title, score: 0, content });
    setIsEditingDoc(true);
    setEditDocContent(content);
    setEditDocMsg('');
  }

  function openDoc(doc: Source) {
    setSelectedDoc(doc);
    setIsEditingDoc(false);
    setEditDocContent('');
    setEditDocMsg('');
  }

  function closeDoc() {
    setSelectedDoc(null);
    setIsEditingDoc(false);
    setEditDocContent('');
    setEditDocMsg('');
  }

  async function handleSaveDoc() {
    if (!selectedDoc) return;
    try {
      const res = await fetch(`${BACKEND}/corpus/file`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: selectedDoc.path, content: editDocContent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSelectedDoc({ ...selectedDoc, content: editDocContent });
      setIsEditingDoc(false);
      setNeedsReindex(true);
      setEditDocMsg('');
    } catch (e) {
      setEditDocMsg(`Erreur : ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  async function handleSaveSystemPrompt(content: string): Promise<void> {
    const res = await fetch(`${BACKEND}/system-prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setSystemPrompt(content);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>CAGPT — Assistant Techniciens Support</h1>
        <div className="header-actions">
          <button
            className={`btn-role-toggle ${role === 'admin' ? 'btn-role-toggle--admin' : ''}`}
            onClick={toggleRole}
            title={role === 'tech' ? 'Passer en mode Administrateur' : 'Passer en mode Technicien'}
          >
            {role === 'tech' ? '👤 Technicien' : '🔑 Admin'}
          </button>
          <button
            className="btn-theme-toggle"
            onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {role === 'admin' && (
            <button className="btn-admin-open" onClick={() => setShowAdmin(true)} title="Administration">⚙</button>
          )}
        </div>
      </header>

      {/* Bannières de statut */}
      <div className="status-bar">
        <StatusBadge
          hasKey={!!GROQ_API_KEY}
          docCount={docCount}
          appStatus={appStatus}
          statusMsg={statusMsg}
          systemPrompt={systemPrompt}
          onShowSystemPrompt={() => setShowSystemPrompt(true)}
        />

        <div className="controls">
          <label>
            Modèle :&nbsp;
            <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
              {GROQ_MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </label>

          <label>
            Historique :&nbsp;
            <select value={historyDepth} onChange={(e) => setHistoryDepth(e.target.value)}>
              {HISTORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>

          <button
            className={`btn-reindex ${needsReindex ? 'pulse' : ''}`}
            onClick={runIndexing}
            disabled={appStatus === 'indexing'}
          >
            Réindexer
          </button>
        </div>
      </div>

      {/* Clé Groq manquante */}
      {!GROQ_API_KEY && (
        <div className="ollama-missing">
          <strong>Clé API Groq manquante</strong> — ajoute dans <code>front/.env.local</code> :
          <pre>VITE_GROQ_API_KEY=ta_clé</pre>
          Puis redémarre le serveur Vite.
        </div>
      )}

      {/* Indexation en cours */}
      {appStatus === 'indexing' && (
        <div className="indexing-bar">
          <span className="spinner" /> {statusMsg}
        </div>
      )}

      <main className="main">
        {/* Zone de question */}
        <div className="question-area">
          <textarea
            className="question-input"
            placeholder="Posez votre question technique... (Entrée pour envoyer, Shift+Entrée pour sauter une ligne)"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={appStatus !== 'ready' || isAsking}
            rows={3}
          />
          <div className="question-actions">
            {isAsking
              ? <button className="btn-stop" onClick={handleStop}>Arrêter</button>
              : <button
                  className="btn-ask"
                  onClick={handleAsk}
                  disabled={!question.trim() || appStatus !== 'ready'}
                >
                  Envoyer
                </button>
            }
          </div>
        </div>

        {/* Réponse */}
        {(answer || isAsking) && (
          <div className="answer-area">
            {askedQuestion && (
              <div className="asked-question">{askedQuestion}</div>
            )}
            <div className="answer-label">
              <span>Réponse{isAsking && <span className="cursor-blink"> ▊</span>} :</span>
              {answer && !isAsking && (
                <button className="btn-copy" onClick={handleCopy}>
                  {copied ? '✓ Copié' : 'Copier'}
                </button>
              )}
            </div>
            <div className="answer-content" ref={answerRef}>
              {answer
                ? <ReactMarkdown>{answer}</ReactMarkdown>
                : <span className="thinking">Recherche dans le corpus...</span>
              }
            </div>

            {sources.length > 0 && (
              <div className="sources">
                <div className="sources-label">Sources :</div>
                {sources.map((s) => (
                  <div key={s.id} className="source-item source-item--clickable" onClick={() => openDoc(s)}>
                    <span className="source-icon">📄</span>
                    <span className="source-name">{s.title || s.path}</span>
                    <span className="source-score">similarité : {s.score.toFixed(2)}</span>
                    <span className="source-open">Voir</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Historique */}
        {history.length > 0 && (
          <div className="history-summary">
            <span>{history.length / 2} échange(s) en mémoire</span>
            <button className="btn-clear-history" onClick={() => setHistory([])}>
              Effacer l'historique
            </button>
          </div>
        )}
      </main>

      {/* Modale pré-prompt */}
      {showSystemPrompt && (
        <div className="modal-overlay" onClick={() => setShowSystemPrompt(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Pré-prompt actif</span>
              <button className="modal-close" onClick={() => setShowSystemPrompt(false)}>✕</button>
            </div>
            <div className="modal-meta">system-prompt.md</div>
            <div className="modal-body">
              <pre className="system-prompt-content">{systemPrompt.trim()}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Modale document source */}
      {selectedDoc && (
        <div className="modal-overlay" onClick={closeDoc}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">📄 {selectedDoc.title}</span>
              <div className="modal-header-actions">
                {role === 'admin' && !isEditingDoc && !selectedDoc.path.endsWith('.json') && (
                  <button
                    className="btn-doc-edit"
                    onClick={() => { setIsEditingDoc(true); setEditDocContent(selectedDoc.content); }}
                  >
                    ✏️ Modifier
                  </button>
                )}
                <button className="modal-close" onClick={closeDoc}>✕</button>
              </div>
            </div>
            <div className="modal-meta">
              {selectedDoc.path}{selectedDoc.score > 0 && <>&nbsp;·&nbsp; similarité : {selectedDoc.score.toFixed(2)}</>}
            </div>
            {isEditingDoc ? (
              <div className="modal-edit-body">
                <textarea
                  className="doc-edit-textarea"
                  value={editDocContent}
                  onChange={(e) => setEditDocContent(e.target.value)}
                />
                <div className="modal-edit-footer">
                  <button className="btn-save" onClick={handleSaveDoc}>Sauvegarder</button>
                  <button className="btn-doc-cancel" onClick={() => { setIsEditingDoc(false); setEditDocMsg(''); }}>Annuler</button>
                  {editDocMsg && <span className="admin-msg">{editDocMsg}</span>}
                </div>
              </div>
            ) : (
              <div className="modal-body">
                <ReactMarkdown>{selectedDoc.content}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modale admin */}
      {showAdmin && (
        <AdminModal
          systemPrompt={systemPrompt}
          needsReindex={needsReindex}
          backend={BACKEND}
          onReindex={() => { runIndexing(); setShowAdmin(false); }}
          onSave={handleAdminSave}
          onSaveSystemPrompt={handleSaveSystemPrompt}
          onOpenDoc={handleOpenCorpusDoc}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  );
}

// ── Composant badge statut ─────────────────────────────────────────────────
function StatusBadge({
  hasKey,
  docCount,
  appStatus,
  statusMsg,
  systemPrompt,
  onShowSystemPrompt,
}: {
  hasKey: boolean;
  docCount: number;
  appStatus: AppStatus;
  statusMsg: string;
  systemPrompt: string;
  onShowSystemPrompt: () => void;
}) {
  const groqBadge = hasKey
    ? { cls: 'badge-green', label: '✅ Groq prêt' }
    : { cls: 'badge-red',   label: '❌ Clé Groq manquante' };

  const cacheBadge =
    appStatus === 'ready' && docCount > 0
      ? { cls: 'badge-green',  label: `📦 Cache : ${docCount} document${docCount > 1 ? 's' : ''}` }
      : appStatus === 'indexing'
      ? { cls: 'badge-yellow', label: `⏳ ${statusMsg}` }
      : appStatus === 'loading-model'
      ? { cls: 'badge-yellow', label: `⏳ ${statusMsg}` }
      : { cls: 'badge-grey',   label: '📦 Cache vide' };

  return (
    <div className="badges">
      <span className={`badge ${groqBadge.cls}`}>{groqBadge.label}</span>
      <span className={`badge ${cacheBadge.cls}`}>{cacheBadge.label}</span>
      {systemPrompt
        ? <span className="badge badge-green badge--clickable" onClick={onShowSystemPrompt}>📋 Pré-prompt actif</span>
        : <span className="badge badge-grey">📋 Pas de pré-prompt</span>
      }
    </div>
  );
}
