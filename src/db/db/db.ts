const fs = require('fs');
const path = require('path');
interface ModelSchema {
    [key: string]: string;
}
export class db {
    directory: string;
    maxSize: number;
    index: number;
    models: { [key: string]: ModelSchema };

    //constructor(directory: string, maxSize?: number);

   
     
     
    
    constructor(directory:string, maxSize:number = 1000) {
        this.directory = directory;
        this.maxSize = maxSize; // Taille maximale d'un fichier en nombre d'entrées
        this.models = {};
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        this.index = 0; // Index de la partition courante
        this._loadIndex();
    }
    _loadIndex(): void;
    _loadIndex() {
        const files = fs.readdirSync(this.directory).filter(file => file.endsWith('.json'));
        this.index = files.length ? Math.max(...files.map(file => parseInt(file, 10))) : 0;
    }
    _getFilePath(index: number): string;
    _getFilePath(index:number) {
        return path.join(this.directory, `${index}.json`);
    }
    _loadContent(index: number): object;
    _loadContent(index:number):object {
        const filePath = this._getFilePath(index);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '{}');
        }
        return JSON.parse(fs.readFileSync(filePath));
    }
    _saveContent(index: number, content: object): void;
    
    _saveContent(index:number, content:object) {
        const filePath = this._getFilePath(index);
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    }
    _getPartition(): { index: number, content: object };
    _getPartition() {
        let content = this._loadContent(this.index);
        if (Object.keys(content).length >= this.maxSize) {
            this.index += 1;
            content = {};
        }
        return { index: this.index, content };
    }
    _savePartition(index: number, content: any): void;
    _savePartition(index:number, content:any) {
        this._saveContent(index, content);
    }
    has(key: string): boolean;
    has(key:string) {
        for (let i = 0; i <= this.index; i++) {
            const content = this._loadContent(i);
            if (key in content) {
                return true;
            }
        }
        return false;
    }
    get(key: string): any;
    get(key:string) {
        for (let i = 0; i <= this.index; i++) {
            const content = this._loadContent(i);
            if (key in content) {
                return content[key];
            }
        }
        return undefined;
    }
    set(key: string, value: any, modelName?: string): void;
    set(key: string, value: any, modelName?: string) {
        if (modelName && this.models[modelName]) {
            const model = this.models[modelName];
            this._validateModel(value, model);
        }
        const { index, content } = this._getPartition();
        content[key] = value;
        this._savePartition(index, content);
    }
    createModel(name: string, schema: ModelSchema): void;
    createModel(name: string, schema: ModelSchema) {
        this.models[name] = schema;
    }
    _validateModel(data: any, model: ModelSchema): void;
    // Méthode pour valider les données en fonction d'un modèle
    _validateModel(data: any, model: ModelSchema) {
        for (let key in model) {
            if (!(key in data)) {
                throw new Error(`Missing required field: ${key}`);
            }
            if (typeof data[key] !== model[key]) {
                throw new Error(`Invalid type for field: ${key}. Expected ${model[key]} but got ${typeof data[key]}`);
            }
        }
    }
    remove(key: string): void;
    remove(key:string) {
        for (let i = 0; i <= this.index; i++) {
            const content = this._loadContent(i);
            if (key in content) {
                delete content[key];
                this._saveContent(i, content);
                return;
            }
        }
    }
    find(value: any): string[];
    find(value:any) {
        let result:[string]=[""];
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
    count(): number;
    count() {
        let count = 0;
        for (let i = 0; i <= this.index; i++) {
            const content = this._loadContent(i);
            count += Object.keys(content).length;
        }
        return count;
    }
    getAll(): { [key: string]: any };
    // Méthode pour récupérer tout le contenu de la DB
    getAll() {
        let allContent = {};
        for (let i = 0; i <= this.index; i++) {
            const content = this._loadContent(i);
            allContent = { ...allContent, ...content };
        }
        return allContent;
    }
    importData(file: string): void;
    // Méthode pour importer des données d'un autre fichier
    importData(file:string) {
        if (fs.existsSync(file)) {
            const data = JSON.parse(fs.readFileSync(file));
            for (let key in data) {
                this.set(key, data[key]);
            }
        } else {
            throw new Error('File does not exist');
        }
    }
    exportData(file: string): void;
    exportData(file:string){
        fs.writeFileSync(file,JSON.stringify(this.getAll(),null,4))
    }
    purge(): void;
    purge(){
        Object.keys(this.getAll()).map((item)=>{this.remove(item)})
    }
}


