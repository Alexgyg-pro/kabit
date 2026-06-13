#!/usr/bin/env node
/**
 * corpus-reset — recrée le dossier de travail corpus/ à partir du patrimoine
 * versionné corpus-seed/.
 *
 * corpus-seed/  = source de vérité, figée et commitée (fiches racine + KBOffs/).
 * corpus/       = bac à sable de l'application, gitignoré et jetable.
 *
 * Usage :
 *   node scripts/corpus-reset.js           → refuse d'écraser un corpus/ existant
 *   node scripts/corpus-reset.js --force   → écrase corpus/ par l'état du seed
 *   (ou : npm run corpus:reset -- --force)
 */
const fs = require('fs');
const path = require('path');

const ROOT   = path.join(__dirname, '..', '..');
const SEED   = path.join(ROOT, 'corpus-seed');
const CORPUS = path.join(ROOT, 'corpus');
const force  = process.argv.includes('--force');

const SEED_REFERENCES = 'references.seed.json';
const EMPTY_REFERENCES = JSON.stringify({ kboffs: [], kdocs: [] }, null, 2);

function dirHasContent(dir) {
  return fs.existsSync(dir) && fs.readdirSync(dir).length > 0;
}

if (!fs.existsSync(SEED)) {
  console.error(`❌ Seed introuvable : ${SEED}`);
  process.exit(1);
}

if (dirHasContent(CORPUS) && !force) {
  console.error('⚠️  corpus/ existe déjà et contient des fichiers.');
  console.error('    Cette opération écrasera ton bac à sable (KDocs générés, statuts, essais).');
  console.error('    Relance avec --force pour confirmer :');
  console.error('       npm run corpus:reset -- --force');
  process.exit(1);
}

// Remettre corpus/ à zéro
// maxRetries/retryDelay : sous Windows, un handle transitoire (éditeur, Explorateur,
// antivirus, synchro cloud) verrouille parfois un dossier → EBUSY. On laisse Node réessayer.
try {
  fs.rmSync(CORPUS, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
} catch (err) {
  if (err.code === 'EBUSY' || err.code === 'EPERM' || err.code === 'ENOTEMPTY') {
    console.error(`❌ Impossible de vider corpus/ : ${err.code} sur ${err.path}`);
    console.error('   Un programme garde ce dossier ouvert. Ferme :');
    console.error('   • l\'Explorateur Windows pointé sur corpus/ (ou un sous-dossier)');
    console.error('   • l\'onglet/aperçu d\'un fichier corpus/ dans ton éditeur');
    console.error('   • mets en pause OneDrive/antivirus le temps du reset, puis relance.');
    process.exit(1);
  }
  throw err;
}
fs.mkdirSync(CORPUS, { recursive: true });

// Copier le seed (tout sauf le references.seed.json)
fs.cpSync(SEED, CORPUS, {
  recursive: true,
  filter: (src) => path.basename(src) !== SEED_REFERENCES,
});

// references.json vierge + dossier KDocs/ vide pour l'app
fs.writeFileSync(path.join(CORPUS, 'references.json'), EMPTY_REFERENCES, 'utf-8');
fs.mkdirSync(path.join(CORPUS, 'KDocs'), { recursive: true });

const fiches = fs.readdirSync(CORPUS).filter((f) => f.endsWith('.md')).length;
const kboffs = fs.existsSync(path.join(CORPUS, 'KBOffs'))
  ? fs.readdirSync(path.join(CORPUS, 'KBOffs')).length
  : 0;

console.log('✅ corpus/ régénéré depuis corpus-seed/');
console.log(`   • ${fiches} fiches racine`);
console.log(`   • ${kboffs} fichiers KBOffs/`);
console.log('   • references.json vierge, KDocs/ vide');
