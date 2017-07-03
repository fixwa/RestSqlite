'use strict';

var sqlite3 = require('sqlite3').verbose();

var Model = {
    db: null,

    connect: function () {
        this.db = new sqlite3.Database('cars.db');
    },
    initializeDb: function () {
        var self = this;
        self.connect();
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
        this.connect();
        var stmt = this.db.prepare("SELECT rowid AS id, * FROM cars WHERE rowid = ?");
        stmt.bind(id);
        stmt.get(function (error, row) {
            if (error) {
                throw error;
            } else {
                if (row) {
                    callback(null, row);
                } else {
                    callback(null, {});
                    console.log("Record not found for ID: " + id);
                }
            }
        });
        stmt.finalize();
        this.db.close();
    },
    findAll: function (callback) {
        this.connect();
        this.db.all("SELECT rowid AS id, * FROM cars", function (error, rows) {
            if (error) {
                throw error;
            } else {
                callback(null, rows);
            }
        });
        this.db.close();
    },
    save: function (data, callback) {
        var self = this;
        self.connect();
        var stmt = self.db.prepare("INSERT INTO cars VALUES (?, ?)");
        stmt.run(data.name, data.color, function (error) {
            if (error) {
                throw error;
            } else {
                console.warn("inserted id:", this.lastID);
                self.findById(this.lastID, function(err, record) {
                    if (err) {
                        throw err;
                    } else {
                        callback(null, record);
                    }
                });
            }
        });
        stmt.finalize();
        self.db.close();
    },
    findOneAndUpdate: function (id, data, callback) {
        var self = this;
        self.connect();
        var stmt = this.db.prepare("UPDATE cars SET name = ?, color = ? WHERE rowid = ?");
        stmt.run(data.name, data.color, id, function (error) {
            if (error) {
                throw error;
            } else {
                self.findById(id, function(err, record) {
                    if (err) {
                        throw err;
                    } else {
                        callback(null, record);
                    }
                });
            }
        });
        stmt.finalize();
        self.db.close();
    },
    delete: function (id, callback) {
        this.connect();
        var stmt = this.db.prepare("DELETE FROM cars WHERE rowid = ?");
        stmt.run(id, function (error) {
            if (error) {
                throw error;
            } else {
                console.log("Deleted: " + id);
                callback(null, {});
            }
        });
        stmt.finalize();
        this.db.close();
    },
    getLastInserted: function (callback) {
        this.connect();
        this.db.get("SELECT * FROM cars WHERE rowid = last_insert_rowid()", function (error, row) {
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
        });
        this.db.close();
    }
};

module.exports = Model;