const express = require('express');
const router = express.Router();
const {
    loginfn,
    signupfn
} = require('../controllers/userController');


router.post("/login", loginfn);
router.post("/signup", signupfn)

module.exports = router;