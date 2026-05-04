import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;
// Single-thread : SharedArrayBuffer non dispo sans headers COOP/COEP
(env.backends as { onnx: { wasm: { numThreads: number } } }).onnx.wasm.numThreads = 1;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let embedder: any = null;

self.addEventListener('message', async (event: MessageEvent) => {
  const { type, id, text } = event.data as { type: string; id: number; text?: string };

  if (type === 'load') {
    try {
      embedder = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2', { dtype: 'q8' });
      self.postMessage({ type: 'loaded', id });
    } catch (error) {
      self.postMessage({ type: 'error', id, error: String(error) });
    }
  }

  if (type === 'embed') {
    try {
      if (!embedder) throw new Error('Modèle non chargé');
      const output = await embedder(text, { pooling: 'mean', normalize: true });
      // Transférer le Float32Array directement (zero-copy)
      const arr = new Float32Array(output.data);
      self.postMessage({ type: 'result', id, data: arr }, { transfer: [arr.buffer] });
    } catch (error) {
      self.postMessage({ type: 'error', id, error: String(error) });
    }
  }
});
