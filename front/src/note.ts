// Marqueur de zone hors-embedding.
// Tout ce qui suit ce marqueur dans une fiche est destiné au technicien (affiché dans
// la modale de visualisation) mais EXCLU de l'indexation RAG et du contexte envoyé au LLM.
export const NOTE_MARKER = '<<<NOTE>>>';

// Sépare le contenu indexable (avant le marqueur) de la note technicien (après).
export function splitNote(content: string): { main: string; note: string } {
  const idx = content.indexOf(NOTE_MARKER);
  if (idx === -1) return { main: content, note: '' };
  return {
    main: content.slice(0, idx).trimEnd(),
    note: content.slice(idx + NOTE_MARKER.length).trim(),
  };
}
