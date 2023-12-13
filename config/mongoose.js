//importinf mongoose
const mongoose=require('mongoose');

//connecting to the mongoDB on localhost on port 27017
mongoose.connect('mongodb://192.168.1.27:27017/userDB');

//storing the DB connection in db
const db=mongoose.connection;

//setting up event listener for error while setting up the connection to DB
db.on('error',console.error.bind(console, 'error connecting to mongoDB'));

//one time event-listener when connection in successful
db.once('open',function(){
    console.log('successfully connected to database');
});


module.exports=db;