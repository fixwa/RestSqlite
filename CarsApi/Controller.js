'use strict';

var Model = require('./CarModel');

exports.listAll = function (request, response) {
    Model.findAll(function (error, data) {
        response.json(data);
    });
};


exports.create = function (request, response) {
    var car = new Model(request.body);
    Model.save(function(error, car) {
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

exports.update_a_task = function (request, response) {
    // Task.findOneAndUpdate({_id:request.params.taskId}, request.body, {new: true}, function(error, task) {
    //     if (error)
    //         response.send(error);
    //     response.json(task);
    // });
};
// Task.remove({}).exec(function(){});
exports.delete_a_task = function (request, response) {

    // Task.remove({
    //     _id: request.params.taskId
    // }, function(error, task) {
    //     if (error)
    //         response.send(error);
    //     response.json({ message: 'Task successfully deleted' });
    // });
};