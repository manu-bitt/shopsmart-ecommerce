const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (e) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: e.errors,
    });
  }
};

export default validateRequest;
