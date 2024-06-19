export declare class sgdb {
    /**
    * Constructs a new instance of the class.
    *
      * @param {string} dir - The directory path.
      */
    private dir;
    private db;
    private dblist;
    constructor(dir: string);
    addddb(name: string, n?: number): void;
    removedb(name: string): void;
    accessdb(name: string): any;
    listdb(): string[];
}
