const responseHandler = (
  res,
  success = false,
  code = 500,
  message = "",
  payload = null
) => {
  return res.status(code).json({
    success,
    message,
    payload
  });
};

module.exports = responseHandler;
