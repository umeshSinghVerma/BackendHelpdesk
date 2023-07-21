const jwt = require("jsonwebtoken");
const userModle = require("../Modles/userModle");

const RequireAuth = async(req,res,next)=>{
    const {authorization} = req.headers;
    if(!authorization){
       return res.status(401).json("Authorization requires token");
    }
    const token = authorization.split(' ')[1];
    try{
        const {_id} = jwt.verify(token,process.env.SECRET_KEY);
        req.user = await userModle.findOne({_id}).select('_id');
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).json("request is not authorized");
    }
}
module.exports = RequireAuth;