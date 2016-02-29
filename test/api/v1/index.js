// testing modules
var request = require('supertest'),
    chai = require("chai"),
    sinon = require("sinon"),
    expect = chai.expect;

// for mocking
var projectAwesome = require('project-awesome');

// web app
var app = require('../../../app.js');
var server;

describe('v1 API', function() {

    before(function(done) {
        server = app.listen(app.get('port'),function() {
            done();
        });
    });

    after(function() {
        server.close();
    });

    describe('GET /list', function() {
        var listStub;
        beforeEach(function() {
            listStub = sinon.stub(projectAwesome, 'list');
            listStub.withArgs('invalid-type').throws("Illegal Argument");
            listStub.withArgs('valid-type').returns('list-response');
        });
        afterEach(function() {
            listStub.restore();
        });
        describe('response body', function() {
            var resBody;
            beforeEach(function(done) {
                request(app)
                    .get('/v1/list?type=valid-type')
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);
                        resBody = res.body;
                        done();
                    });
            });
            it('should be a json object', function() {
                expect(resBody).to.be.an('object');
            });
            it('should contain a list property with the appropriate result', function() {
                expect(resBody.list).to.equal('list-response');
            });
        });
        describe('when projectAwesome.list throws an error', function() {
            it('should respond with error code 400 and a message', function(done) {
                request(app)
                    .get('/v1/list?type=invalid-type')
                    .expect(400)
                    .end(function(err, res) {
                        if (err) return done(err);
                        expect(res.body).to.eql({"error":{"name":"Illegal Argument"}});
                        done();
                    });
            });
        });
    });

    describe('GET /check', function() {

        it('should validate correct seeds', function(done) {
        request(app)
                .get('/v1/check?type=seed&value=abcd1234')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body).to.eql({"valid":true});
                    done();
                });
        });

        it('should validate incorrect seeds', function(done) {
            request(app)
                .get('/v1/check?type=seed&value=incorrectSeedV2')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body).to.eql({"valid":false});
                    done();
                });
        });
        
        describe('when projectAwesome.check throws an error', function() {
            it('should respond with error code 400', function(done) {
                request(app)
                    .get('/v1/check?type=invalid-type')
                    .expect(400)
                     .end(function(err, res) {
                        if (err) return done(err);
                        expect(res.body).eql({ error: 'Illegal Argument: invalid-type'});
                        done();
                    });
            });
        });
        
        describe('when projectAwesome.check recieves no type', function() {
            it('should respond with error code 400 and include a message', function(done) {
                request(app)
                    .get('/v1/check?type=')
                    .expect(400)
                    .end(done);
            });
        });
        
        
        it('should validate correct questionTypes', function(done) {
            request(app)
                .get('/v1/check?type=questionType&value=mc-change-of-base')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body).to.eql({"valid":true});
                    done();
                });
        });

        it('should validate incorrect questionTypes', function(done) {
            request(app)
                .get('/v1/check?type=questionType&value=incorrectQuestionType')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body).to.eql({"valid":false});
                    done();
                });
        });

    });
    //     describe('POST /build_quiz', function() {
