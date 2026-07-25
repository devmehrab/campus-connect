import { Embeddings } from "@langchain/core/embeddings";

export class LocalEmbeddings extends Embeddings {
  private pipelinePromise: Promise<any>;

  constructor() {
    super({});
    this.pipelinePromise = (async () => {
      const { pipeline } = await import("@xenova/transformers");
      return pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    })();
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const pipe = await this.pipelinePromise;
    return Promise.all(
      texts.map(async (text) => {
        const res = await pipe(text, { pooling: "mean", normalize: true });
        return Array.from(res.data) as number[];
      }),
    );
  }

  async embedQuery(text: string): Promise<number[]> {
    const pipe = await this.pipelinePromise;
    const res = await pipe(text, { pooling: "mean", normalize: true });
    return Array.from(res.data) as number[];
  }
}
