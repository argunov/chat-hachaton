process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

const server = require('../index.js');
const Account = require('../models/account');

describe('1. API. Account tests', () => {
    before(async () => {
        try {
            await Account.remove({});
        } catch (e) { console.error(e); }
    });

    after(async () => {
        try {
            await Account.remove({});
        } catch (e) { console.error(e); }
    });

    describe('[POST] /api/account/signup > ', () => {
        it('account signup', done => {
            const body = {
                email: 'ooby@mail.ru',
                password: 'obanabana',
                surname: 'Doo',
                firstname: 'Ooby'
            };
            chai.request(server)
                .post('/api/account/signup')
                .send(body)
                .then(r => {
                    console.log('MESSAGE', r.body.message);
                    r.should.have.status(200);
                    r.body.should.have.property('message');
                    done();
                })
                .catch(e => {
                    console.error('ERROR', e.status, e.message);
                    return;
                });
        });
    });

    describe('[POST] /api/account/login > ', () => {
        it('account login', done => {
            const body = {
                email: 'ooby@mail.ru',
                password: 'obanabana'
            };
            chai.request(server)
                .post('/api/account/login')
                .send(body)
                .then(r => {
                    console.log('MESSAGE', r.body.message);
                    r.should.have.status(200);
                    r.body.should.have.property('message');
                    r.body.should.have.property('access');
                    done();
                })
                .catch(e => {
                    console.error('ERROR', e.status, e.message);
                    return;
                });
        });
    });

    describe('[GET] /api/account/me > ', () => {
        let access = '';
        before(async () => {
            try {
                const login = {
                    email: 'ooby@mail.ru',
                    password: 'obanabana'
                };
                let r = await chai.request(server)
                    .post('/api/account/login')
                    .send(login);
                access += r.body.access;
            } catch (e) { console.error(e); }
        });

        it('account info', done => {
            chai.request(server)
                .get('/api/account/me')
                .set({ 'x-access-token': access })
                .then(r => {
                    console.log('MESSAGE', r.body.message);
                    r.should.have.status(200);
                    r.body.should.have.property('message');
                    r.body.should.have.property('account');
                    r.body.account.should.have.property('id');
                    r.body.account.should.have.property('email');
                    r.body.account.should.have.property('surname');
                    r.body.account.should.have.property('firstname');
                    done();
                })
                .catch(e => {
                    console.error('ERROR', e.status, e.message);
                    return;
                });
        });
    });

    describe('[GET] /api/account/id > ', () => {
        let access = '';
        before(async () => {
            try {
                const login = {
                    email: 'ooby@mail.ru',
                    password: 'obanabana'
                };
                let r = await chai.request(server)
                    .post('/api/account/login')
                    .send(login);
                access += r.body.access;
            } catch (e) { console.error(e); }
        });

        it('account id', done => {
            chai.request(server)
                .get('/api/account/id')
                .set({ 'x-access-token': access })
                .then(r => {
                    console.log('MESSAGE', r.body.message);
                    r.should.have.status(200);
                    r.body.should.have.property('message');
                    r.body.should.have.property('id');
                    done();
                })
                .catch(e => {
                    console.error('ERROR', e.status, e.message);
                    return;
                });
        });
    });

});