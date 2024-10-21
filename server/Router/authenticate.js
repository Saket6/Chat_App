const User = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports = authenticate = async (req, res, next) => {
  try {
    
    const token = req.cookies.user_data;
    const user_data = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(user_data.id);

    req.currUser = user;
    next();
  } catch (err) {

    return res.status(401).json({error: "Please sign in to view this page"});
  }

  
};
