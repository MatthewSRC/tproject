const express = require("express");
const { generateToken } = require("../middleware/authentication");
const { verifyIdToken } = require("../services/AuthService");

const router = express.Router();

/**
 * GET /getAccessToken
 * Generates and retrieves an access token for a valid user.
 *
 * @query idToken: Google id token used for verification and backend token generation.
 *
 * @response Success (200): Access token generated successfully
 * @response Error (400): The Id token is not valid
 */
router.get("/getAccessToken", async (req, res) => {
  const { idToken } = req.query;

  const verified = await verifyIdToken(idToken);

  if (!verified) {
    res.status(400).json({
      status: "error",
      payload: "Id token not valid",
    });
    return;
  }

  const generatedToken = generateToken(verified, res);

  res.status(200).json({
    status: "success",
    payload: generatedToken,
  });
});

module.exports = router;
