import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  res.status(500).json({
    message: "Server Error",
  });
};

export default errorHandler;
