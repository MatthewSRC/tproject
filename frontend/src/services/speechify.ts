import { requestSpeechify } from "./api/post/requestSpeechify";
import { convertBufferToBase64 } from "./converter";
import { removeFile, getLocalPath, createFile } from "./fileManager";
import languages from "~/localization/languages.json";

export async function speechify(
  uri: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<
  | {
      uri: string;
      cleanUp: () => void;
    }
  | undefined
> {
  try {
    const name = uri.split("/")[uri.split("/").length - 1];
    const response = await requestSpeechify(
      uri,
      name,
      sourceLanguage,
      targetLanguage,
      languages.find((e) => e.code === targetLanguage)?.voices[0]
    );
    removeFile(uri);
    if (response.status !== "success") return undefined;
    const translatedFileUri = getLocalPath().concat("/", "translated-", name);
    await createFile(
      translatedFileUri,
      convertBufferToBase64(response.payload as ArrayBuffer)
    );
    return {
      uri: translatedFileUri,
      cleanUp: () => removeFile(translatedFileUri),
    };
  } catch (e) {
    removeFile(uri);
    return undefined;
  }
}
