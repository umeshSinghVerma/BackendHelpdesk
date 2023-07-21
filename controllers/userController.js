const userModle = require('../Modles/userModle')
const jwt = require('jsonwebtoken');

const CreateToken = (_id)=>{
    return jwt.sign({_id},process.env.SECRET_KEY,{expiresIn:'3d'})
}

const loginfn = async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user = await userModle.login(email,password);
        const userId = user._id;
        const token = CreateToken(user._id);
        res.status(200).json({email,token,userId});    
    }
    catch(error){
        res.status(400).json(error.message);
    }
}
const signupfn = async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user = await userModle.signup(email,password);
        const token = CreateToken(user._id);
        res.status(200).json({email,token});
    }
    catch(err){
        res.status(400).json(err.message);
    }
}

module.exports = {
    loginfn,
    signupfn
}