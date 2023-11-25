import { writeFile, unlink, DocumentDirectoryPath } from "react-native-fs";

async function createFile(path: string, content: string) {
  try {
    await writeFile(path, content, "base64");
  } catch (e) {
    throw e;
  }
}

async function removeFile(path: string) {
  try {
    await unlink(path);
  } catch (e) {
    throw e;
  }
}

function getLocalPath(): string {
  return DocumentDirectoryPath;
}

export { createFile, removeFile, getLocalPath };
