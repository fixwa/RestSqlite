'use strict';

var sqlite3 = require('sqlite3').verbose();

var Model = {
    db: null,

    connect: function () {
        this.db = new sqlite3.Database('users.db');
    },
    initializeDb: function (callback) {
        var self = this;
        self.connect();
        self.db.serialize(function () {
            self.db.run("DROP TABLE users");
            self.db.run("CREATE TABLE if not exists users (name TEXT, email TEXT, password TEXT)");
            var stmt = self.db.prepare("INSERT INTO users VALUES (?, ?, ?)");
            stmt.run("Pablo", "pablo@email.com", "12345678");
            stmt.run("Ash", "ash@email.com", "12345678");
            stmt.run("Homer", "homer@email.com", "12345678");
            stmt.finalize();

            self.db.each("SELECT rowid AS id, name, email, password FROM users", function (err, row) {
                console.log(row.id + ": " + row.name + " / " + row.email + " / " + row.password);
            });
            callback(null, {});
        });
        self.db.close();
    },
    findByEmailAndPassword: function (data, callback) {
        this.connect();
        console.log("Looking for: " + data.email + " / " + data.password);
        var stmt = this.db.prepare("SELECT rowid AS id, * FROM users WHERE email = ? AND password = ?");
        stmt.bind(data.email, data.password);
        stmt.get(function (error, row) {
            if (error) {
                throw error;
            } else {
                if (row) {
                    callback(null, row);
                    console.log(".... Found!");
                } else {
                    callback(null, {});
                    console.log(".... Not found.");
                }
            }
        });
        stmt.finalize();
        this.db.close();
    },
    findById: function (id, callback) {
        this.connect();
        var stmt = this.db.prepare("SELECT rowid AS id, * FROM users WHERE rowid = ?");
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
        this.db.all("SELECT rowid AS id, * FROM users", function (error, rows) {
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
        var stmt = self.db.prepare("INSERT INTO users VALUES (?, ?)");
        stmt.run(data.name, data.email, function (error) {
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
        var stmt = this.db.prepare("UPDATE users SET name = ?, email = ? WHERE rowid = ?");
        stmt.run(data.name, data.email, id, function (error) {
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
        var stmt = this.db.prepare("DELETE FROM users WHERE rowid = ?");
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
        this.db.get("SELECT * FROM users WHERE rowid = last_insert_rowid()", function (error, row) {
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