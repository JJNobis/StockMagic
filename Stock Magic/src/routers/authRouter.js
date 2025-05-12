const express = require('express');
const mysql = require('mysql2');


const con = mysql.createConnection({
   host: 'localhost',
   user: "root",
   password: "stockmagic",
   database: "stockmagicaccounts"

});

const authRouter = express.Router();

authRouter.route('/signUp').post((req, res)=>{
    const {first, last, emailAddress, userName, passWord, fundsAccount } = req.body;

   
    

    (async function addUser(){
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = `INSERT INTO customers (fName, lName, email, username, password, funds ) VALUES ("${first}", "${last}", "${emailAddress}", "${userName}", "${passWord}", "${fundsAccount}")`;
            con.query(sql, function(err, result) {
              if (err) throw err;
              console.log("1 record inserted");
            });
          });
    }())
    
    
});

module.exports = authRouter;