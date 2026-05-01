import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { loadEmbedder, embed, cosineSimilarity } from './embeddings';
import { getAllDocs, putDoc, clearDocs, countDocs, DocRecord } from './db';
import './App.css';

const BACKEND = 'http://localhost:3001';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GROQ_API_KEY: string | undefined = (import.meta as any).env?.VITE_GROQ_API_KEY;
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const SIMILARITY_THRESHOLD = 0.35;
const TOP_K = 3;

const GROQ_MODELS = [
  { id: 'llama-3.1-8b-instant',    label: 'Llama 3.1 8B (rapide)' },
  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B (meilleur)' },
  { id: 'mixtral-8x7b-32768',      label: 'Mixtral 8x7B' },
  { id: 'gemma2-9b-it',            label: 'Gemma 2 9B' },
];

type AppStatus = 'init' | 'loading-model' | 'indexing' | 'ready' | 'error';

interface Source {
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
  const [appStatus, setAppStatus] = useState<AppStatus>('init');
  const [statusMsg, setStatusMsg] = useState('Initialisation...');
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  const [docCount, setDocCount] = useState(0);
  const [needsReindex, setNeedsReindex] = useState(false);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Source | null>(null);

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyDepth, setHistoryDepth] = useState('0');

  // Admin panel
  const [adminTitle, setAdminTitle] = useState('');
  const [adminContent, setAdminContent] = useState('');
  const [adminMsg, setAdminMsg] = useState('');

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
      let done = 0;

      for (const file of files) {
        setStatusMsg(`Indexation : ${done}/${files.length} fichiers — ${file.title}`);
        const contentRes = await fetch(`${BACKEND}/corpus/file?path=${encodeURIComponent(file.path)}`);
        const content = await contentRes.text();
        const embedding = await embed(content.slice(0, 2000));
        const doc: DocRecord = {
          id: file.path,
          path: file.path,
          title: file.title,
          content,
          embedding,
          timestamp: Date.now(),
        };
        await putDoc(doc);
        done++;
        setDocCount(done);
      }
      setStatusMsg(`Cache prêt — ${done} documents indexés`);
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
    setAnswer('');
    setSources([]);

    try {
      // 1. Embedding de la question
      const qEmbed = await embed(question);

      // 2. Similarité cosinus avec tous les docs
      const docs = await getAllDocs();
      const scored = docs
        .map((doc) => ({ doc, score: cosineSimilarity(qEmbed, doc.embedding) }))
        .filter((r) => r.score >= SIMILARITY_THRESHOLD)
        .sort((a, b) => b.score - a.score)
        .slice(0, TOP_K);

      if (scored.length === 0) {
        setAnswer('Aucune procédure correspondante trouvée dans le corpus. Reformulez votre question ou ajoutez des documents.');
        setIsAsking(false);
        return;
      }

      setSources(scored.map((r) => ({ path: r.doc.path, title: r.doc.title, score: r.score, content: r.doc.content })));

      // 3. Contexte
      const contextBlocks = scored
        .map((r, i) => `--- Document ${i + 1} : ${r.doc.title} ---\n${r.doc.content.slice(0, 1500)}`)
        .join('\n\n');

      // 4. Historique + messages Groq (format chat)
      const depth = parseInt(historyDepth);
      const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
        {
          role: 'system',
          content:
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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  }

  // ── Admin ─────────────────────────────────────────────────────────────────
  async function handleAdminSave() {
    if (!adminTitle.trim() || !adminContent.trim()) {
      setAdminMsg('Titre et contenu requis');
      return;
    }
    try {
      const res = await fetch(`${BACKEND}/corpus/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: adminTitle, content: adminContent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAdminMsg(`Fichier créé : ${data.path}`);
      setAdminTitle('');
      setAdminContent('');
      setNeedsReindex(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setAdminMsg(`Erreur : ${msg}`);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>CAGPT — Assistant Techniciens Support</h1>
      </header>

      {/* Bannières de statut */}
      <div className="status-bar">
        <StatusBadge hasKey={!!GROQ_API_KEY} docCount={docCount} appStatus={appStatus} statusMsg={statusMsg} />

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
            <div className="answer-label">Réponse{isAsking && <span className="cursor-blink"> ▊</span>} :</div>
            <div className="answer-content" ref={answerRef}>
              {answer || <span className="thinking">Recherche dans le corpus...</span>}
            </div>

            {sources.length > 0 && (
              <div className="sources">
                <div className="sources-label">Sources :</div>
                {sources.map((s) => (
                  <div key={s.path} className="source-item source-item--clickable" onClick={() => setSelectedDoc(s)}>
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

      {/* Modale document source */}
      {selectedDoc && (
        <div className="modal-overlay" onClick={() => setSelectedDoc(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">📄 {selectedDoc.title}</span>
              <button className="modal-close" onClick={() => setSelectedDoc(null)}>✕</button>
            </div>
            <div className="modal-meta">
              {selectedDoc.path} &nbsp;·&nbsp; similarité : {selectedDoc.score.toFixed(2)}
            </div>
            <div className="modal-body">
              <ReactMarkdown>{selectedDoc.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Admin */}
      <details className="admin-panel">
        <summary>Administration — Ajouter une procédure</summary>
        <div className="admin-content">
          <input
            type="text"
            placeholder="Titre de la procédure"
            value={adminTitle}
            onChange={(e) => setAdminTitle(e.target.value)}
            className="admin-input"
          />
          <textarea
            placeholder="Contenu en markdown..."
            value={adminContent}
            onChange={(e) => setAdminContent(e.target.value)}
            className="admin-textarea"
            rows={8}
          />
          <div className="admin-footer">
            <button className="btn-save" onClick={handleAdminSave}>Sauvegarder</button>
            {adminMsg && <span className="admin-msg">{adminMsg}</span>}
          </div>
          {needsReindex && (
            <div className="reindex-notice">
              Nouveau fichier ajouté — cliquez sur "Réindexer" pour l'intégrer au cache.
            </div>
          )}
        </div>
      </details>
    </div>
  );
}

// ── Composant badge statut ─────────────────────────────────────────────────
function StatusBadge({
  hasKey,
  docCount,
  appStatus,
  statusMsg,
}: {
  hasKey: boolean;
  docCount: number;
  appStatus: AppStatus;
  statusMsg: string;
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
    </div>
  );
}
