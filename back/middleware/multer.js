const multer = require("multer");

// Use disk storage instead of Cloudinary
const storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //     cb(null, "uploads/");
  // },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  // limits: { fileSize: 5 * 1024 * 1024 },
  // fileFilter: (req, file, cb) => {
  //     console.log("Uploading file:", file.originalname);
  //     if (!file.mimetype.startsWith("image/")) {
  //         return cb(new Error("Only image files are allowed!"), false);
  //     }
  //     cb(null, true);
  // },
})//.fields([{ name: "images", maxCount: 12 }]);

// Middleware to handle Multer errors
// const uploadMiddleware = (req, res, next) => {
//     upload(req, res, (err) => {
//         if (err) {
//             console.log("Multer Error:", err);
//             return res.status(400).json({ status: "error", message: err.message });
//         }
//         next();
//     });
// };

// module.exports = uploadMiddleware;
module.exports = upload;