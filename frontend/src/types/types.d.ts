type SpeechifyStatus =
  | "WAITING"
  | "LISTENING"
  | "PROCESSING"
  | "PLAYING"
  | "ERROR";
type LanguageItemDisplayMode = "FLAG" | "FULL" | "LABEL";
type TranslatableLanguage = {
  code: string;
  label: string;
  voices: string[];
};
type SelectionType = "SOURCE" | "TARGET";
type TranslatedAudio = {
  id: number;
  uri: string;
  durationSeconds: number;
  sourceLanguage: string;
  targetLanguage: string;
  creationTime: string; // ISO 8601 timestamp
};
type Settings = { instantAudioDelete: boolean };
