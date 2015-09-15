// testing modules
var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);
var expect = chai.expect;

var requestChecker = require('../../middleware/request-checker.js');


describe('request-checker', function() {
    describe('requireQuery(name)', function() {
        it('should return a function', function() {
            expect(requestChecker.requireQuery('doesntmatter')).to.be.a('function');
        });
        describe('return function', function() {
            var nextStub;
            var resMock = new (function() {
                this.status = function() {
                    return this;
                }
                this.end = function() {}
            })();
            var resSpyStatus, resSpyEnd;
            var requireTestName;
            beforeEach(function() {
                requireTestName = requestChecker.requireQuery('TestName');
                resSpyStatus = sinon.spy(resMock, 'status')
                resSpyEnd = sinon.spy(resMock, 'end')
                nextStub = sinon.stub();
            });
            afterEach(function() {
                resSpyEnd.restore();
                resSpyStatus.restore();
            });
            describe('when query variable is not in req.query', function() {
                it('should respond 400 and not call next', function() {
                    var reqMock = { query: {} };
                    requireTestName(reqMock, resMock, nextStub);
                    expect(resSpyStatus.calledOnce).to.be.true;
                    expect(resSpyStatus.calledWith(400)).to.be.true;
                    expect(nextStub.called).to.be.false;
                });
            });
            describe('when query variable is in req.query', function() {
                it('should NOT respond 400 and SHOULD call next', function() {
                    var reqMock = { query: { "TestName": "ayy lmao" } };
                    requireTestName(reqMock, resMock, nextStub);
                    expect(resSpyStatus.called).to.be.false;
                    expect(nextStub.called).to.be.true;
                });
            });
        });
    });

});










