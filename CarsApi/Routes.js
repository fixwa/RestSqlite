'use strict';

module.exports = function(app) {
    var controller = require('./Controller');

    app.route('/cars')
        .get(controller.listAll)
        .post(controller.create);


    app.route('/cars/:id')
        .get(controller.findById)
        .put(controller.update_a_task)
        .delete(controller.delete_a_task);
};