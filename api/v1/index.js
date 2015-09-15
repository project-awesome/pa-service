var projectAwesome = require('project-awesome');
var requestChecker = require('../../middleware/request-checker.js');
var requireQuery = requestChecker.requireQuery;

/*
module.exports.isSeedValid = QuizValidator.isSeedValid;

module.exports.isValidQuestionType = questions.isValidQuestionType;

module.exports.generateMoodleXML = MoodleExporter.generateMoodleXML;


module.exports.validateQuizDescriptor = QuizBuilder.validateQuizDescriptor;
module.exports.buildQuiz = QuizBuilder.build;
*/

module.exports = function(app) {

	app.get('/v1/is_seed_valid', requireQuery('seed'), function(req, res) {
		var is_seed_valid = projectAwesome.isSeedValid(req.query.seed);
		res.json({ is_seed_valid: is_seed_valid }).end();
	});

	app.get('/v1/is_valid_question_type', requireQuery('question_type'), function(req, res) {
		var is_valid_question_type = projectAwesome.isValidQuestionType(req.query.question_type);
		res.json({ is_valid_question_type: is_valid_question_type }).end();
	});

	app.get('/v1/generate_moodle_xml', 
		requireQuery('question_type'), 
		requireQuery('count'), 
		requireQuery('question_name'), 
		requireQuery('seed'), 
		function(req, res) {
			if (!projectAwesome.isSeedValid(req.query.seed)) {
				res.status(400).end();
				return;
			}
			if (!projectAwesome.isValidQuestionType(req.query.question_type)) {
				res.status(400).end();
				return;
			}
            var count = parseInt(req.query.count);
            if (isNaN(count) || count < 1 || count > 1000) {
                res.status(400).end();
                return;
            }
        	res.set('Content-Type', 'text/xml');
        	res.send(projectAwesome.generateMoodleXML(req.query.question_type, count, req.query.question_name, req.query.seed));
		}
	);
}











