class APIFeatures {
	constructor(query, queryObj) {
		this.query = query;
		this.queryObj = queryObj;
	}

	filter() {
		let queryString = JSON.stringify(this.queryObj);
		queryString = queryString.replace(/\b(lte|gte|lt|gt)\b/g, el => '$' + el);
		this.query = this.query.find(JSON.parse(queryString));
		return this;
	}

	sort() {
		if (this.queryObj.sort) {
			let sortQuery = this.queryObj.sort.split(',').join(' ');
			this.query.sort(sortQuery);
		}
		return this;
	}

	limitField() {
		if (this.queryObj.select) {
			let selectQuery = this.queryObj.select.split(',').join(' ');
			this.query.select(selectQuery);
		} else {
			this.query.select('-__v');
		}
		return this;
	}

	limitResult() {
		if (this.queryObj.limit) {
			this.query.limit(this.queryObj.limit);
		}
		return this;
	}

	paginate() {
		if (this.queryObj.page) {
			const page = this.queryObj.page * 1 || 1;
			const limit = this.queryObj.limit * 1 || 5;
			const skipNums = (page - 1) * limit;
			this.query.skip(skipNums).limit(limit);
		}
		return this;
	}
}

module.exports = APIFeatures;
