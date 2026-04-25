const { string, required } = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
   
    phone:{
        type:String,
        require:true
    },
    pan:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
     email:{
        type:String,
        require:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    employment:{
        type:String,
        required:true
    },
    income:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    }

});


module.exports = mongoose.model('ramfinmodel',userSchema, 'webuser');
