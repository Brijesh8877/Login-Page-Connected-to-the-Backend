const mysql=require('mysql2');

const connection=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'India@8877',
  database: 'login' 
});

connection.connect((err)=>{
    if (err){
        console.log("Error Connecting to the Database",err);
    }
    else{
        console.log("Connected To the Database");
    }
});
module.exports=connection;