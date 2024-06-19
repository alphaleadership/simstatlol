const dbsm=require("./db")
const fs=require("fs")
const db=[]
//console.log(dbsm.sgdb)
const dbm=new dbsm.sgdb("data")
//console.log(dbm)
const d=fs.readdirSync("./model").map((file)=>{
    const name=file.split(".")[0]
    dbm.addddb(name,10)
    db[name]=dbm.accessdb(name)
    db[name].createModel(name,...require("../model/"+file))
   return fs.readFileSync(`./types/${name}.txt`).toString().split("\n").map((lines)=>{
        let t={}
        let i =1
        const info =lines.split(":")
        for (const key in require("../model/"+file)) {
           t[key]=info[i]
           i++
        }
        db[name].set(info[0],t,name)
        return db[name]
    })
})
//console.log(d)
console.log(JSON.parse(JSON.stringify((dbm))))