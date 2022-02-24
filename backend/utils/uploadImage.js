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

const resizeImgs = (field, config) => {
  // Handle config
  let { dir, multiple, width, height, format, quality } = config;
  dir = dir || './';
  multiple = multiple || false;
  width = width || 500;
  height = height || 500;
  format = format || 'jpeg';
  quality = quality || 90;

  return async (req, res, next) => {
    if (!req.files || !req.files[field]) return next();
    const imgs = req.files[field];
    const files = [];

    const promiseResize = imgs.map((img, index) => {
      const fileName = `${field}-${index}-${Date.now()}.jpeg`;
      files.push(fileName);
      return sharp(img.buffer)
        .resize(width, height)
        .toFormat(format)
        .jpeg({ quality })
        .toFile(`${dir}/${fileName}`);
    });

    await Promise.all(promiseResize);

    req.files[field] = multiple ? files : files[0];
    return next();
  };
};

const updateImgName = (req, res, next) => {
  if (!req.files) return next();
  req.body = Object.assign(req.body, req.files);
  return next();
};

const upload = multer({ storage });

module.exports = { upload, resizeUserPhoto, resizeImgs, updateImgName };
