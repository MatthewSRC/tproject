const textToSpeech = require("@google-cloud/text-to-speech");

const ttsClient = new textToSpeech.TextToSpeechClient();

/**
 * Synthesizes text into speech using a specified voice and returns the audio content.
 *
 * @param {string} text - The text to be synthesized into speech.
 * @param {object} voice - The voice configuration specifying the desired voice for synthesis.
 * @returns {string | undefined} - The audio content in MP3 format or undefined if no response is obtained.
 */
async function synthesizeText(text, voice) {
  const request = {
    input: { text },
    voice,
    audioConfig: { audioEncoding: "MP3" },
  };

  const [response] = await ttsClient.synthesizeSpeech(request);
  if (!response) return undefined;

  return response.audioContent;
}

module.exports = {
  synthesizeText,
};
