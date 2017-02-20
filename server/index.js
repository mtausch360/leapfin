var express = require('express');
var path = require('path');
var app = express();

require('./middleware.js')(app, express);
require('./routes.js')(app, express);

var port = process.env.PORT || 8080;
console.log('app is listening on port ',  port);
app.listen(port);