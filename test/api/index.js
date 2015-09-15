// testing modules
var request = require('supertest');
var chai = require("chai");
var expect = chai.expect;

// web app
var app = require('../../app.js');
var server;





describe('bad url', function() {

    before(function(done) {
        server = app.listen(app.get('port'), function() {
            done();
        });
    });

    after(function() {
        server.close();
    });

    it('should respond with 404', function(done) {
        request(app)
        .get('/not_part_of_the_api')
        .expect(404)
        .end(done);
    });

});
