const express = require('express');

const app = express();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('./libs/mongoose');

const nconf = require('./config')

const config = {
    secret: nconf.get('secret'),
    limit: 2,
    port: nconf.get('port'),
    libs: {
        subtract: d => d[0] - d[1],
        mult: d => d[0] * d[1]
    }
}

const http = require('http').Server(app);
const vidiq = require('vidiq').server(config, http);

app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(morgan('tiny'));

const account = require('./routes/account')(express);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization,Content-Length,X-Requested-ith,x-access-token');
    if ('OPTIONS' == req.method) { res.send(200); }
    next();
});
app.use('/api/account', account);

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    } else {
        res.status(err.status).json({ message: err.message });
    }
});

module.exports = http.listen(config.port);