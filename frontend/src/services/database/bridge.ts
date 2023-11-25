import { QueryResult } from "react-native-quick-sqlite";
import {
  createTables,
  resetTranslations,
  retrieveTranslations,
  saveTranslation,
} from "./operations";
import { removeFile } from "../fileManager";

async function retrieveTranslatedAudios(
  queryParams: Partial<QueryParams>
): Promise<{ cursor: number | null; data: TranslatedAudio[] }> {
  const operation = await retrieveTranslations(queryParams);

  if (operation.status === "error" || !operation.result)
    throw new Error("DB Error - Select");

  const { rows } = operation.result as QueryResult;

  if (!rows || rows.length === 0) return { cursor: null, data: [] };

  let newCursor = null;

  if (queryParams.limit) {
    if (!queryParams.sortDirection || queryParams.sortDirection === "ASC") {
      const reached = (queryParams.cursor ?? 0) + queryParams.limit;
      newCursor = rows.length < queryParams.limit ? null : reached;
    } else {
      const reached =
        (queryParams.cursor ?? rows._array[0].id) - queryParams.limit;
      newCursor = rows.length < queryParams.limit ? null : reached;
    }
  }

  return {
    cursor: newCursor,
    data: rows._array.map((e) => ({
      id: e.id,
      uri: e.uri,
      durationSeconds: e.duration_seconds,
      sourceLanguage: e.source_language,
      targetLanguage: e.target_language,
      creationTime: e.creation_time,
    })),
  };
}

async function saveTranslatedAudio(input: AudioInput) {
  const operation = await saveTranslation(input);
  if (operation.status === "error") throw new Error("DB Error - Create");
}

async function clearTranslatedAudios() {
  const operationSelect = await retrieveTranslations({});

  if (operationSelect.status === "error" || !operationSelect.result)
    throw new Error("DB Error - Select");

  const { rows } = operationSelect.result as QueryResult;

  if (!rows || rows.length === 0) return;

  try {
    rows._array.forEach((e) => removeFile(e.uri));
  } catch (e) {
    throw new Error("File Error - Delete");
  }

  resetTranslations().catch(() => {
    throw new Error("DB Error - Delete");
  });
}

async function setupDatabase() {
  const operation = await createTables();

  if (operation.status === "error") throw new Error("DB Error - Setup");
}

export {
  retrieveTranslatedAudios,
  saveTranslatedAudio,
  clearTranslatedAudios,
  setupDatabase,
};
