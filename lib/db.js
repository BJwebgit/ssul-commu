const mysql = require("mysql");

let db = mysql.createConnection({
    user: "root",
    password: "111111",
    database: "comm_login"
})

db.connect();
module.exports=db;