const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMultipleImages = async (images, folder) => {
  const imageUploadPromises = images.map((image) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folder },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result.secure_url);
        }
      );

      streamifier.createReadStream(image.buffer).pipe(uploadStream);
    });
  });

  // Wait for all image uploads to finish
  const uploadedImages = await Promise.all(imageUploadPromises);
  return uploadedImages;
};

const uploadSingleImage = (image, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    // Stream the buffer to Cloudinary
    streamifier.createReadStream(image.buffer).pipe(uploadStream);
  });
};

module.exports = { uploadMultipleImages, uploadSingleImage };
