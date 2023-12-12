const mongoose=require('mongoose');

//new User DB schema
const userSchema=new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

//creating a DB model using that schema
const User=mongoose.model('User',userSchema);

module.exports=User;