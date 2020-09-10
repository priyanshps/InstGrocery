const User = require("../models/user");
const { validationResult } = require("express-validator");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
const { user } = require("../routes/auth");

//const user = new User();
exports.signup = (req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()[0].msg
        })
    }


    const user = new User(req.body)
    user.save((err,user)=>{
        if(err)
        {
            return res.status(400).json({
                err:"Not able to save user"
            });
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id,
            password:user.password
        })    
    })
}

exports.signin = (req,res) =>{

    const errors = validationResult(req)
    const {email,password} = req.body; // Extract data from body
    if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()[0].msg
        })
    }

    User.findOne({email}, (err,user) => {

        if(err)
        {
            res.status(400).json({
                error: "USER email does not exist"
            });

        }

        if(!user.autheticate(password))
        {
            return res.status(401).json({
                error: "Email and password do not match"
            })
        }

        //token Created
        const token = jwt.sign({_id: user._id},process.env.SECRET);

        //Put token in cookie

        res.cookie("token",token,{expire:new Date() * 9999})

        //Send respond to frontend

        const{_id,name,email,role} = user;

        return res.json({
            token,user:{_id,name,email,role}
        });

    })


}
exports.signout = (req,res)=>{
    
    res.clearCookie("token");
    res.json
    ({
        message: "User signout Successfully"
        
    })
};



//Protected Routes
   
exports.isSignedIn = expressJwt(
    {
        secret: process.env.SECRET,
        userProperty: "auth",

    }
)

//Custom Middlewares

exports.isAuthenticated = (req,res,next) =>
{
    let checker = req.profile && req.auth && req.profile._id == req.auth._id

    if(!checker)
    {
        return res.status(403).json({
            error: "ACCESS DENIED"
        })
    }

    next();
}

exports.isAdmin = (req,res,next) => 
{
    if(req.profile.role ===0)
    {
        return res.status(403).json({
            error: "You are not Admin ACCESS DENIED"
        })
    }

    next();
}