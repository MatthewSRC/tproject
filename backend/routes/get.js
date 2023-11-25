const express = require("express");

const { deleteFile } = require("../services/StorageService");
const { authenticateToken } = require("../middleware/authentication");

const router = express.Router();
router.use(authenticateToken);

/**
 * GET /deleteAudio
 * Deletes a specified audio file from storage by its name.
 *
 * @query fileName: The name of the file to delete.
 *
 * @response Success (200): File deleted successfully
 * @response Error (500): Bad request or error during file deletion
 */
router.get("/deleteAudio", async (req, res) => {
  const { fileName } = req.query;
  try {
    await deleteFile(fileName);
    res.status(200).json({
      status: "success",
    });
  } catch (e) {
    res.status(500).json({ status: "error", payload: e });
  }
});

module.exports = router;
