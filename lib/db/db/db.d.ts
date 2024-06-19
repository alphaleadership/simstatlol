interface ModelSchema {
    [key: string]: string;
}
export declare class db {
    directory: string;
    maxSize: number;
    index: number;
    models: {
        [key: string]: ModelSchema;
    };
    constructor(directory: string, maxSize?: number);
    _loadIndex(): void;
    _getFilePath(index: number): string;
    _loadContent(index: number): object;
    _saveContent(index: number, content: object): void;
    _getPartition(): {
        index: number;
        content: object;
    };
    _savePartition(index: number, content: any): void;
    has(key: string): boolean;
    get(key: string): any;
    set(key: string, value: any, modelName?: string): void;
    createModel(name: string, schema: ModelSchema): void;
    _validateModel(data: any, model: ModelSchema): void;
    remove(key: string): void;
    find(value: any): string[];
    count(): number;
    getAll(): {
        [key: string]: any;
    };
    importData(file: string): void;
    exportData(file: string): void;
    purge(): void;
}
export {};
