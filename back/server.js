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

// ── KDocs ─────────────────────────────────────────────────────────────────────
const REFERENCES_PATH = path.join(CORPUS_DIR, 'references.json');
const KDOCS_FOLDERS = ['KBOffs', 'KDocs'];

function readReferences() {
  if (!fs.existsSync(REFERENCES_PATH)) return { kboffs: [], kdocs: [] };
  try { return JSON.parse(fs.readFileSync(REFERENCES_PATH, 'utf-8')); }
  catch { return { kboffs: [], kdocs: [] }; }
}

function writeReferences(data) {
  fs.writeFileSync(REFERENCES_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function generateId(data, folder) {
  if (folder === 'KBOffs') {
    const nums = data.kboffs.map(e => parseInt((e.id || '').replace('KB', ''))).filter(n => !isNaN(n));
    const next = nums.length ? Math.max(...nums) + 1 : 1;
    return `KB${String(next).padStart(5, '0')}`;
  } else {
    const nums = data.kdocs.map(e => parseInt((e.id || '').replace('KDOC', ''))).filter(n => !isNaN(n));
    const next = nums.length ? Math.max(...nums) + 1 : 1;
    return `KDOC${String(next).padStart(5, '0')}`;
  }
}

const KBOFFS_STATUSES = ['selected', 'out', 'duplicate', 'done'];
const KDOCS_STATUSES  = ['testing', 'passed', 'rejected'];

// Titre lisible d'un fichier source : KDoc → frontmatter `title:`, KB → H1 `# …`
function extractFileTitle(content, folder) {
  const fm      = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fmTitle = fm ? (fm[1].match(/^title:\s*(.+)$/m)?.[1].trim() || '') : '';
  const h1      = content.match(/^#\s+(.+)/m);
  const h1Title = h1 ? h1[1].trim() : '';
  return folder === 'KDocs' ? (fmTitle || h1Title) : (h1Title || fmTitle);
}

// GET /kdocs/files — liste les fichiers dans KBOffs et KDocs (avec titre lisible)
app.get('/kdocs/files', (req, res) => {
  try {
    const files = [];
    for (const folder of KDOCS_FOLDERS) {
      const dirPath = path.join(CORPUS_DIR, folder);
      if (!fs.existsSync(dirPath)) continue;
      const entries = fs.readdirSync(dirPath).filter(f => !f.startsWith('.'));
      for (const entry of entries) {
        let title = entry.replace(/\.md$/, '');
        if (entry.endsWith('.md')) {
          try {
            const content = fs.readFileSync(path.join(dirPath, entry), 'utf-8');
            title = extractFileTitle(content, folder) || title;
          } catch { /* fichier illisible : garder le nom de fichier */ }
        }
        files.push({ path: `${folder}/${entry}`, name: entry, folder, title });
      }
    }
    res.json(files);
  } catch (err) {
    console.error('Erreur /kdocs/files:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /kdocs/references — retourne references.json
app.get('/kdocs/references', (req, res) => {
  try {
    res.json(readReferences());
  } catch (err) {
    console.error('Erreur GET /kdocs/references:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /kdocs/references — ajoute ou met à jour une référence
app.post('/kdocs/references', (req, res) => {
  try {
    const { path: filePath, status, title } = req.body;
    const folder = KDOCS_FOLDERS.find(d => filePath?.startsWith(d + '/'));
    if (!folder || !filePath || !status) {
      return res.status(400).json({ error: 'path et status requis ; dossier invalide' });
    }
    const section   = folder === 'KBOffs' ? 'kboffs' : 'kdocs';
    const validSt   = folder === 'KBOffs' ? KBOFFS_STATUSES : KDOCS_STATUSES;
    if (!validSt.includes(status)) {
      return res.status(400).json({ error: `Statut invalide pour ${folder} : ${validSt.join(', ')}` });
    }

    const filename = filePath.slice(folder.length + 1);
    const data     = readReferences();
    const now      = new Date().toISOString();
    const existing = data[section].find(e => e.file === filename);

    if (existing) {
      existing.status    = status;
      existing.updatedAt = now;
      if (title !== undefined) existing.title = title;
    } else {
      const entry = { id: generateId(data, folder), file: filename, status, updatedAt: now };
      if (title) entry.title = title;
      data[section].push(entry);
    }

    writeReferences(data);
    res.json(data);
  } catch (err) {
    console.error('Erreur POST /kdocs/references:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /kdocs/references — retire une référence
app.delete('/kdocs/references', (req, res) => {
  try {
    const { path: filePath } = req.body;
    const folder = KDOCS_FOLDERS.find(d => filePath?.startsWith(d + '/'));
    if (!folder || !filePath) return res.status(400).json({ error: 'path requis' });

    const section  = folder === 'KBOffs' ? 'kboffs' : 'kdocs';
    const filename = filePath.slice(folder.length + 1);
    const data     = readReferences();
    data[section]  = data[section].filter(e => e.file !== filename);

    // Retrait d'un KDoc → délier la KB source (clé `kdoc` remise à vide)
    if (folder === 'KDocs') {
      for (const kb of data.kboffs) {
        if (kb.kdoc === filename) kb.kdoc = '';
      }
    }

    writeReferences(data);
    res.json(data);
  } catch (err) {
    console.error('Erreur DELETE /kdocs/references:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /kdocs/list — liste les fichiers de KDocs/ avec leur titre
app.get('/kdocs/list', (req, res) => {
  try {
    const dirPath = path.join(CORPUS_DIR, 'KDocs');
    if (!fs.existsSync(dirPath)) return res.json([]);
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
    const list = files.map(file => {
      const content = fs.readFileSync(path.join(dirPath, file), 'utf-8');
      const h1 = content.match(/^#\s+(.+)/m);
      const title = h1 ? h1[1].trim() : file.replace(/\.md$/, '');
      return { path: `KDocs/${file}`, title };
    });
    res.json(list);
  } catch (err) {
    console.error('Erreur GET /kdocs/list:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /kdocs/file?path=KBOffs/... — retourne le contenu d'un fichier KB ou KDoc
app.get('/kdocs/file', (req, res) => {
  try {
    const filePath = req.query.path;
    if (!filePath) return res.status(400).json({ error: 'Paramètre path manquant' });
    const folder = KDOCS_FOLDERS.find(d => filePath.startsWith(d + '/'));
    if (!folder) return res.status(400).json({ error: 'Dossier invalide (KBOffs ou KDocs attendu)' });
    const filename = path.basename(filePath.slice(folder.length + 1));
    const fullPath = path.join(CORPUS_DIR, folder, filename);
    if (!fs.existsSync(fullPath)) return res.status(404).json({ error: 'Fichier introuvable' });
    res.type('text/plain').send(fs.readFileSync(fullPath, 'utf-8'));
  } catch (err) {
    console.error('Erreur GET /kdocs/file:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /kdocs/file — met à jour le contenu d'un fichier dans KBOffs/ ou KDocs/
app.put('/kdocs/file', (req, res) => {
  try {
    const { path: filePath, content } = req.body;
    if (!filePath || typeof content !== 'string') {
      return res.status(400).json({ error: 'path et content requis' });
    }
    const folder = KDOCS_FOLDERS.find(d => filePath.startsWith(d + '/'));
    if (!folder) return res.status(400).json({ error: 'Dossier invalide (KBOffs ou KDocs attendu)' });
    const filename = path.basename(filePath.slice(folder.length + 1));
    const fullPath = path.join(CORPUS_DIR, folder, filename);
    if (!fs.existsSync(fullPath)) return res.status(404).json({ error: 'Fichier introuvable' });
    fs.writeFileSync(fullPath, content, 'utf-8');
    res.json({ success: true });
  } catch (err) {
    console.error('Erreur PUT /kdocs/file:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /kdocs/save — sauvegarde un KDoc généré dans KDocs/ et met à jour references.json
// Invariant : une KB ne possède qu'UN SEUL KDoc. Si la KB source en a déjà un, on le
// met à jour au lieu d'en créer un second (cf. clé `kdoc` sur l'entrée KB).
app.post('/kdocs/save', (req, res) => {
  try {
    const { content, sourceKBPath } = req.body;
    if (!content) return res.status(400).json({ error: 'content requis' });

    const data = readReferences();
    const now  = new Date().toISOString();

    // Retrouver / créer l'entrée KB source et la marquer 'done'
    let kb = null;
    if (sourceKBPath) {
      const sourceFilename = path.basename(sourceKBPath);
      kb = data.kboffs.find(e => e.file === sourceFilename);
      if (kb) {
        kb.status = 'done';
        kb.updatedAt = now;
      } else {
        kb = {
          id: generateId(data, 'KBOffs'),
          file: sourceFilename,
          status: 'done',
          kdoc: '',
          updatedAt: now,
        };
        data.kboffs.push(kb);
      }
    }

    // KDoc déjà associé à cette KB : via la clé `kdoc`, sinon rattrapage via source_kb
    let kdocEntry = null;
    if (kb && kb.kdoc) kdocEntry = data.kdocs.find(e => e.file === kb.kdoc);
    if (!kdocEntry && sourceKBPath) kdocEntry = data.kdocs.find(e => e.source_kb === sourceKBPath);
    const kdocExists = kdocEntry && fs.existsSync(path.join(CORPUS_DIR, 'KDocs', kdocEntry.file));

    let filename;
    if (kdocEntry && kdocExists) {
      // Mise à jour du KDoc existant (pas de doublon)
      filename = kdocEntry.file;
      kdocEntry.updatedAt = now;
    } else {
      // Création d'un nouveau KDoc
      const id = generateId(data, 'KDocs');
      filename = `${id}.md`;
      data.kdocs.push({
        id,
        file:      filename,
        status:    'testing',
        source_kb: sourceKBPath || undefined,
        createdAt: now,
        updatedAt: now,
      });
    }
    fs.writeFileSync(path.join(CORPUS_DIR, 'KDocs', filename), content, 'utf-8');
    if (kb) kb.kdoc = filename; // lier (ou re-lier) la KB à son unique KDoc

    writeReferences(data);
    res.json({ success: true, path: `KDocs/${filename}`, data });
  } catch (err) {
    console.error('Erreur POST /kdocs/save:', err);
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
