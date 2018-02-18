const app = require('express')();
const http = require('http').Server(app);
const vidiq = require('vidiq').server(config, http);

const port = 3000;

http.listen(port);