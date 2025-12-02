import multer from 'multer';
import path from 'path';
import ApiError from '../utils/ApiError.js';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Export different upload configurations
export const uploadSingle = upload.single('image');
export const uploadMultiple = upload.array('images', 5); // Max 5 images
export const uploadFields = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]);