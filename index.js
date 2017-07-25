var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('jwtTokenSecret', 'random-string-for-secrecy');


var routes = require('./CarsApi/Routes');
routes(app);


var routes = require('./UsersApi/Routes');
routes(app);


app.use(function (req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('RESTful API server started on: ' + port);