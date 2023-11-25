import { MMKV } from "react-native-mmkv";
const storage = new MMKV();

function setStoredToken(token: string) {
  const now = Date.now();
  const tokenDurationMs = 3600 * 1000;
  const securityTimeWaste = 60 * 1000;
  const expirationTime = now + tokenDurationMs - securityTimeWaste;
  storage.set("token", JSON.stringify({ token, expirationTime }));
}

function getStoredToken(): string | undefined {
  const savedToken = storage.getString("token");
  if (!savedToken) return undefined;
  const token: { token: string; expirationTime: number } =
    JSON.parse(savedToken);
  const now = Date.now();
  if (now >= token.expirationTime) return undefined;
  return token.token;
}

function setStoredSourceLanguage(languageCode: string) {
  storage.set("sourceLanguage", languageCode);
}

function getStoredSourceLanguage(): string {
  const savedSourceLanguage = storage.getString("sourceLanguage");
  return savedSourceLanguage ?? "en-US";
}

function setStoredTargetLanguage(languageCode: string) {
  storage.set("targetLanguage", languageCode);
}

function getStoredTargetLanguage(): string {
  const savedTargetLanguage = storage.getString("targetLanguage");
  return savedTargetLanguage ?? "it-IT";
}

function setSettings(settings: Settings) {
  storage.set("settings", JSON.stringify(settings));
}

function getSettings(): Settings {
  const settings = storage.getString("settings");
  if (!settings) return { instantAudioDelete: false };
  return JSON.parse(settings);
}

export {
  setStoredToken,
  getStoredToken,
  setStoredSourceLanguage,
  getStoredSourceLanguage,
  setStoredTargetLanguage,
  getStoredTargetLanguage,
  setSettings,
  getSettings,
};
