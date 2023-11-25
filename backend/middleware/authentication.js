const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate a user's access token.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The callback function to invoke if authentication succeeds.
 *
 * @middlewareBehavior If a valid access token is present in the request's Authorization header, the user is authenticated and the 'next' function is called. If no token is provided or if token verification fails, appropriate error responses are sent.
 */
function authenticateToken(req, res, next) {
  try {
    const token = req.header("Authorization");

    if (!token)
      return res.status(401).json({ status: "error", payload: "Unauthorized" });

    jwt.verify(token, process.env.SECRET_KEY, (err) => {
      if (err)
        return res.status(403).json({ status: "error", payload: "Forbidden" });
      next();
    });
  } catch (e) {
    res.status(500).json({ status: "error", payload: undefined });
  }
}

/**
 * Generates an access token for a user.
 *
 * @param {string} googleId - The google ID of the user
 * @param {Object} res - The HTTP response object.
 * @returns {string | undefined} - The generated access token or undefined in case of an error.
 */
function generateToken(googleId, res) {
  try {
    const token = jwt.sign({ googleId }, process.env.SECRET_KEY, {
      expiresIn: 3600,
    });
    return token;
  } catch (e) {
    res.status(500).json({ status: "error", payload: undefined });
  }
}

module.exports = { authenticateToken, generateToken };
