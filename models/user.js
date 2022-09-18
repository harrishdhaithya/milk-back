const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid").v1;


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxlength:32,
        trim:true
    },
    lastname:{
        type:String,
        maxlength:32,
        trim:true
    },
    email:{
        type: String,
        trim:true,
        required:true,
        unique:true
    },
    userinfo:{
        type:String,
        trim:true
    },
    encry_password:{
        type:String,
        required:true
    },
    salt:String,
    role:{
        type: Number,
        default:0
    },
    purchases:{
        type:Array,
        default:[]
    }
},{timestamps:true});




userSchema.methods={
    authenticate:function(plainpassword){
        // console.log([this.securePassword(plainpassword),this.encry_password])
        return this.securePassword(plainpassword)===this.encry_password;
    },
    securePassword:function(plainpassword){
        if(!plainpassword) return "";
        try{
            return crypto.createHmac('sha256',this.salt)
            .update(plainpassword)
            .digest('hex')
        }catch(err){
            return "";
        }
    }
}

userSchema.virtual("password")
    .set(function(password){
        this._password = password;//private
        this.salt = uuidv1();
        this.encry_password = this.securePassword(password);
    })
    .get(function(){
        return this._password;
    })

module.exports = mongoose.model("user",userSchema);