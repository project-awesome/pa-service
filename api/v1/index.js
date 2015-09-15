var projectAwesome = require('project-awesome');

/*
module.exports.isSeedValid = QuizValidator.isSeedValid;

module.exports.isValidQuestionType = questions.isValidQuestionType;

module.exports.generateMoodleXML = MoodleExporter.generateMoodleXML;


module.exports.validateQuizDescriptor = QuizBuilder.validateQuizDescriptor;
module.exports.buildQuiz = QuizBuilder.build;
*/


module.exports = function(app) {

	app.get('/v1/is_seed_valid', function(req, res) {
		if (!('seed' in req.query)) {
			res.status(400).end();
			return;
		}
		var is_seed_valid = projectAwesome.isSeedValid(req.query.seed);
		res.json({ is_seed_valid: is_seed_valid }).end();
	});

}











