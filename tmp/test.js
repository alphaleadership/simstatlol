const sgdb=require('.')
console.log(sgdb)
const dbsystem=new sgdb('dbsystem')
console.log(dbsystem)
name=new Date().getTime()
dbsystem.addddb(name)
console.log(dbsystem.accessdb(name).set('key','value'))
dbsystem.listdb().map((db)=>{console.log(db)
   dbsystem.removedb(db.split('.')[0])
})