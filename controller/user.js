const db = require('../models');
const{check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = (req,res) => {
    const error = validationResult(req);

    if(!error.isEmpty()){
        return res.status(422).json({
            error:error.array()[0].msg
        });
    }
    //Hashing password
    bcrypt.genSalt(10,function(err,salt) {
        bcrypt.hash(req.body.password,salt,function(err,hash)  {
            const user ={
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                age:req.body.age,
                email:req.body.email,
                password:hash
            }
                //saving user
                db.user.create( user )
                .then( (user) => { res.send(user)})
                .catch( (err) => {
                    res.status(500).json({
                        message:"Something went wrong"
                    })
                    console.log("Error:-",err)
                });
        });
    });
    
};

exports.signin = (req,res) => {
    //find user
    const newuser =  db.user.findOne({ where: { email: req.body.email } })
    // db.user.findOne({Where:{email:req.body.email}})
    .then( (newuser) => {
        if(newuser === null){
            res.status(401).json({
                message:"Invalid credentials "
            });
        }else{
            bcrypt.compare(req.body.password,newuser.password,function(err,result) {
                if(result){
                    //Create token
                    const token = jwt.sign({email:newuser.email},
                        'process.env.SECRET',
                        function(err,token){
                            res.status(200).json({     
                                message:"Authentication successful",
                                token:token
                            });
                        }
                    );
                    //     //Put token in cookie (key,value) pair
                    // res.cookie("token",token,{expire:new Date() + 9999})
                    //     //send response to frontend 
                    // const {id,firstName,email} = user;
                    // return res.json({token,user:{id,firstName,email}});
                }else{
                    res.status(401).json({
                        message:"Password do not match"
                    });
                };
            });
        };
     })
     .catch(err => {
         res.status(500).json({
             message:"Something went wrong"
            });
     });
};

exports.signout = (req,res) => {
    res.clearCookiee("token");
    res.json({
        message:"User Signout Sucessfully"
    });
}