//         describe('bad requests', function() {
//             describe('missing parameters', function() {
//                 var isSeedValidStub;
//                 var validateQuizDescriptorStub;
//                 before(function() {
//                     isSeedValidStub = sinon.stub(projectAwesome, 'isSeedValid', function() { return true; });
//                     validateQuizDescriptorStub = sinon.stub(projectAwesome, 'validateQuizDescriptor', function() { return []; });
//                 });
//                 after(function() {
//                     isSeedValidStub.restore();
//                     validateQuizDescriptorStub.restore();
//                 });
//                 describe('no descriptor parameter', function() {
//                     it('should respond with 400', function(done) {
//                         request(app)
//                         .post('/v1/build_quiz')
//                         .send({seed:'someseed'})
//                         .expect(400)
//                         .end(done);
//                     });
//                 });
    describe('POST /validate', function() {

        var qd1 = '{    "version" : "0.1",    "questions": [{ 	    "question": "fr-change-of-base", 	    "repeat": 5 	}] }';
        it('should validate correct type', function(done) {
            request(app)
            
                .post('/v1/validate')
                
                .send({type: 'qd', value: qd1})
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body).to.eql({result: []});
                    done();
                });
        });
        

        it('should respond with error 400 when post is empty', function(done) {
            request(app)
                .post('/v1/validate')
                .expect(400)
                .end(done);
        });
        
        it('should respond with error 400 with invalid type, and error message', function(done) {
            request(app)
                .post('/v1/validate')
                .send({type: 'notQuizDescriptor', value: qd1})
                .expect(400)
                .end(function(err, res) {
                        if (err) return done(err);
                        expect(res.body).eql({ error: 'Illegal Argument: notQuizDescriptor'});
                        done();
                });
        });
        it('should validate valid type with invalid value', function(done) {
            request(app)
                .post('/v1/validate')
                .send({type: 'qd', value: {puppies: true}})
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body).length;
                    done();
                });
        });
        
    });
    
    describe('POST /generate', function() {

        var qd1 = '{    "version" : "0.1",    "questions": [{ 	    "question": "fr-change-of-base", 	    "repeat": 5 	}] }';
        it('should generate with valid args and type:json', function(done) {
            request(app)
                .post('/v1/generate')
                .send({type: 'json', qd: qd1, seed: 'abcd1234'})
                .expect(200)
                .end(done);
        });
        it('should generate with valid args and type:moodleXML', function(done) {
            request(app)
                .post('/v1/generate')
                .send({type: 'moodleXML', qd: {kittens: 'chuck'}, seed: 'abcd1234'})
                .expect(400)
                .end(done);
        });
        
        it('should not generate with invalid type', function(done) {
            request(app)
                .post('/v1/generate')
                .send({type: 'invalidType', qd: qd1, seed: 'abcd1234'})
                .expect(400)
                .end(function(err, res) {
                        if (err) return done(err);
                        expect(res.body).eql({ error: 'Illegal Argument: invalidType'});
                        done();
                });
        });
        it('should not generate with invalid qd', function(done) {
            request(app)
                .post('/v1/generate')
                .send({type: 'moodleXML', qd: {kittens: 'chuck'}, seed: 'abcd1234'})
                .expect(400)
                .end(done);
        });
        it('should not generate with invalid seed', function(done) {
            request(app)
                .post('/v1/generate')
                .send({type: 'json', qd: qd1, seed: 'NotAValidSeed'})
                .expect(400)
                .end(done);
        });
        
        

        it('should respond with error 400 when post is empty', function(done) {
            request(app)
                .post('/v1/generate')
                .expect(400)
                .end(done);
        });
        
    });
});


// describe('v1 API', function() {

//     before(function(done) {
//         server = app.listen(app.get('port'), function() {
//             done();
//         });
//     });

//     after(function() {
//         server.close();
//     });

