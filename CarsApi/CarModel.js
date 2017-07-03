'use strict';

var sqlite3 = require('sqlite3').verbose();

var Model = {
    db: new sqlite3.Database('cars.db'),

    initializeDb: function () {
        var self = this;
        self.db.serialize(function () {
            self.db.run("CREATE TABLE if not exists cars (name TEXT, color TEXT)");
            var stmt = this.db.prepare("INSERT INTO cars VALUES (?, ?)");
            for (var i = 0; i < 10; i++) {
                stmt.run("Car " + i, "red");
            }
            stmt.finalize();

            self.db.each("SELECT rowid AS id, name, color FROM cars", function (err, row) {
                console.log(row.id + ": " + row.name + " / " + row.color);
            });
        });
        self.db.close();
    },
    findById: function (id, callback) {
        var stmt = this.db.prepare("SELECT * FROM cars WHERE rowid = ?");
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
        this.db.close();
    },
    findAll: function (callback) {
        this.db.all("SELECT * FROM cars", function (error, rows) {
            if (error) {
                throw error;
            } else {
                callback(null, rows);
            }
        });
        this.db.close();
    },
    save: function (data, callback) {
        var stmt = this.db.prepare("INSERT INTO cars VALUES (?, ?)");
        stmt.run(data.name, data.color, function(error) {
            if (error) {
                throw error;
            } else {
                console.warn("inserted id:", this.lastID);
                data.id = this.lastID;
                callback(null, data);
            }
        });
        stmt.finalize();
        this.db.close();
    },
};

module.exports = Model;