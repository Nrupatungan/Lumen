export type ProgressEvent = {
  jobId: string;
  progress: number;
  message?: string;
};

export type EmbeddingChunk = {
  text: string;
  chunkIndex: number;
  documentId: string;
};
