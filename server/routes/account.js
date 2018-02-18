const jwt = require('jsonwebtoken');
const config = require('../config');
const secret = config.get('secret');
const Account = require('../models/account');
const { error, mhError } = require('../libs/error');

const signup = require('./libs/signup');
const login = require('./libs/login');

const checkAccess = (req, res, next) => {
    let access = req.get('x-access-token');
    if (!access) { next(error(400, 'BAD_REQUEST')); }
    let d = jwt.verify(access, secret, (e, d) => {
        if (e) { next(error(403, 'FORBIDDEN')); }
        req.decoded = d;
        next();
    });
};

const me = (req, res, next) => {
    if (!req.decoded) { next(error(500, 'INTERNAL_SERVER_ERROR')); }
    res.status(200).json({
        message: 'OK',
        account: {
            id: req.decoded.id,
            email: req.decoded.email,
            surname: req.decoded.surname,
            firstname: req.decoded.firstname,
            address: req.decoded.address,
            voxName: req.decoded.voxName,
            role: req.decoded.role
        }
    });
};

const idd = (req, res, next) => {
    if (!req.decoded) { next(error(500, 'INTERNAL_SERVER_ERROR')); }
    res.status(200).json({ message: 'OK', id: req.decoded.id });
};

module.exports = express => {
    let acc = express.Router();
    acc.post('/signup', signup);
    acc.post('/login', login);
    acc.use(checkAccess);
    acc.get('/me', me);
    acc.get('/id', idd);
    return acc;
};