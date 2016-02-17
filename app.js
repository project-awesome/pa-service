var express = require('express');
var app = express();
var bodyParser = require('body-parser');



app.set('port', (process.env.PORT || 5000));

app.use(express.static('tests'));

app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(function logHttpRequest(req, res, next) {
	var msg = req.method + " " + req.url;
	if (JSON.stringify(req.body) != "{}") {
		msg = msg + "  params: " + JSON.stringify(req.body);
	}
	console.log(msg);
    next();
});

// api routes ======================================================================
require('./api')(app);



// Exports application for testing
module.exports = app;

