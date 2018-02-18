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

describe('3. JSON RPC via sockets > ', () => {
    let subtractData = {
        'jsonrpc': '2.0',
        'method': 'subtract',
        'params': [42, 23],
        'id': 1
    };
    let multData = {
        'jsonrpc': '2.0',
        'method': 'mult',
        'params': [42, 23],
        'id': 1
    };
    let subtractResult = {
        'jsonrpc': '2.0',
        'result': 19,
        'id': 1
    };
    let multResult = {
        'jsonrpc': '2.0',
        'result': 966,
        'id': 1
    };

    let username1 = { id: 'id1', surname: 'Ivanov', firstname: 'Ivan' };
    let token1 = jwt.sign(username1, secret);
    let opts1 = {
        transports: ['websocket'],
        'query': 'token=' + token1
    };

    let user1;

    beforeEach(() => {
        user1 = io.connect('http://localhost:' + port, opts1);
    });

    it('subtraction', done => {
        user1.on('connect', data => {
            user1.emit('jsonrpc', JSON.stringify(subtractData));
        });
        user1.on('jsonrpc', data => {
            data.should.equal(JSON.stringify(subtractResult));
            done();
        });
    });

    it('multiplication', done => {
        user1.on('connect', data => {
            user1.emit('jsonrpc', JSON.stringify(multData));
        });
        user1.on('jsonrpc', data => {
            data.should.equal(JSON.stringify(multResult));
            done();
        });
    });

    let invMethod = {
        'jsonrpc': '2.0',
        'method': 'power',
        'params': [42, 23],
        'id': 1
    };
    let invMethodResult = {
        'jsonrpc': '2.0',
        'error': {
            'code': '-32601',
            'message': 'Method not found'
        },
        'id': null
    };
    it('method not found', done => {
        user1.on('connect', data => {
            user1.emit('jsonrpc', JSON.stringify(invMethod));
        });
        user1.on('jsonrpc', data => {
            data.should.equal(JSON.stringify(invMethodResult));
            done();
        });
    });
});