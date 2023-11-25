type DBResult = {
  status: "success" | "error";
  result?: QueryResult | null;
};
type QueryParams = {
  cursor: number | null;
  limit: number;
  sortDirection: "ASC" | "DESC";
};
type AudioInput = {
  uri: string;
  durationSeconds: number;
  sourceLanguage: string;
  targetLanguage: string;
};
