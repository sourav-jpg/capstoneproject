const jwt = require("jsonwebtoken");

const User = require("../model/dataSchema");

const Authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await User.findOne({
      _id: verifyToken._id 
    });
    const allUser = await User.find({ role: "User" });

    const userData = [rootUser];
    const allUserData = [...allUser];

    if (rootUser.role === "admin") {
      res.json(allUserData);
      console.log(allUserData)
    } else if (rootUser.role === "User") {
      res.json(userData);
    }

    if (!rootUser) {
      throw new Error("user not found");
    }

    next();
  } catch (err) {
    console.log("catch");
    res.status(401).json("user is not authenticated");
    console.log(err, "jwt error error =>");
  }
};

module.exports = Authenticate;
