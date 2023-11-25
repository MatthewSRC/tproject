const { OAuth2Client } = require("google-auth-library");

const authClient = new OAuth2Client();

/**
 * Verifies an ID token for user authentication.
 *
 * @param {string} idToken - The ID token to be verified.
 * @returns {string | undefined} - Google Id if the token is valid and the user's email is verified; otherwise, it resolves to undefined.
 */
async function verifyIdToken(idToken) {
  try {
    const ticket = await authClient.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (payload["sub"] && payload["email_verified"]) return payload["sub"];
    return undefined;
  } catch (e) {
    return false;
  }
}

module.exports = {
  verifyIdToken,
};
