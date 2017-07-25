'use strict';

var Model = require('./UserModel'),
    jwt = require('jsonwebtoken');

exports.initDb = function (request, response) {
    Model.initializeDb(function () {
        response.json({'status': 'success'});
    });
};

exports.listAll = function (request, response) {
    Model.findAll(function (error, data) {
        response.json(data);
    });
};


exports.create = function (request, response) {
    Model.save(request.body, function(error, user) {
        if (error) {
            response.send(error);
        } else {
            response.json(user);
        }
    });
};

exports.login = function (request, response) {
    Model.findByEmailAndPassword(request.body, function(error, user) {
        if (error) {
            response.send(error);
        }
        if (user.id !== undefined) {
            var token = jwt.sign(user, request.app.get('jwtTokenSecret'), {
                expiresIn: 1440 // expires in 24 hours
            });
            response.json({
                success: true,
                message: 'Login successful.',
                token: token
            });
        } else {
            response.json({
                success: false,
                message: 'Authentication failed. User not found or wrong password.'
            });
        }
    });
};

exports.findById = function (request, response) {
    Model.findById(request.params.id, function(error, user) {
        if (error) {
            response.send(error);
        }
        response.json(user);
    });
};

exports.update = function (request, response) {
    Model.findOneAndUpdate(request.params.id, request.body, function(error, user) {
        if (error) {
            response.send(error);
        } else {
            response.json(user);
        }
    });
};

exports.delete = function (request, response) {
    Model.delete(request.params.id, function(error, user) {
        if (error) {
            response.send(error);
        } else {
            response.json({ message: 'Successfully deleted: ' + request.params.id });
        }
    });
};