declare module 'sgdb' {
    interface ModelSchema {
        [key: string]: string;
    }

    class db {
        directory: string;
        maxSize: number;
        index: number;
        models: { [key: string]: ModelSchema };

        constructor(directory: string, maxSize?: number);

        private _loadIndex(): void;
        private _getFilePath(index: number): string;
        private _loadContent(index: number): object;
        private _saveContent(index: number, content: any): void;
        private _getPartition(): { index: number, content: object };
        private _savePartition(index: number, content: any): void;
        private _validateModel(data: any, model: ModelSchema): void;

        has(key: string): boolean;
        get(key: string): any;
        set(key: string, value: any, modelName?: string): void;
        remove(key: string): void;
        find(value: any): string[];
        count(): number;
        getAll(): { [key: string]: any };
        importData(file: string): void;
        exportData(file: string): void;
        purge(): void;
        createModel(name: string, schema: ModelSchema): void;
    }

    export class sgdb {
        /**
         * Constructs a new instance of the class.
         * @param {string} dir - The directory path.
         */
        constructor(dir: string);

        private dir: string;
        private db: { [key: string]: db };
        private dblist: string[];

        /**
         * Adds a new database.
         * @param {string} name - The name of the database.
         * @param {number} [n] - The optional maximum size of the database.
         */
        addddb(name: string, n?: number): void;

        /**
         * Removes a database.
         * @param {string} name - The name of the database to remove.
         */
        removedb(name: string): void;

        /**
         * Accesses a database.
         * @param {string} name - The name of the database to access.
         * @returns {db} - The database instance.
         */
        accessdb(name: string): db;

        /**
         * Lists all databases.
         * @returns {string[]} - An array of database names.
         */
        listdb(): string[];
    }
}
