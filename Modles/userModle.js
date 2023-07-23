const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const validator = require('validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is Required']
    },
    password: {
        type: String,
        required: [true, 'Password is Required']
    },
    profile:{
        type:String
    }
})

userSchema.statics.signup = async function (email, password){

    // validation
    if(!email || !password){
        throw Error("All fields must be required");
    }
    if(!validator.isEmail(email)){
        throw Error("Email is not valid");
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Password is not valid');
    }
    const exist = await this.findOne({ email });
    if (exist) {
        throw Error("Email already exist");
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await this.create({ email, password: hash })
    return user;
}

userSchema.statics.login = async function(email,password){
    if(!email || !password){
        throw Error("Please provide both Email and Password");
    }
    const user = await this.findOne({email});
    if(!user){
        throw Error(`No User found with ${email}`);
    }
    const isValidPassword = await bcrypt.compare(password,user.password);
    if(!isValidPassword){
        throw Error("Invalid Password")
    }
    return user
}

module.exports = mongoose.model('User', userSchema);