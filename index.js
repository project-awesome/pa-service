var app = require('./app.js');


var server = app.listen(app.get('port'), function() {
	console.log('Node app is running on port', server.address().port);
});
