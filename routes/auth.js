const express = require('express');
const router = express.Router();

const {signin,signout,signup,isSignedIn } = require("../controllers/auth");
const { check } = require('express-validator');

//Sign Up User

router.post("/signup",[
    check("name","please enter name").isLength({min : 3}),
    check("email","please enter email").isEmail({min : 3}),
    check("password","password should be greater the 3 characters").isLength({min: 3}),
],signup)

// Sign In routes
router.post("/signin",[

    check("email","please enter email").isEmail(),
    check("password","password field is req ").isLength({min: 1}),

],signin)






router.get("/signout", signout)

router.get("/testroute",isSignedIn,(req,res) =>{

    res.json(req.auth);

})




//router.get("/sigin", signin)

module.exports = router;