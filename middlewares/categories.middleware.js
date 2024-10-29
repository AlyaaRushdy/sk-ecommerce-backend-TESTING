const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images")); 
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") +
        "_" +
        file.originalname.replace(/ /g, "_")
    );
  },
});

const upload = multer({ storage: storage });

module.exports = { upload: upload.array("files", 5) };
