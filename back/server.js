const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const CORPUS_DIR = path.join(__dirname, '..', 'corpus');
const SYSTEM_PROMPT_PATH = path.join(__dirname, '..', 'system-prompt.md');
const SYSTEM_PROMPT_DEFAULT_PATH = path.join(__dirname, '..', 'system-prompt.default.md');

// dev : frontend Vite sur 5173 — prod : même origine (frontend servi par ce serveur)
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3001'] }));
app.use(express.json());

// GET /system-prompt — retourne le contenu de system-prompt.md (vide si absent)
app.get('/system-prompt', (req, res) => {
  try {
    if (!fs.existsSync(SYSTEM_PROMPT_PATH)) {
      return res.type('text/plain').send('');
    }
    const content = fs.readFileSync(SYSTEM_PROMPT_PATH, 'utf-8');
    res.type('text/plain').send(content);
  } catch (err) {
    console.error('Erreur GET /system-prompt:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /system-prompt/default — retourne le pré-prompt par défaut (lecture seule)
app.get('/system-prompt/default', (req, res) => {
  try {
    if (!fs.existsSync(SYSTEM_PROMPT_DEFAULT_PATH)) {
      return res.status(404).json({ error: 'Fichier system-prompt.default.md introuvable' });
    }
    const content = fs.readFileSync(SYSTEM_PROMPT_DEFAULT_PATH, 'utf-8');
    res.type('text/plain').send(content);
  } catch (err) {
    console.error('Erreur GET /system-prompt/default:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /system-prompt — sauvegarde le contenu dans system-prompt.md
app.post('/system-prompt', (req, res) => {
  try {
    const { content } = req.body;
    if (typeof content !== 'string') {
      return res.status(400).json({ error: 'Champ content requis' });
    }
    fs.writeFileSync(SYSTEM_PROMPT_PATH, content, 'utf-8');
    res.json({ success: true });
  } catch (err) {
    console.error('Erreur POST /system-prompt:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /corpus/list — liste tous les fichiers .md et .json du corpus
app.get('/corpus/list', (req, res) => {
  try {
    if (!fs.existsSync(CORPUS_DIR)) {
      return res.json([]);
    }
    const files = fs.readdirSync(CORPUS_DIR).filter(f => f.endsWith('.md') || f.endsWith('.json'));
    const list = files.map(file => {
      const filePath = path.join(CORPUS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      // Titre = première ligne H1 ou nom de fichier
      const h1Match = content.match(/^#\s+(.+)/m);
      const title = h1Match ? h1Match[1].trim() : file.replace(/\.(md|json)$/, '');
      return { path: file, title };
    });
    res.json(list);
  } catch (err) {
    console.error('Erreur /corpus/list:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /corpus/file?path=file.md — retourne le contenu d'un fichier
app.get('/corpus/file', (req, res) => {
  try {
    const filePath = req.query.path;
    if (!filePath) return res.status(400).json({ error: 'Paramètre path manquant' });

    // Sécurité : empêcher path traversal
    const safePath = path.basename(filePath);
    const fullPath = path.join(CORPUS_DIR, safePath);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Fichier introuvable' });
    }
    const content = fs.readFileSync(fullPath, 'utf-8');
    res.type('text/plain').send(content);
  } catch (err) {
    console.error('Erreur /corpus/file:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /corpus/file — met à jour le contenu d'un fichier existant
app.put('/corpus/file', (req, res) => {
  try {
    const { path: filePath, content } = req.body;
    if (!filePath || typeof content !== 'string') {
      return res.status(400).json({ error: 'path et content requis' });
    }
    const safePath = path.basename(filePath);
    const fullPath = path.join(CORPUS_DIR, safePath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Fichier introuvable' });
    }
    fs.writeFileSync(fullPath, content, 'utf-8');
    res.json({ success: true });
  } catch (err) {
    console.error('Erreur PUT /corpus/file:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /corpus/add — ajoute une nouvelle procédure
app.post('/corpus/add', (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'title et content requis' });
    }
    // Sanitize filename
    const filename = title
      .toLowerCase()
      .replace(/[^a-z0-9\-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') + '.md';

    const fullPath = path.join(CORPUS_DIR, filename);
    const fullContent = `# ${title}\n\n${content}`;
    fs.writeFileSync(fullPath, fullContent, 'utf-8');

    res.json({ success: true, path: filename, message: `Fichier ${filename} créé` });
  } catch (err) {
    console.error('Erreur /corpus/add:', err);
    res.status(500).json({ error: err.message });
  }
});

// Servir le build React en mode production (si front/dist/ existe)
const DIST_DIR = path.join(__dirname, '..', 'front', 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (_req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')));
  console.log(`🌐 Frontend servi depuis ${DIST_DIR}`);
}

app.listen(PORT, () => {
  console.log(`✅ Backend KABIT démarré sur http://localhost:${PORT}`);
  console.log(`📂 Corpus : ${CORPUS_DIR}`);
});
