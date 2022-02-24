const sharp = require('sharp');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

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

const uploadImgs = (...fieldInfos) => {
  const pipe = [];
  const fields = fieldInfos.map((field) => ({
    name: field.name,
    maxCount: field.maxCount,
  }));

  pipe.push(upload.fields(fields));
  fields.forEach((field, index) =>
    pipe.push(resizeImgs(field.name, fieldInfos[index]))
  );
  pipe.push(updateImgName);

  return pipe;
};

module.exports = uploadImgs;
// module.exports = { upload, resizeImgs, updateImgName, uploadImgs };
