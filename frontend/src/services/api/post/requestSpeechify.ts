import { postFile } from "../base";
import mime from "mime";

export async function requestSpeechify(
  audioUri: string,
  name: string,
  sourceLanguageCode: string,
  targetLanguageCode: string,
  voiceName?: string
): Promise<FetchResponse> {
  const formData = new FormData();
  formData.append("file", {
    uri: audioUri,
    name,
    type: mime.getType(audioUri),
  } as any);
  const response = await postFile("speechify", formData, [
    { key: "sourceLanguageCode", value: sourceLanguageCode },
    { key: "targetLanguageCode", value: targetLanguageCode },
    { key: "voiceName", value: voiceName },
    // Set the default operation type to 'sync' for faster processing and testing purposes.
    // However, a check should be made for audio duration, as Cloud Speech requires async operations for audios longer than 60 seconds.
    { key: "operationType", value: "sync" },
  ]);
  return response;
}
