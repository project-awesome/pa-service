function requireQuery(name) {
	return function(req, res, next) {
		if (!(name in req.query)) {
			res.status(400).end();
			return;
		}
		next();
	}
}

module.exports.requireQuery = requireQuery;