const express=require('express');
const Router=express.Router();
const User=require('../models/User');
const Register=require('../controllers/Register');
const Login=require('../controllers/Login');
const authenticate=require('../Router/authenticate')
const Message=require('../models/message');
// const multer  = require('multer')
// const storage = multer.diskStorage({
//     destination: 'uploads/',
//     filename: (req, file, cb) => {
//       cb(null, file.originalname);
//     },
//   });
  
//   const upload = multer({ storage });

Router.post('/register',Register);
Router.post('/login',Login);


// Router.post('/upload', upload.single('file'), (req, res) => {
//     try {
//       // Get the file path from the request
//       const filePath = req.file.path;
  
//       // Generate the file URL based on your server's public URL
//       const fileUrl = `http://localhost:5000/${filePath}`; // Adjust this URL accordingly
  
//       // Return the file URL in the response
//       res.json({ fileUrl });
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       res.status(500).json({ error: 'File upload failed' });
//     }
//   });




Router.post('/avatar', authenticate,async (req,res)=>
{
    try{
        const user=await User.findByIdAndUpdate(req.currUser._id,{
            isImageSet:true,
            AvatarImg: req.body.avatar
        });

        console.log("set avatar");

        return res.status(200).json({"message":"Avatar Created"});
    }catch(e){
        return res.status(500).json({"error":"Couldn't set avatar"});
    }
   
    
});

Router.get('/getCurrUser', authenticate ,async (req,res)=>
{
    return res.json(req.currUser);
})


Router.get('/getContacts', authenticate,async (req,res)=>
{
    try{
        const contacts=await User.find( {_id:{$ne:req.currUser._id} })
        return res.status(200).json(contacts);
    }
    catch(err)
    {
        console.log(err);
    }
   
})

Router.post('/postmessage',authenticate ,async (req,res)=>
{
    try{
        // console.log(req.body);
        // const file=req.file.originalname;
        // console.log(file);
        const Msg=new Message(req.body);
        const resp=await Msg.save();
        // console.log("Message saved");
        if(!resp){ throw new Error("Message Not Saved"); }
        return res.status(200).json({message:"message sent successfully"})
    }catch(err){console.log(err);}
   

})

Router.post('/getmessage',authenticate,async (req,res)=>{
    try{
        const messages=await Message.find({$or:[{from:req.body.self,to:req.body.other},{from:req.body.other,to:req.body.self}]}).sort({timestamp:1})
        const resp_msg=messages?.map((message,index)=>
        {
            if(message.from.toString() === req.body.self)
            {
                return{
                    message: message.message,
                    self: true
                }
            }
            else
            {
                return{
                    message: message.message,
                    self: false
                }
            }
        })
        console.log(resp_msg);

       return res.status(200).json(resp_msg);
    }
    catch(err){console.log(err);}
})


Router.get('/logout', (req,res)=>
{
    res.cookie('user_data', '', { expires: new Date(0) });
    res.status(200).send('Cookie removed');
})


module.exports=Router;