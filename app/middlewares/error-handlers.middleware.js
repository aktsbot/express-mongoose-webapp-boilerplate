export const notFound = (req, res, next) => {
  next({
    status: 404,
    message: "Resource or page not found",
  });
};

export const errorHandler = (error, req, res, next) => {
  let status = error.status || 500;
  let message = error.message || "";
  let errors = error.errors || [];
  let messageCode = error.messageCode || "";

  if (error.isJSON) {
    return res.status(status).json({
      message,
      errors,
      messageCode,
    });
  }

  res.send(status);
  return res.render("pages/error.html", {
    title: `${status} - Error`,
    message,
    errors,
    status,
    messageCode,
  });
};
