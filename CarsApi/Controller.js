'use strict';

var Model = require('./CarModel');

exports.listAll = function (request, response) {
    Model.findAll(function (error, data) {
        response.json(data);
    });
};


exports.create = function (request, response) {
    Model.save(request.body, function(error, car) {
        if (error) {
            response.send(error);
        } else {
            response.json(car);
        }
    });
};

exports.findById = function (request, response) {
    Model.findById(request.params.id, function(error, car) {
        if (error) {
            response.send(error);
        }
        response.json(car);
    });
};

exports.update = function (request, response) {
    Model.findOneAndUpdate(request.params.id, request.body, function(error, car) {
        if (error) {
            response.send(error);
        } else {
            response.json(car);
        }
    });
};

exports.delete = function (request, response) {
    Model.delete(request.params.id, function(error, car) {
        if (error) {
            response.send(error);
        } else {
            response.json({ message: 'Successfully deleted: ' + request.params.id });
        }
    });
};