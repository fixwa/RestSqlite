'use strict';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cars.db');

var Model = {
    initializeDb: function () {
        db.serialize(function () {
            db.run("CREATE TABLE if not exists cars (name TEXT, color TEXT)");
            var stmt = db.prepare("INSERT INTO cars VALUES (?, ?)");
            for (var i = 0; i < 10; i++) {
                stmt.run("Car " + i, "red");
            }
            stmt.finalize();

            db.each("SELECT rowid AS id, name, color FROM cars", function (err, row) {
                console.log(row.id + ": " + row.name + " / " + row.color);
            });
        });
        db.close();
    },
    findById: function (id, callback) {
        var stmt = db.prepare("SELECT * FROM cars WHERE rowid = ?");
        stmt.bind(id);
        stmt.get(function(error, row) {
            if(error) {
                throw error;
            } else {
                if(row) {
                    callback(null, row);
                } else {
                    callback(null, {});
                    console.log("Record not found for ID: " + id);
                }
            }
        });
    },
    findAll: function (callback) {
        db.all("SELECT * FROM cars", function (error, rows) {
            if (error) {
                throw error;
            } else {
                callback(null, rows);
            }
        });
    },
};

module.exports = Model;