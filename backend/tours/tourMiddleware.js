exports.aliasTopCheapTour = function (req, res, next) {
	req.query.limit = 5;
	req.query.sort = '-ratingsAverage,price';
	next();
};
