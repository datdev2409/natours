const AppError = require('./appError');

exports.getAll = (Model) => async () => {
  const docs = await Model.find({});
  return docs;
};

exports.createOne = (Model) => async (body) => {
  const doc = await Model.create(body);
  return doc;
};

exports.getOne = (Model) => async (id) => {
  const doc = await Model.findById(id);
  if (!doc) throw new AppError('No doc found with id', 404);
  return doc;
};

exports.deleteOne = (Model) => async (id) => {
  await Model.findByIdAndRemove(id);
};

exports.updateOne = (Model) => async (id, body) => {
  const doc = await Model.findByIdAndUpdate(id, body, {
    returnDocument: 'after',
  });

  return doc;
};
