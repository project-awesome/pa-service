// testing modules
var request = require('supertest');
var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);
var expect = chai.expect;

// for mocking
var projectAwesome = require('project-awesome');

// web app
var app = require('../../../app.js');
var server;





describe('v1 API', function() {

    before(function(done) {
        server = app.listen(app.get('port'), function() {
            done();
        });
    });

    after(function() {
        server.close();
    });



    describe('GET /generate_moodle_xml', function() {
        describe('bad requests', function() {
            describe('no question_type parameter', function() {
                it('should respond with 400', function(done) {
                    request(app)
                    .get('/v1/generate_moodle_xml?count=10&question_name=blah&seed=blah')
                    .expect(400)
                    .end(done);
                });
            });
            describe('no count parameter', function() {
                it('should respond with 400', function(done) {
                    request(app)
                    .get('/v1/generate_moodle_xml?question_type=blah&question_name=blah&seed=blah')
                    .expect(400)
                    .end(done);
                });
            });
            describe('no question_name parameter', function() {
                it('should respond with 400', function(done) {
                    request(app)
                    .get('/v1/generate_moodle_xml?question_type=blah&count=10&seed=blah')
                    .expect(400)
                    .end(done);
                });
            });
            describe('no seed parameter', function() {
                it('should respond with 400', function(done) {
                    request(app)
                    .get('/v1/generate_moodle_xml?question_type=blah&count=10&question_name=blah')
                    .expect(400)
                    .end(done);
                });
            });
        });
        describe('when seed is invalid', function() {
            var isSeedValidStub;
            var isValidQuestionTypeStub;
            before(function() {
                isSeedValidStub = sinon.stub(projectAwesome, 'isSeedValid', function() { return false; });
                isValidQuestionTypeStub = sinon.stub(projectAwesome, 'isValidQuestionType', function() { return true; });
            });
            after(function() {
                isSeedValidStub.restore();
                isValidQuestionTypeStub.restore();
            });
            it('should respond with 400', function(done) {
                request(app)
                .get('/v1/generate_moodle_xml?question_type=blah&count=10&question_name=blah&seed=blah')
                .expect(400)
                .end(done);
            });
        });
        describe('when question type is invalid', function() {
            var isSeedValidStub;
            var isValidQuestionTypeStub;
            before(function() {
                isSeedValidStub = sinon.stub(projectAwesome, 'isSeedValid', function() { return true; });
                isValidQuestionTypeStub = sinon.stub(projectAwesome, 'isValidQuestionType', function() { return false; });
            });
            after(function() {
                isSeedValidStub.restore();
                isValidQuestionTypeStub.restore();
            });
            it('should respond with 400', function(done) {
                request(app)
                .get('/v1/generate_moodle_xml?question_type=blah&count=10&question_name=blah&seed=blah')
                .expect(400)
                .end(done);
            });
        });
        describe('when count is invalid', function() {
            var isSeedValidStub;
            var isValidQuestionTypeStub;
            before(function() {
                isSeedValidStub = sinon.stub(projectAwesome, 'isSeedValid', function() { return false; });
                isValidQuestionTypeStub = sinon.stub(projectAwesome, 'isValidQuestionType', function() { return true; });
            });
            after(function() {
                isSeedValidStub.restore();
                isValidQuestionTypeStub.restore();
            });
            describe('when not an integer', function() {
                it('should respond with 400', function(done) {
                    request(app)
                    .get('/v1/generate_moodle_xml?question_type=blah&count=notanint&question_name=blah&seed=blah')
                    .expect(400)
                    .end(done);
                });
            });
            describe('when < 1', function() {
                it('should respond with 400', function(done) {
                    request(app)
                    .get('/v1/generate_moodle_xml?question_type=blah&count=0&question_name=blah&seed=blah')
                    .expect(400)
                    .end(done);
                });
            });
            describe('when > 1000', function() {
                it('should respond with 400', function(done) {
                    request(app)
                    .get('/v1/generate_moodle_xml?question_type=blah&count=1001&question_name=blah&seed=blah')
                    .expect(400)
                    .end(done);
                });
            });
        });
        describe('valid parameters', function() {
            var isSeedValidStub;
            var isValidQuestionTypeStub;
            var generateMoodleXMLStub;
            before(function() {
                isSeedValidStub = sinon.stub(projectAwesome, 'isSeedValid', function() { return true; });
                isValidQuestionTypeStub = sinon.stub(projectAwesome, 'isValidQuestionType', function() { return true; });
                generateMoodleXMLStub = sinon.stub(projectAwesome, 'generateMoodleXML', function() { return 'correctresult'; });
            });
            after(function() {
                isSeedValidStub.restore();
                isValidQuestionTypeStub.restore();
                generateMoodleXMLStub.restore();
            });
            it('should call projectAwesome.generateMoodleXML', function(done) {
                request(app)
                .get('/v1/generate_moodle_xml?question_type=blah&count=1000&question_name=blah&seed=blah')
                .expect('Content-Type', /xml/)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(generateMoodleXMLStub.calledOnce).to.be.true;
                    expect(generateMoodleXMLStub.calledWith('blah', 1000, 'blah', 'blah')).to.be.true;
                    expect(res.text).to.equal('correctresult');
                    done();
                });
            });
        });
    });

    describe('GET /is_seed_valid', function() {
        describe('bad requests', function() {
            describe('no seed parameter', function() {
                it('should respond with 400', function(done) {
                    request(app)
                    .get('/v1/is_seed_valid')
                    .expect(400)
                    .end(done);
                });
            });
        });
        describe('when seed is invalid', function() {
            var isSeedValidStub;
            before(function() {
                isSeedValidStub = sinon.stub(projectAwesome, 'isSeedValid', function() { return false; });
            });
            after(function() {
                isSeedValidStub.restore();
            });
            it('should respond with json body { is_seed_valid: false }', function(done) {
                request(app)
                .get('/v1/is_seed_valid?seed=doesntmatter')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body).to.eql({ is_seed_valid: false });
                    done();
                });
            });
        });
        describe('when seed is valid', function() {
            var isSeedValidStub;
            before(function() {
                isSeedValidStub = sinon.stub(projectAwesome, 'isSeedValid', function() { return true; });
            });
            after(function() {
                isSeedValidStub.restore();
            });
            it('should respond with json body { is_seed_valid: true }', function(done) {
                request(app)
                .get('/v1/is_seed_valid?seed=doesntmatter')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body).to.eql({ is_seed_valid: true });
                    done();
                });
            });
        });
    });

    describe('GET /is_valid_question_type', function() {
        describe('bad requests', function() {
            describe('no question_type parameter', function() {
                it('should respond with 400', function(done) {
                    request(app)
                    .get('/v1/is_valid_question_type')
                    .expect(400)
                    .end(done);
                });
            });
        });
        describe('when question type is invalid', function() {
            var isValidQuestionTypeStub;
            before(function() {
                isValidQuestionTypeStub = sinon.stub(projectAwesome, 'isValidQuestionType', function() { return false; });
            });
            after(function() {
                isValidQuestionTypeStub.restore();
            });
            it('should respond with json body { is_valid_question_type: false }', function(done) {
                request(app)
                .get('/v1/is_valid_question_type?question_type=doesntmatter')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body).to.eql({ is_valid_question_type: false });
                    done();
                });
            });
        });
        describe('when question type is valid', function() {
            var isValidQuestionTypeStub;
            before(function() {
                isValidQuestionTypeStub = sinon.stub(projectAwesome, 'isValidQuestionType', function() { return true; });
            });
            after(function() {
                isValidQuestionTypeStub.restore();
            });
            it('should respond with json body { is_valid_question_type: true }', function(done) {
                request(app)
                .get('/v1/is_valid_question_type?question_type=doesntmatter')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body).to.eql({ is_valid_question_type: true });
                    done();
                });
            });
        });
    });
});