//     describe('POST /build_quiz', function() {
//         describe('bad requests', function() {
//             describe('missing parameters', function() {
//                 var isSeedValidStub;
//                 var validateQuizDescriptorStub;
//                 before(function() {
//                     isSeedValidStub = sinon.stub(projectAwesome, 'isSeedValid', function() { return true; });
//                     validateQuizDescriptorStub = sinon.stub(projectAwesome, 'validateQuizDescriptor', function() { return []; });
//                 });
//                 after(function() {
//                     isSeedValidStub.restore();
//                     validateQuizDescriptorStub.restore();
//                 });
//                 describe('no descriptor parameter', function() {
//                     it('should respond with 400', function(done) {
//                         request(app)
//                         .post('/v1/build_quiz')
//                         .send({seed:'someseed'})
//                         .expect(400)
//                         .end(done);
//                     });
//                 });
//                 describe('no seed parameter', function() {
//                     it('should respond with 400', function(done) {
//                         request(app)
//                         .post('/v1/build_quiz')
//                         .send({descriptor:'somedescriptor'})
//                         .expect(400)
//                         .end(done);
//                     });
//                 });
//             });
//             describe('invalid parameters', function() {
//                 describe('invalid descriptor', function() {
//                     var isSeedValidStub;
//                     var validateQuizDescriptorStub;
//                     before(function() {
//                         isSeedValidStub = sinon.stub(projectAwesome, 'isSeedValid', function() { return true; });
//                         validateQuizDescriptorStub = sinon.stub(projectAwesome, 'validateQuizDescriptor', function() { return [{"some":"error"}]; });
//                     });
//                     after(function() {
//                         isSeedValidStub.restore();
//                         validateQuizDescriptorStub.restore();
//                     });
//                     it('should respond with status 400', function(done) {
//                         request(app)
//                         .post('/v1/build_quiz')
//                         .send({descriptor:'somedescriptor', seed:'someseed'})
//                         .expect(400)
//                         .end(done);
//                     });
//                 });
//                 describe('invalid seed', function() {
//                     var isSeedValidStub;
//                     var validateQuizDescriptorStub;
//                     before(function() {
//                         isSeedValidStub = sinon.stub(projectAwesome, 'isSeedValid', function() { return false; });
//                         validateQuizDescriptorStub = sinon.stub(projectAwesome, 'validateQuizDescriptor', function() { return []; });
//                     });
//                     after(function() {
//                         isSeedValidStub.restore();
//                         validateQuizDescriptorStub.restore();
//                     });
//                     it('should respond with status 400', function(done) {
//                         request(app)
//                         .post('/v1/build_quiz')
//                         .send({descriptor:'somedescriptor', seed:'someseed'})
//                         .expect(400)
//                         .end(done);
//                     });
//                 });
//             });
//         });
//         describe('successful case', function() {
//             var isSeedValidStub;
//             var validateQuizDescriptorStub;
//             var buildQuizStub;
//             before(function() {
//                 isSeedValidStub = sinon.stub(projectAwesome, 'isSeedValid', function() { return true; });
//                 validateQuizDescriptorStub = sinon.stub(projectAwesome, 'validateQuizDescriptor', function() { return []; });
//                 buildQuizStub = sinon.stub(projectAwesome, 'buildQuiz', function() { return {"quiz": "fake quiz"}; });
//             });
//             after(function() {
//                 isSeedValidStub.restore();
//                 validateQuizDescriptorStub.restore();
//                 buildQuizStub.restore();
//             });
//             it('should call buildQuiz with correct parameters and return its result', function(done) {
//                 request(app)
//                 .post('/v1/build_quiz')
//                 .send({ descriptor : "somedescriptor", seed: "someseed" })
//                 .expect(200)
//                 .end(function(err, res) {
//                     if (err) return done(err);
//                     expect(buildQuizStub.calledOnce).to.be.true;
//                     expect(buildQuizStub.calledWith('somedescriptor', 'someseed')).to.be.true;
//                     expect(res.body).to.eql({"quiz": "fake quiz"});
//                     done();
//                 });
//             });
//         });
//     });

//     describe('POST /validate_quiz_descriptor', function() {
//         describe('bad requests', function() {
//             describe('no descriptor parameter', function() {
//                 it('should respond with 400', function(done) {
//                     request(app)
//                     .post('/v1/validate_quiz_descriptor')
//                     .expect(400)
//                     .end(done);
//                 });
//             });
//         });
//         describe('when descriptor is set', function() {
//             var validateQuizDescriptorStub;
//             before(function() {
//                 validateQuizDescriptorStub = sinon.stub(projectAwesome, 'validateQuizDescriptor', function() { return [{"not":"empty"}]; });
//             });
//             after(function() {
//                 validateQuizDescriptorStub.restore();
//             });
//             it('should respond with json body of errors array', function(done) {
//                 request(app)
//                 .post('/v1/validate_quiz_descriptor')
//                 .send({ descriptor : "fake qd, value doesn't matter here" })
//                 .expect(200)
//                 .end(function(err, res) {
//                     if (err) return done(err);
//                     expect(res.body).to.eql([{"not":"empty"}]);
//                     done();
//                 });
//             });
//         });
//     });


