const jwt = require('jsonwebtoken');
const config = require('../../config');
const secret = config.get('secret');
const Account = require('../../models/account');
const { error, mhError } = require('../../libs/error');
const login = async (req, res, next) => {
    let { email, password } = req.body;
    if (!email || !password) { next(error(400, 'BAD_REQUEST')); }
    try {
        let a = await Account.authorize(email, password);
        let payload = {
            id: a._id,
            email: a.email,
            surname: a.surname,
            firstname: a.firstname
        };
        let token = jwt.sign(payload, secret, { expiresIn: '30 days' });
        res.status(200).json({ message: 'OK', access: token });
    } catch (e) { next(mhError(e)); }
};
module.exports = login;