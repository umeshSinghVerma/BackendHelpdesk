const express = require('express');
const router = express.Router();
const {
    loginfn,
    signupfn,
    getProfileImage,
    getProfileImageByUser
} = require('../controllers/userController');


router.post("/login", loginfn);
router.post("/signup", signupfn);

router.post("/getProfilePicture",getProfileImage);
router.post("/getProfilePicture_User",getProfileImageByUser);

module.exports = router;