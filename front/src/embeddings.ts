// Wrapper autour du Web Worker d'embedding

let worker: Worker | null = null;
let msgId = 0;
const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('./embedding.worker.ts', import.meta.url), { type: 'module' });
    worker.addEventListener('message', (event: MessageEvent) => {
      const { type, id, data, error } = event.data as {
        type: string; id: number; data?: Float32Array; error?: string;
      };
      const p = pending.get(id);
      if (!p) return;
      pending.delete(id);
      if (type === 'error') p.reject(new Error(error ?? 'Erreur worker'));
      else p.resolve(data);
    });
    worker.addEventListener('error', (e) => {
      console.error('Worker error:', e);
    });
  }
  return worker;
}

function send(type: string, extra?: Record<string, unknown>): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const id = msgId++;
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ type, id, ...extra });
  });
}

export async function loadEmbedder(onProgress?: (msg: string) => void): Promise<void> {
  onProgress?.("Chargement du modèle d'embedding...");
  await send('load');
  onProgress?.('Modèle prêt');
}

export async function embed(text: string): Promise<number[]> {
  const result = await send('embed', { text });
  return Array.from(result as Float32Array);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}
