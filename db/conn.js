const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "website3",
  //website 3
});
db.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log("database connection successfully");
});
module.exports = db;
// const query=`create  table temp(id INT,value VARCHAR(255));`;
// db.query(query,(err,res)=>{
//     if(err)throw Error(err);
//     console.log(res);
//     console.log("table is created");
// });
