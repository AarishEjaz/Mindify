// One place that decides the shape of every successful JSON response,
// so the whole API stays consistent and the frontend always knows what
// to expect: { success, message, data }.
const sendSuccess = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
  });
};

module.exports = { sendSuccess };
