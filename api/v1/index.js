var projectAwesome = require('project-awesome');

/*
module.exports.isSeedValid = QuizValidator.isSeedValid;

module.exports.isValidQuestionType = questions.isValidQuestionType;

module.exports.generateMoodleXML = MoodleExporter.generateMoodleXML;


module.exports.validateQuizDescriptor = QuizBuilder.validateQuizDescriptor;
module.exports.buildQuiz = QuizBuilder.build;
*/

function requireParam(param) {
	return function(req, res, next) {
		if (!(param in req.query)) {
			res.status(400).end();
			return;
		}
		next();
	}
}

module.exports = function(app) {

	app.get('/v1/is_seed_valid', requireParam('seed'), function(req, res) {
		var is_seed_valid = projectAwesome.isSeedValid(req.query.seed);
		res.json({ is_seed_valid: is_seed_valid }).end();
	});

	app.get('/v1/is_valid_question_type', requireParam('question_type'), function(req, res) {
		var is_valid_question_type = projectAwesome.isValidQuestionType(req.query.question_type);
		res.json({ is_valid_question_type: is_valid_question_type }).end();
	});

}











