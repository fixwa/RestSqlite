'use strict';
var jwt = require('jsonwebtoken');

module.exports = function(app) {
    var controller = require('./Controller');

    /**
     * All routes that begins with /api will verify the token.
     */
    app.use('/api', function(req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, app.get('jwtTokenSecret'), function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });

        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });

    app.route('/users/initDb')
        .get(controller.initDb);

    app.route('/auth/login')
        .post(controller.login);

    app.route('/api/users')
        .get(controller.listAll)
        .post(controller.create);


    app.route('/api/users/:id(\\d+)')
        .get(controller.findById)
        .put(controller.update)
        .delete(controller.delete);
};