import { SQLBatchTuple, open } from "react-native-quick-sqlite";

const DB_NAME = "DB_TRANSLATIONS";

async function createTables(): Promise<DBResult> {
  try {
    const db = open({ name: DB_NAME });
    const query =
      "CREATE TABLE IF NOT EXISTS translations (id INTEGER PRIMARY KEY AUTOINCREMENT, uri TEXT, duration_seconds INTEGER, source_language Text, target_language TEXT, creation_time TEXT)";
    const result = await db.executeAsync(query);
    return { status: "success", result };
  } catch (e) {
    return { status: "error" };
  }
}

async function retrieveTranslations(
  queryParams: Partial<QueryParams>
): Promise<DBResult> {
  try {
    const db = open({ name: DB_NAME });

    let query = "SELECT * FROM translations";
    const params = [];

    if (queryParams.cursor) {
      if (!queryParams.sortDirection || queryParams.sortDirection === "ASC")
        query += " WHERE id > ?";
      else query += " WHERE id < ?";
      params.push(queryParams.cursor);
    }

    if (queryParams.sortDirection) {
      query += ` ORDER BY creation_time ${queryParams.sortDirection}`;
    }

    if (queryParams.limit) {
      query += " LIMIT ?";
      params.push(queryParams.limit);
    }

    const result = await db.executeAsync(query, params);

    return { status: "success", result };
  } catch (e) {
    console.error(e);
    return { status: "error" };
  }
}

async function saveTranslation(input: AudioInput): Promise<DBResult> {
  try {
    const db = open({ name: DB_NAME });
    const query =
      "INSERT INTO translations (uri, duration_seconds, source_language, target_language, creation_time) VALUES (?, ?, ?, ?, ?)";
    const params = [
      input.uri,
      input.durationSeconds,
      input.sourceLanguage,
      input.targetLanguage,
      new Date().toISOString(),
    ];
    const result = await db.executeAsync(query, params);
    return { status: "success", result };
  } catch (e) {
    return { status: "error" };
  }
}

async function resetTranslations() {
  try {
    const db = open({ name: DB_NAME });
    const queries: SQLBatchTuple[] = [
      ["DELETE FROM translations"],
      ["DELETE FROM SQLITE_SEQUENCE WHERE name='translations'"],
    ];

    await db.executeBatchAsync(queries);

    return { status: "success" };
  } catch (e) {
    return { status: "error" };
  }
}

export {
  createTables,
  retrieveTranslations,
  saveTranslation,
  resetTranslations,
};
