module.exports = function(app) {
	require('./v1')(app);
	app.get('*', function(req, res) {
		res.status(404).end();
	});
}