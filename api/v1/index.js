var projectAwesome = require('project-awesome');
var requestChecker = require('../../middleware/request-checker.js');
var requireQuery = requestChecker.requireQuery;

module.exports = function(app) {

	app.get('/v1/check', function(req,res) {
		try {
			res.json({valid: projectAwesome.check(req.query.type, req.query.value)});
		}catch(e) {
			res.status(400).json({error: e}).end();

		}
	});

	app.get('/v1/list', function(req, res) {
		try {
			res.json({list: projectAwesome.list(req.query.type)});
		} catch(e) {
			res.status(400).json({error: e}).end();
		}
	});



	app.post('/v1/generate', function(req,res) {
		try {
			res.json({quiz: projectAwesome.generate(req.body.type, req.body.qd, req.body.seed)});
		}catch(e) {
			res.status(400).json({error: e}).end();
		}
	});

	app.post('/v1/validate', function(req,res) {

		try {
			res.json({result: projectAwesome.validate(req.body.type, req.body.value)});
		}catch(e) {
			res.status(400).json({error : e}).end();
		}
	});




}

// 	app.get('/v1/is_seed_valid', requireQuery('seed'), function(req, res) {
// 		var is_seed_valid = projectAwesome.isSeedValid(req.query.seed);
// 		res.json({ is_seed_valid: is_seed_valid }).end();
// 	});

// 	app.get('/v1/is_valid_question_type', requireQuery('question_type'), function(req, res) {
// 		var is_valid_question_type = projectAwesome.isValidQuestionType(req.query.question_type);
// 		res.json({ is_valid_question_type: is_valid_question_type }).end();
// 	});

// 	app.get('/v1/generate_moodle_xml',
// 		requireQuery('question_type'),
// 		requireQuery('count'),
// 		requireQuery('question_name'),
// 		requireQuery('seed'),
// 		function(req, res) {
// 			if (!projectAwesome.isSeedValid(req.query.seed)) {
// 				res.status(400).end();
// 				return;
// 			}
// 			if (!projectAwesome.isValidQuestionType(req.query.question_type)) {
// 				res.status(400).end();
// 				return;
// 			}
//             var count = parseInt(req.query.count);
//             if (isNaN(count) || count < 1 || count > 1000) {
//                 res.status(400).end();
//                 return;
//             }
//         	res.set('Content-Type', 'text/xml');
//         	res.send(projectAwesome.generateMoodleXML(req.query.question_type, count, req.query.question_name, req.query.seed));
// 		}
// 	);

// 	app.post('/v1/validate_quiz_descriptor', function(req, res) {
// 		if (!('descriptor' in req.body)) {
// 			res.status(400).end();
// 			return;
// 		}
// 		res.json(projectAwesome.validateQuizDescriptor(req.body.descriptor));
// 	});

// 	app.post('/v1/build_quiz', function(req, res) {
// 		if (!('descriptor' in req.body)) {
// 			res.status(400).end();
// 			return;
// 		}
// 		if (!('seed' in req.body)) {
// 			res.status(400).end();
// 			return;
// 		}
// 		if (!projectAwesome.isSeedValid(req.body.seed)) {
// 			res.status(400).end();
// 			return;
// 		}
// 		if (projectAwesome.validateQuizDescriptor(req.body.descriptor).length > 0) {
// 			res.status(400).end();
// 			return;
// 		}
// 		res.json(projectAwesome.buildQuiz(req.body.descriptor, req.body.seed));
// 	});