//     describe('GET /generate_moodle_xml', function() {
//         describe('bad requests', function() {
//             describe('no question_type parameter', function() {
//                 it('should respond with 400', function(done) {
//                     request(app)
//                     .get('/v1/generate_moodle_xml?count=10&question_name=blah&seed=blah')
//                     .expect(400)
//                     .end(done);
//                 });
//             });
//             describe('no count parameter', function() {
//                 it('should respond with 400', function(done) {
//                     request(app)
//                     .get('/v1/generate_moodle_xml?question_type=blah&question_name=blah&seed=blah')
//                     .expect(400)
//                     .end(done);
//                 });
//             });
//             describe('no question_name parameter', function() {
//                 it('should respond with 400', function(done) {
//                     request(app)
//                     .get('/v1/generate_moodle_xml?question_type=blah&count=10&seed=blah')
//                     .expect(400)
//                     .end(done);
//                 });
//             });
//             describe('no seed parameter', function() {
//                 it('should respond with 400', function(done) {
//                     request(app)
//                     .get('/v1/generate_moodle_xml?question_type=blah&count=10&question_name=blah')
//                     .expect(400)
//                     .end(done);
//                 });
//             });
//         });
//         describe('when seed is invalid', function() {
//             var isSeedValidStub;
//             var isValidQuestionTypeStub;
//             before(function() {
//                 isSeedValidStub = sinon.stub(projectAwesome, 'isSeedValid', function() { return false; });
//                 isValidQuestionTypeStub = sinon.stub(projectAwesome, 'isValidQuestionType', function() { return true; });
//             });
//             after(function() {
//                 isSeedValidStub.restore();
//                 isValidQuestionTypeStub.restore();
//             });
//             it('should respond with 400', function(done) {
//                 request(app)
//                 .get('/v1/generate_moodle_xml?question_type=blah&count=10&question_name=blah&seed=blah')
//                 .expect(400)
//                 .end(done);
//             });
//         });
//         describe('when question type is invalid', function() {
//             var isSeedValidStub;
//             var isValidQuestionTypeStub;
//             before(function() {
//                 isSeedValidStub = sinon.stub(projectAwesome, 'isSeedValid', function() { return true; });
//                 isValidQuestionTypeStub = sinon.stub(projectAwesome, 'isValidQuestionType', function() { return false; });
//             });
//             after(function() {
//                 isSeedValidStub.restore();
//                 isValidQuestionTypeStub.restore();
//             });
//             it('should respond with 400', function(done) {
//                 request(app)
//                 .get('/v1/generate_moodle_xml?question_type=blah&count=10&question_name=blah&seed=blah')
//                 .expect(400)
//                 .end(done);
//             });
//         });
//         describe('when count is invalid', function() {
//             var isSeedValidStub;
//             var isValidQuestionTypeStub;
//             before(function() {
//                 isSeedValidStub = sinon.stub(projectAwesome, 'isSeedValid', function() { return false; });
//                 isValidQuestionTypeStub = sinon.stub(projectAwesome, 'isValidQuestionType', function() { return true; });
//             });
//             after(function() {
//                 isSeedValidStub.restore();
//                 isValidQuestionTypeStub.restore();
//             });
//             describe('when not an integer', function() {
//                 it('should respond with 400', function(done) {
//                     request(app)
//                     .get('/v1/generate_moodle_xml?question_type=blah&count=notanint&question_name=blah&seed=blah')
//                     .expect(400)
//                     .end(done);
//                 });
//             });
//             describe('when < 1', function() {
//                 it('should respond with 400', function(done) {
//                     request(app)
//                     .get('/v1/generate_moodle_xml?question_type=blah&count=0&question_name=blah&seed=blah')
//                     .expect(400)
//                     .end(done);
//                 });
//             });
//             describe('when > 1000', function() {
//                 it('should respond with 400', function(done) {
//                     request(app)
//                     .get('/v1/generate_moodle_xml?question_type=blah&count=1001&question_name=blah&seed=blah')
//                     .expect(400)
//                     .end(done);
//                 });
//             });
//         });
//         describe('valid parameters', function() {
//             var isSeedValidStub;
//             var isValidQuestionTypeStub;
//             var generateMoodleXMLStub;
//             before(function() {
//                 isSeedValidStub = sinon.stub(projectAwesome, 'isSeedValid', function() { return true; });
//                 isValidQuestionTypeStub = sinon.stub(projectAwesome, 'isValidQuestionType', function() { return true; });
//                 generateMoodleXMLStub = sinon.stub(projectAwesome, 'generateMoodleXML', function() { return 'correctresult'; });
//             });
//             after(function() {
//                 isSeedValidStub.restore();
//                 isValidQuestionTypeStub.restore();
//                 generateMoodleXMLStub.restore();
//             });
//             it('should call projectAwesome.generateMoodleXML', function(done) {
//                 request(app)
//                 .get('/v1/generate_moodle_xml?question_type=blah&count=1000&question_name=blah&seed=blah')
//                 .expect('Content-Type', /xml/)
//                 .expect(200)
//                 .end(function(err, res) {
//                     if (err) return done(err);
//                     expect(generateMoodleXMLStub.calledOnce).to.be.true;
//                     expect(generateMoodleXMLStub.calledWith('blah', 1000, 'blah', 'blah')).to.be.true;
//                     expect(res.text).to.equal('correctresult');
//                     done();
//                 });
//             });
//         });
//     });

