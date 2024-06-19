"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var dbsm = require("./db");
var fs = require("fs");
var db = [];
//console.log(dbsm.sgdb)
var dbm = new dbsm.sgdb("data");
//console.log(dbm)
var d = fs.readdirSync("./model").map(function (file) {
    var _a;
    var name = file.split(".")[0];
    dbm.addddb(name, 10);
    db[name] = dbm.accessdb(name);
    (_a = db[name]).createModel.apply(_a, __spreadArray([name], __read(require("../model/" + file)), false));
    return fs.readFileSync("./types/".concat(name, ".txt")).toString().split("\n").map(function (lines) {
        var t = {};
        var i = 1;
        var info = lines.split(":");
        for (var key in require("../model/" + file)) {
            t[key] = info[i];
            i++;
        }
        db[name].set(info[0], t, name);
        return db[name];
    });
});
//console.log(d)
console.log(JSON.parse(JSON.stringify((dbm))));
