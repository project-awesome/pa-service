var express = require('express');
	partials = require('express-partials');
	app = express();
	bodyParser = require('body-parser');
	projectAwesome = require('project-awesome');



app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'ejs');
app.use("/css",express.static(__dirname + "/css"));
app.use(partials());


app.get('/', function(req, res, next) {
	var page = "";
	res.render('index', page);
});


var lists = {};

projectAwesome.list('listableType').forEach( function (item) {
	lists[item] = projectAwesome.list(item);
});

// taken from stack overflow: http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



app.get(/\/([\S]+)\.html/, function(req, res, next) {
	var page = capitalizeFirstLetter(req.params[0])

	pageDescriptionArray = {
		"List":		"LIST all supported items from a given listableType.",
		"Check":	"CHECK whether a given value is valid for its type.",
		"Validate":	"VALIDATE a quiz descriptor",
		"Generate":	"GENERATE a quiz in the supported output format."
	}

	data = {
		lists: lists,
		page: page,
		pageDescription: pageDescriptionArray[page]
	}

	res.render(req.params[0], data );
})





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
