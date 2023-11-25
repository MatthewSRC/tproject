const { TranslationServiceClient } = require("@google-cloud/translate");

const translationClient = new TranslationServiceClient();

/**
 * Requests translation of text from a source language to a target language using the Translation API.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLanguageCode - Language code of the source text.
 * @param {string} targetLanguageCode - Language code of the target translation.
 * @returns {string | undefined} - The translated text or undefined if no translations are obtained.
 */
async function requestTranslation(
  text,
  sourceLanguageCode,
  targetLanguageCode
) {
  const request = {
    parent: `projects/${process.env.PROJECT_ID}/locations/global`,
    contents: [text],
    mimeType: "text/plain",
    sourceLanguageCode,
    targetLanguageCode,
  };

  const [response] = await translationClient.translateText(request);

  if (!response.translations || response.translations.length === 0)
    return undefined;

  return response.translations[0].translatedText;
}

module.exports = {
  requestTranslation,
};
