const handleValidationError = (error) => {
  if (error.name === "ValidationError") {
    return Object.values(error.errors).map((err) => ({
      field: err.path,
      message: err.message,
    }));
  }
  return null;
};

module.exports = { handleValidationError };
