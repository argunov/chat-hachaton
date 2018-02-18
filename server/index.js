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
app.use('/api/account', account);

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    } else {
        res.status(err.status).json({ message: err.message });
    }
});

module.exports = http.listen(config.port);