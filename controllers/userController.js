const userModle = require('../Modles/userModle')
const helpdeskModle = require('../Modles/helpdeskModle')
const jwt = require('jsonwebtoken');
const CreateToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: '3d' })
}

const loginfn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModle.login(email, password);
        const userId = user._id;
        const token = CreateToken(user._id);
        res.status(200).json({ email, token, userId });
    }
    catch (error) {
        res.status(400).json(error.message);
    }
}
const signupfn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModle.signup(email, password);
        const token = CreateToken(user._id);
        const userId = user._id;
        res.status(200).json({ email, token, userId });
    }
    catch (err) {
        res.status(400).json(err.message);
    }
}

const getProfileImage = async (req, res) => {
    const { BlogId } = req.body;
    try {
        const Blog = await helpdeskModle.findOne({ blogindex: BlogId });
        if (Blog) {
            // console.log("Blog in get Profile image", Blog);
            const userId = Blog.userId;
            const user = await userModle.findOne({ _id: userId });
            if (user) {
                // console.log("found user in profile picture",user);
                const profilePicture = user.profile;
                if (profilePicture) {
                    // console.log(profilePicture);
                    res.status(200).json(profilePicture);
                }
                else {
                    res.status(400).json("No profile picture uploaded");
                }
            }
        }
    }
    catch (err) {
        console.log(err.message);
        res.status(400).json(err.message);
    }

}
const getProfileImageByUser = async (req, res) => {
    console.log("profile request",req.body);
    const { userId } = req.body;
    try {
        const user = await userModle.findOne({ _id: userId });
        if (user) {
            // console.log("found user in profile picture",user);
            const profilePicture = user.profile;
            if (profilePicture) {
                // console.log(profilePicture);
                res.status(200).json(profilePicture);
            }
            else {
                res.status(400).json("No profile picture uploaded");
            }
        }
    }
    catch (err) {
        console.log(err.message);
        res.status(400).json(err.message);
    }

}

module.exports = {
    loginfn,
    signupfn,
    getProfileImage,
    getProfileImageByUser
}