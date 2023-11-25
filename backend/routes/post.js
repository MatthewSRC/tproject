const express = require("express");
const { requestTranslation } = require("../services/TranslationService");
const {
  recognizeSpeech,
  recognizeLongSpeech,
} = require("../services/SpeechToTextService");
const { synthesizeText } = require("../services/TextToSpeechService");
const { uploadFile, deleteFile } = require("../services/StorageService");
const { authenticateToken } = require("../middleware/authentication");
const upload = require("../middleware/upload");

const router = express.Router();
router.use(authenticateToken);

/**
 * POST /speechify
 * Transcribes, translates, and synthesizes audio content from an uploaded file.
 *
 * @query sourceLanguageCode: Language code of the input language
 * @query targetLanguageCode: Language code of the output language
 * @query voiceName: Text-to-speech voice name
 * @query operationType: 'sync' for synchronous recognition or 'async' for asynchronous recognition
 *
 * @requestPayload Input audio file
 * @response Success (200): Translated and synthesized audio file
 * @response Error (400): No file uploaded
 * @response Error (500): Transcription is undefined
 * @response Error (500): Translation is undefined
 * @response Error (500): Synthesized text is undefined
 * @response Error (500): Internal server error
 */
router.post("/speechify", upload.single("file"), async (req, res) => {
  const { sourceLanguageCode, targetLanguageCode, voiceName, operationType } =
    req.query;

  if (!req.file) {
    return res
      .status(400)
      .json({ status: "error", payload: "No file uploaded" });
  }

  try {
    let transcription;

    if (operationType === "async") {
      const uri = await uploadFile(req.file);
      transcription = await recognizeLongSpeech(uri, sourceLanguageCode);
      deleteFile(req.file.originalname);
    } else {
      transcription = await recognizeSpeech(
        req.file.buffer.toString("base64"),
        sourceLanguageCode
      );
    }

    if (!transcription) {
      return res.status(500).json({
        status: "error",
        payload: "Transcription is undefined",
      });
    }

    const translation = await requestTranslation(
      transcription,
      sourceLanguageCode,
      targetLanguageCode
    );

    if (!translation) {
      return res.status(500).json({
        status: "error",
        payload: "Translation is undefined",
      });
    }

    const synthesized = await synthesizeText(translation, {
      languageCode: targetLanguageCode,
      name: voiceName,
    });

    if (!synthesized) {
      return res.status(500).json({
        status: "error",
        payload: "Synthesized text is undefined",
      });
    }

    res.setHeader("Content-Type", "audio/m4a");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="translated-${req.file.originalname}"`
    );
    res.send(synthesized);
  } catch (e) {
    if (operationType === "async") deleteFile(req.file.originalname);
    res.status(500).json({
      status: "error",
      payload: e,
    });
  }
});

/**
 * POST /uploadAudio
 * Uploads an audio file to the server.
 *
 * @requestPayload Input audio file
 * @response Success (200): File uploaded successfully
 * @response Error (400): No file uploaded
 * @response Error (500): Internal server error
 */
router.post("/uploadAudio", upload.single("file"), async (req, res) => {
  if (!req.file)
    return res
      .status(400)
      .json({ status: "error", payload: "No file uploaded" });
  try {
    await uploadFile(req.file);
    res.status(200).json({
      status: "success",
    });
  } catch (e) {
    res.status(500).json({ status: "error", payload: e });
  }
});

/**
 * POST /synthesizeText
 * Synthesizes text into audio using a specified voice configuration.
 *
 * @requestPayload Text and voice configuration
 * @response Success (200): Base64 encoded audio string of the synthesized text
 * @response Error (500): Synthesized text is undefined
 * @response Error (500): Internal server error
 */
router.post("/synthesizeText", async (req, res) => {
  const { text, voice } = req.body;

  try {
    const synthesized = await synthesizeText(text, voice);

    if (synthesized) {
      res.status(200).json({
        status: "success",
        payload: synthesized,
      });
    } else {
      res.status(500).json({
        status: "error",
        payload: "Synthesized text is undefined",
      });
    }
  } catch (e) {
    res.status(500).json({ status: "error", payload: e });
  }
});

/**
 * POST /requestTranslation
 * Translates text from a source language to a target language.
 *
 * @requestPayload Text and source/target language codes
 * @response Success (200): Translated text
 * @response Error (500): Translation is undefined
 * @response Error (500): Internal server error
 */
router.post("/requestTranslation", async (req, res) => {
  const { text, languages } = req.body;

  try {
    const translation = await requestTranslation(
      text,
      languages.sourceLanguageCode,
      languages.targetLanguageCode
    );

    if (translation) {
      res.status(200).json({
        status: "success",
        payload: translation,
      });
    } else {
      res.status(500).json({
        status: "error",
        payload: "Translation is undefined",
      });
    }
  } catch (e) {
    res.status(500).json({ status: "error", payload: e });
  }
});

/**
 * POST /recognizeSpeech
 * Recognizes speech in an audio file (synchronously or asynchronously) and returns the transcription.
 *
 * @requestPayload  The request payload containing one of the following:
 *   - 'uri' (GCS URI of the audio file)
 *   - 'content' (Base64 encoded audio content)
 *   And both
 *   - 'languageCode' (Language code of the audio content)
 *   - 'operationType' ('sync' for synchronous recognition or 'async' for asynchronous recognition)
 *
 * @response Success (200): Transcription of the audio content
 * @response Error (500): Transcription is undefined
 * @response Error (500): Internal server error
 */
router.post("/recognizeSpeech", async (req, res) => {
  const { uri, content, languageCode, operationType } = req.body;

  try {
    const transcription =
      operationType === "sync"
        ? await recognizeSpeech(content, languageCode)
        : await recognizeLongSpeech(uri, languageCode);

    if (transcription) {
      res.status(200).json({
        status: "success",
        payload: transcription,
      });
    } else {
      res.status(500).json({
        status: "error",
        payload: undefined,
      });
    }
  } catch (e) {
    res.status(500).json({ status: "error", payload: e });
  }
});

module.exports = router;
