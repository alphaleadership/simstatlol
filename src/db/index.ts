const fs=require('fs')
const db=require('./db/db').db

export class sgdb{

   /**
   * Constructs a new instance of the class.
   *
     * @param {string} dir - The directory path.
     */

   private dir: string;
   private db: { [key: string]: typeof db };
   private dblist: string[];

    constructor(dir:string){
        this.dir=dir
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir)
        }
        this.db={}
        this.dblist=fs.readdirSync(dir)
        for(let i=0;i<this.dblist.length;i++){
            this.addddb(this.dblist[i].split('.')[0])
        }
    }
    addddb(name:string,n?:number){
        this.db[name]=new db(`${this.dir}/${name}`,n)
    }
    removedb(name:string){
        //delete this.db
        this.db={}
        fs.unlinkSync(`${this.dir}/${name}.json`)
        this.dblist=fs.readdirSync(this.dir)
        for(let i=0;i<this.dblist.length;i++){
            this.addddb(this.dblist[i].split('.')[0])
        }
    }
    accessdb(name:string){
        return this.db[name]
    }
    listdb(){
        return this.dblist
    }
}