//     describe('GET /is_seed_valid', function() {
//         describe('bad requests', function() {
//             describe('no seed parameter', function() {
//                 it('should respond with 400', function(done) {
//                     request(app)
//                     .get('/v1/is_seed_valid')
//                     .expect(400)
//                     .end(done);
//                 });
//             });
//         });
//         describe('when seed is invalid', function() {
//             var isSeedValidStub;
//             before(function() {
//                 isSeedValidStub = sinon.stub(projectAwesome, 'isSeedValid', function() { return false; });
//             });
//             after(function() {
//                 isSeedValidStub.restore();
//             });
//             it('should respond with json body { is_seed_valid: false }', function(done) {
//                 request(app)
//                 .get('/v1/is_seed_valid?seed=doesntmatter')
//                 .expect(200)
//                 .end(function(err, res) {
//                     if (err) return done(err);
//                     expect(res.body).to.eql({ is_seed_valid: false });
//                     done();
//                 });
//             });
//         });
//         describe('when seed is valid', function() {
//             var isSeedValidStub;
//             before(function() {
//                 isSeedValidStub = sinon.stub(projectAwesome, 'isSeedValid', function() { return true; });
//             });
//             after(function() {
//                 isSeedValidStub.restore();
//             });
//             it('should respond with json body { is_seed_valid: true }', function(done) {
//                 request(app)
//                 .get('/v1/is_seed_valid?seed=doesntmatter')
//                 .expect(200)
//                 .end(function(err, res) {
//                     if (err) return done(err);
//                     expect(res.body).to.eql({ is_seed_valid: true });
//                     done();
//                 });
//             });
//         });
//     });

//     describe('GET /is_valid_question_type', function() {
//         describe('bad requests', function() {
//             describe('no question_type parameter', function() {
//                 it('should respond with 400', function(done) {
//                     request(app)
//                     .get('/v1/is_valid_question_type')
//                     .expect(400)
//                     .end(done);
//                 });
//             });
//         });
//         describe('when question type is invalid', function() {
//             var isValidQuestionTypeStub;
//             before(function() {
//                 isValidQuestionTypeStub = sinon.stub(projectAwesome, 'isValidQuestionType', function() { return false; });
//             });
//             after(function() {
//                 isValidQuestionTypeStub.restore();
//             });
//             it('should respond with json body { is_valid_question_type: false }', function(done) {
//                 request(app)
//                 .get('/v1/is_valid_question_type?question_type=doesntmatter')
//                 .expect(200)
//                 .end(function(err, res) {
//                     if (err) return done(err);
//                     expect(res.body).to.eql({ is_valid_question_type: false });
//                     done();
//                 });
//             });
//         });
//         describe('when question type is valid', function() {
//             var isValidQuestionTypeStub;
//             before(function() {
//                 isValidQuestionTypeStub = sinon.stub(projectAwesome, 'isValidQuestionType', function() { return true; });
//             });
//             after(function() {
//                 isValidQuestionTypeStub.restore();
//             });
//             it('should respond with json body { is_valid_question_type: true }', function(done) {
//                 request(app)
//                 .get('/v1/is_valid_question_type?question_type=doesntmatter')
//                 .expect(200)
//                 .end(function(err, res) {
//                     if (err) return done(err);
//                     expect(res.body).to.eql({ is_valid_question_type: true });
//                     done();
//                 });
//             });
//         });
//     });
// });