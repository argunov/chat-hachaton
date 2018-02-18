process.env.NODE_ENV = 'test';
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const config = require('../config');
const port = config.get('port');
const secret = config.get('secret');
const jwt = require('jsonwebtoken');
const io = require('socket.io-client');

describe('2. socket connection > ', () => {
    before(() => {
        sinon.stub(console, 'log');
    });
    after(() => {
        console.log.restore();
    });
    it('console log when new user connects', done => {
        let username = { id: 'id1', surname: 'Ivanov', firstname: 'Ivan' };
        let token = jwt.sign(username, secret);
        let opts = {
            transports: ['websocket'],
            forceNew: true,
            'query': 'token=' + token
        };
        let socket = io('http://localhost:' + port, opts);
        socket.on('connect', () => {
            expect(console.log).to.be.calledOnce;
            done();
        });
    });
});
