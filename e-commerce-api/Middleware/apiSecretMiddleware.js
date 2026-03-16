function apiSecretMiddleware(req, res, next) {
  const apiKey = req.headers["x-api-key"] || "";

  if (apiKey !== process.env.API_SECRET) {
    return res.status(403).json({
      success: false,
      message: "Invalid API key",
    });
  }

  next();
}

module.exports = apiSecretMiddleware;