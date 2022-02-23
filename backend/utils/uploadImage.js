const sharp = require('sharp');
const multer = require('multer');
const AppError = require('./appError');

const storage = multer.memoryStorage();

async function resizeUserPhoto(req, res, next) {
  if (!req.file) return next();

  if (!req.file.mimetype.startsWith('image')) {
    throw new AppError(403, 'Only accept image');
  }

  const dir = 'backend/public/img/users';
  const filename = `${req.user.id}-${Date.now()}`;
  const filePath = `${dir}/${filename}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({
      quality: 90,
    })
    .toFile(filePath);

  req.file.filename = `${filename}.jpeg`;
  return next();
}

const upload = multer({ storage });

module.exports = { upload, resizeUserPhoto };
