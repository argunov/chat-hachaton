const Account = require('../../models/account');
const { error, mhError } = require('../../libs/error');
const signup = async (req, res, next) => {
    let { email, password, surname, firstname, patronymic, avatar } = req.body;
    if (!email || !password || !surname || !firstname) { next(error(400, 'BAD_REQUEST')); }
    try {
        let a = await Account.findOne({ email: email });
        if (a) { next(error(409, 'ALREADY_EXIST')); }
        let acc = new Account({
            email: email,
            password: password,
            surname: surname,
            firstname: firstname,
            patronymic: (patronymic),
            avatar: (avatar)
        });
        await acc.save();
        res.status(200).json({ message: 'CREATED' });
    } catch (e) { next(mhError(e)); }
};
module.exports = signup;