const User=require('../models/User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const Register=async (req,res)=>
{
    try{

        const {name,email,password,c_password}=req.body.det;
        const enc_pass=await bcrypt.hash(password,10);
        const enc_c_pass=await bcrypt.hash(c_password,10);
        
        // console.log(req.body);
        const exist_user=await User.findOne({email});
        if(exist_user)
        {
            return res.status(401).json({"error":"User alredy exists. Please sign in"});
        }
        else
        {
            const newuser=new User({name,email,password: enc_pass,c_password: enc_c_pass});
            console.log(newuser);
            const response=await newuser.save();
            return res.status(200).json({"message": "Successfully registered"});
        }
       
    }catch(err){console.log(err);}
  
}

module.exports=Register;