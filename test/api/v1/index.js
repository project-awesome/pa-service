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
});





