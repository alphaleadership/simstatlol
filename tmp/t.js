var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// db.js
var require_db = __commonJS({
  "db.js"(exports2, module2) {
    var fs2 = require("fs");
    var path = require("path");
    var db2 = class {
      constructor(directory, maxSize = 1e3) {
        this.directory = directory;
        this.maxSize = maxSize;
        if (!fs2.existsSync(directory)) {
          fs2.mkdirSync(directory, { recursive: true });
        }
        this.index = 0;
        this._loadIndex();
      }
      _loadIndex() {
        const files = fs2.readdirSync(this.directory).filter((file) => file.endsWith(".json"));
        this.index = files.length ? Math.max(...files.map((file) => parseInt(file, 10))) : 0;
      }
      _getFilePath(index) {
        return path.join(this.directory, `${index}.json`);
      }
      _loadContent(index) {
        const filePath = this._getFilePath(index);
        if (!fs2.existsSync(filePath)) {
          fs2.writeFileSync(filePath, "{}");
        }
        return JSON.parse(fs2.readFileSync(filePath));
      }
      _saveContent(index, content) {
        const filePath = this._getFilePath(index);
        fs2.writeFileSync(filePath, JSON.stringify(content, null, 2));
      }
      _getPartition() {
        let content = this._loadContent(this.index);
        if (Object.keys(content).length >= this.maxSize) {
          this.index += 1;
          content = {};
        }
        return { index: this.index, content };
      }
      _savePartition(index, content) {
        this._saveContent(index, content);
      }
      has(key) {
        for (let i = 0; i <= this.index; i++) {
          const content = this._loadContent(i);
          if (key in content) {
            return true;
          }
        }
        return false;
      }
      get(key) {
        for (let i = 0; i <= this.index; i++) {
          const content = this._loadContent(i);
          if (key in content) {
            return content[key];
          }
        }
        return void 0;
      }
      set(key, value) {
        const { index, content } = this._getPartition();
        content[key] = value;
        this._savePartition(index, content);
      }
      remove(key) {
        for (let i = 0; i <= this.index; i++) {
          const content = this._loadContent(i);
          if (key in content) {
            delete content[key];
            this._saveContent(i, content);
            return;
          }
        }
      }
      find(value) {
        let result = [];
        for (let i = 0; i <= this.index; i++) {
          const content = this._loadContent(i);
          for (let key in content) {
            if (content[key] === value) {
              result.push(key);
            }
          }
        }
        return result;
      }
      count() {
        let count = 0;
        for (let i = 0; i <= this.index; i++) {
          const content = this._loadContent(i);
          count += Object.keys(content).length;
        }
        return count;
      }
      // Méthode pour récupérer tout le contenu de la DB
      getAll() {
        let allContent = {};
        for (let i = 0; i <= this.index; i++) {
          const content = this._loadContent(i);
          allContent = { ...allContent, ...content };
        }
        return allContent;
      }
      // Méthode pour importer des données d'un autre fichier
      importData(file) {
        if (fs2.existsSync(file)) {
          const data = JSON.parse(fs2.readFileSync(file));
          for (let key in data) {
            this.set(key, data[key]);
          }
        } else {
          throw new Error("File does not exist");
        }
      }
    };
    module2.exports = db2;
  }
});

// index.js
var fs = require("fs");
var db = require_db();
module.exports = class sgdb {
  /**
  * Constructs a new instance of the class.
  *
    * @param {string} dir - The directory path.
    */
  constructor(dir) {
    this.dir = dir;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    this.db = {};
    this.dblist = fs.readdirSync(dir);
    for (let i = 0; i < this.dblist.length; i++) {
      this.addddb(this.dblist[i].split(".")[0]);
    }
  }
  addddb(name, n) {
    this.db[name] = new db(`${this.dir}/${name}`, n);
  }
  removedb(name) {
    delete this.db;
    this.db = {};
    fs.unlinkSync(`${this.dir}/${name}.json`);
    this.dblist = fs.readdirSync(this.dir);
    for (let i = 0; i < this.dblist.length; i++) {
      this.addddb(this.dblist[i].split(".")[0]);
    }
  }
  accessdb(name) {
    return this.db[name];
  }
  listdb() {
    return this.dblist;
  }
};
