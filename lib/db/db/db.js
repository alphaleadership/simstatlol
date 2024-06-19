"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var fs = require('fs');
var path = require('path');
var db = /** @class */ (function () {
    //constructor(directory: string, maxSize?: number);
    function db(directory, maxSize) {
        if (maxSize === void 0) { maxSize = 1000; }
        this.directory = directory;
        this.maxSize = maxSize; // Taille maximale d'un fichier en nombre d'entrées
        this.models = {};
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        this.index = 0; // Index de la partition courante
        this._loadIndex();
    }
    db.prototype._loadIndex = function () {
        var files = fs.readdirSync(this.directory).filter(function (file) { return file.endsWith('.json'); });
        this.index = files.length ? Math.max.apply(Math, __spreadArray([], __read(files.map(function (file) { return parseInt(file, 10); })), false)) : 0;
    };
    db.prototype._getFilePath = function (index) {
        return path.join(this.directory, "".concat(index, ".json"));
    };
    db.prototype._loadContent = function (index) {
        var filePath = this._getFilePath(index);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '{}');
        }
        return JSON.parse(fs.readFileSync(filePath));
    };
    db.prototype._saveContent = function (index, content) {
        var filePath = this._getFilePath(index);
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    };
    db.prototype._getPartition = function () {
        var content = this._loadContent(this.index);
        if (Object.keys(content).length >= this.maxSize) {
            this.index += 1;
            content = {};
        }
        return { index: this.index, content: content };
    };
    db.prototype._savePartition = function (index, content) {
        this._saveContent(index, content);
    };
    db.prototype.has = function (key) {
        for (var i = 0; i <= this.index; i++) {
            var content = this._loadContent(i);
            if (key in content) {
                return true;
            }
        }
        return false;
    };
    db.prototype.get = function (key) {
        for (var i = 0; i <= this.index; i++) {
            var content = this._loadContent(i);
            if (key in content) {
                return content[key];
            }
        }
        return undefined;
    };
    db.prototype.set = function (key, value, modelName) {
        if (modelName && this.models[modelName]) {
            var model = this.models[modelName];
            this._validateModel(value, model);
        }
        var _a = this._getPartition(), index = _a.index, content = _a.content;
        content[key] = value;
        this._savePartition(index, content);
    };
    db.prototype.createModel = function (name, schema) {
        this.models[name] = schema;
    };
    // Méthode pour valider les données en fonction d'un modèle
    db.prototype._validateModel = function (data, model) {
        for (var key in model) {
            if (!(key in data)) {
                throw new Error("Missing required field: ".concat(key));
            }
            if (typeof data[key] !== model[key]) {
                throw new Error("Invalid type for field: ".concat(key, ". Expected ").concat(model[key], " but got ").concat(typeof data[key]));
            }
        }
    };
    db.prototype.remove = function (key) {
        for (var i = 0; i <= this.index; i++) {
            var content = this._loadContent(i);
            if (key in content) {
                delete content[key];
                this._saveContent(i, content);
                return;
            }
        }
    };
    db.prototype.find = function (value) {
        var result = [""];
        for (var i = 0; i <= this.index; i++) {
            var content = this._loadContent(i);
            for (var key in content) {
                if (content[key] === value) {
                    result.push(key);
                }
            }
        }
        return result;
    };
    db.prototype.count = function () {
        var count = 0;
        for (var i = 0; i <= this.index; i++) {
            var content = this._loadContent(i);
            count += Object.keys(content).length;
        }
        return count;
    };
    // Méthode pour récupérer tout le contenu de la DB
    db.prototype.getAll = function () {
        var allContent = {};
        for (var i = 0; i <= this.index; i++) {
            var content = this._loadContent(i);
            allContent = __assign(__assign({}, allContent), content);
        }
        return allContent;
    };
    // Méthode pour importer des données d'un autre fichier
    db.prototype.importData = function (file) {
        if (fs.existsSync(file)) {
            var data = JSON.parse(fs.readFileSync(file));
            for (var key in data) {
                this.set(key, data[key]);
            }
        }
        else {
            throw new Error('File does not exist');
        }
    };
    db.prototype.exportData = function (file) {
        fs.writeFileSync(file, JSON.stringify(this.getAll(), null, 4));
    };
    db.prototype.purge = function () {
        var _this = this;
        Object.keys(this.getAll()).map(function (item) { _this.remove(item); });
    };
    return db;
}());
exports.db = db;
