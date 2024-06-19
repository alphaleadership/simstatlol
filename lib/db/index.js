"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sgdb = void 0;
var fs = require('fs');
var db = require('./db/db').db;
var sgdb = /** @class */ (function () {
    function sgdb(dir) {
        this.dir = dir;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        this.db = {};
        this.dblist = fs.readdirSync(dir);
        for (var i = 0; i < this.dblist.length; i++) {
            this.addddb(this.dblist[i].split('.')[0]);
        }
    }
    sgdb.prototype.addddb = function (name, n) {
        this.db[name] = new db("".concat(this.dir, "/").concat(name), n);
    };
    sgdb.prototype.removedb = function (name) {
        //delete this.db
        this.db = {};
        fs.unlinkSync("".concat(this.dir, "/").concat(name, ".json"));
        this.dblist = fs.readdirSync(this.dir);
        for (var i = 0; i < this.dblist.length; i++) {
            this.addddb(this.dblist[i].split('.')[0]);
        }
    };
    sgdb.prototype.accessdb = function (name) {
        return this.db[name];
    };
    sgdb.prototype.listdb = function () {
        return this.dblist;
    };
    return sgdb;
}());
exports.sgdb = sgdb;
