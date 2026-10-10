import axios from 'axios';

export class EmbeddingService {
  private ollamaUrl: string;
  private modelName: string;

  constructor() {
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://host.docker.internal:11434';
    this.modelName = 'nomic-embed-text';
  }

  public async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await axios.post(`${this.ollamaUrl}/api/embeddings`, {
        model: this.modelName,
        prompt: text,
      });
      return response.data.embedding;
    } catch (error) {
      console.error('Hiba az embedding generálás közben:', error);
      throw new Error('Failed to generate vector embedding from Ollama');
    }
  }
}