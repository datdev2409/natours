const asyncHandler = require('express-async-handler')
const AppError = require('../utils/appError')
const APIFeatures = require('../utils/apiFeatures')

class Factory {
	createOne = Model => {
		return asyncHandler(async (req, res, next) => {
			const newDoc = await Model.create(req.body)
			res.status(200).json({ status: 'success', data: newDoc })
		})
	}

	updateOne = Model => {
		return asyncHandler(async (req, res, next) => {
			const id = req.params.id
			const updatedDoc = await Model.findByIdAndUpdate(id, req.body, {
				new: true,
				runValidators: true
			})
			if (!updatedDoc) throw new AppError('No document found with that id', 404)
			res.status(200).json({ status: 'success', data: updatedDoc })
		})
	}

	deleteOne = Model => {
		return asyncHandler(async (req, res, next) => {
			const id = req.params.id
			const doc = await Model.findByIdAndDelete(id)
			if (!doc) throw new AppError('No document found with that id', 404)
			res.status(204).json({ status: 'success', data: null })
		})
	}

	getOne = (Model, populateOpts) => {
		return asyncHandler(async (req, res, next) => {
			let query = Model.findById(req.params.id)
			query = populateOpts ? query.populate(populateOpts) : query
			const doc = await query
			if (!doc) throw new AppError('No document found with that id', 404)
			res.status(200).json({ status: 'success', data: doc })
		})
	}

	getAll = Model => {
		return asyncHandler(async (req, res, next) => {
			const options = ['all']
			const features = new APIFeatures(Model.find(), req.query, options)
			const docs = await features.query
			res.status(200).json({
				status: 'success',
				data: {
					numbers: docs.length,
					docs: docs
				}
			})
		})
	}
}

module.exports = new Factory()
