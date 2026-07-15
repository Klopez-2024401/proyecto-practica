import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../configs/cloudinary.js';
import { config } from '../configs/config.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: config.cloudinary.folder,
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    const error = new Error('El archivo debe ser una imagen (jpg, jpeg, png o webp).');
    error.statusCode = 400;
    return cb(error);
  }
  cb(null, true);
};

const rawUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('profilePicture');

export const uploadProfilePicture = (req, res, next) => {
  rawUpload(req, res, (error) => {
    if (error) {
      error.statusCode = error.statusCode || 400;
      return next(error);
    }
    next();
  });
};
