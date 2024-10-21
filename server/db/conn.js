const mongoose = require("mongoose");
require('dotenv').config()
const conn = async () => {
    try
    {
        const res = await mongoose.connect(process.env.mongoURL);
        console.log("database connected successfully");
    }   
    catch(err){console.log(err);}
};

module.exports = conn;
