const multer = require("multer");

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const multerUpload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: fileFilter,
});

// Middleware for handling uploads and error checking
const uploadWithErrorHandler = (uploadMethod) => {
  return (req, res, next) => {
    // Call the specified multer upload method (array or single)
    uploadMethod(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ error: "File size exceeds the 3 MB limit" });
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({ error: "Exceeded maximum file count" });
        }
        if (err.message) {
          return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: "An unexpected error occurred." });
      }
      next();
    });
  };
};

const uploadArray = (fieldName, maxCount) => {
  return uploadWithErrorHandler(multerUpload.array(fieldName, maxCount));
};

const uploadSingle = (fieldName) => {
  return uploadWithErrorHandler(multerUpload.single(fieldName));
};

module.exports = { uploadArray, uploadSingle };
