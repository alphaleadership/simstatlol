const fs=require('fs')
const db=require('./db.js')
module.exports=class sgdb{

   /**
   * Constructs a new instance of the class.
   *
     * @param {string} dir - The directory path.
     */

    constructor(dir){
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
    addddb(name,n){
        this.db[name]=new db(`${this.dir}/${name}`,n)
    }
    removedb(name){
        delete this.db
        this.db={}
        fs.unlinkSync(`${this.dir}/${name}.json`)
        this.dblist=fs.readdirSync(this.dir)
        for(let i=0;i<this.dblist.length;i++){
            this.addddb(this.dblist[i].split('.')[0])
        }
    }
    accessdb(name){
        return this.db[name]
    }
    listdb(){
        return this.dblist
    }
}