const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const AppError = require('../utils/AppError');
const dotenv = require("dotenv");
dotenv.config();
cloudinary.config({
  cloud_name: process.env.APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.APP_CLOUDINARY_API_KEY,
  api_secret: process.env.APP_CLOUDINARY_SECRET_KEY,
});

exports.uploadMultiple = async (req, res, next) => {
  try {

    const images = req.files;
    // Upload all images in parallel using Promise.all
    const uploadPromises = images.map(image =>
      cloudinary.uploader.upload(image.path, {
        resource_type: "auto", transformation: [{ width: 300, height: 300, crop: 'limit' }],
        quality: "auto",
      })
    );

    const results = await Promise.all(uploadPromises);
    req.images = results.map(result => result.secure_url);
    next();
  } catch (err) {
    next(new AppError(err.msg, 400));
  }
}
exports.uploadSingle = async (req, res, next) => {
  try {
    // Upload the image directly to Cloudinary
    if (!req.file) {
      return next();
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto"
    });

    req.image = result.secure_url; // Store image URL in request
    next();
  } catch (err) {
    next(new AppError(err.message || "Image upload failed", 400));
  }
};
// module.exports = uploadMultiple;