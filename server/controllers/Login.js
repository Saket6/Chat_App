
const User=require('../models/User')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
// const cookieparser=require('cookie-parser');

const Login=async (req,res)=>
{
    const {email,password}=req.body.logdet;
    try{
        const existUser=await User.findOne({email});
        if(!existUser)
        {
            return res.status(401).json({"error": "User doesnot exist.Please register first." });
        }
        else
        {
           
            const validatePassword=await bcrypt.compare(password,existUser.password,);
            // console.log(validatePassword);
            if(validatePassword)
            {
                const tokenobj={
                    id: existUser._id,
                    name: existUser.name
                }

                const token= jwt.sign(tokenobj,process.env.SECRET_KEY,{expiresIn: '24h'});
                console.log(token);
                res.cookie('user_data',token,{maxAge:360000000000,httpOnly: false});
                return res.status(200).json({"message":"Signed in successfully"});
            }
            else
            {
                return res.status(401).json({"error":"Invalid credentials"});
            }
        }
    }
    catch(err){console.log(err)}
}

module.exports=Login;