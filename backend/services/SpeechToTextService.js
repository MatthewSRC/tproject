const { SpeechClient } = require("@google-cloud/speech").v2;

const speechClient = new SpeechClient();

/**
 * Transcribes long audio content from a specified URI into text.
 *
 * @param {string} uri - The URI of the audio content to be transcribed.
 * @param {string} languageCode - Language code of the spoken language in the audio.
 * @returns {string | undefined} - Transcription of the audio content or undefined if no results are obtained.
 */
async function recognizeLongSpeech(uri, languageCode) {
  const request = {
    config: {
      autoDecodingConfig: {},
      languageCodes: [languageCode],
      model: "latest_long",
      features: {
        enableAutomaticPunctuation: true,
      },
    },
    recognizer: `projects/${process.env.PROJECT_ID}/locations/global/recognizers/_`,
    recognitionOutputConfig: {
      inlineResponseConfig: {},
    },
    files: [
      {
        uri,
      },
    ],
  };

  const [operation] = speechClient.batchRecognize(request);
  const [response] = await operation.promise();

  if (
    response.results &&
    uri in response.results &&
    response.results[uri].transcript.results.length > 0
  ) {
    const transcript =
      response.results[uri].transcript.results[0].alternatives[0].transcript;
    return transcript;
  }
}

/**
 * Transcribes audio content from a Base64 encoded source into text.
 *
 * @param {string} content - Base64 encoded audio content.
 * @param {string} languageCode - Language code of the spoken language in the audio.
 * @returns {string | undefined} - Transcription of the audio content or undefined if no results are obtained.
 */
async function recognizeSpeech(content, languageCode) {
  const request = {
    recognizer: `projects/${process.env.PROJECT_ID}/locations/global/recognizers/_`,
    config: {
      autoDecodingConfig: {},
      languageCodes: [languageCode],
      model: "latest_long",
    },
    content,
  };

  const [response] = await speechClient.recognize(request);

  if (!response.results) return;

  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");

  return transcription;
}

module.exports = {
  recognizeSpeech,
  recognizeLongSpeech,
};
