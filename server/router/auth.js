const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const loggers=require("../config/logger")


const cookieParser = require("cookie-parser");
const authenticate = require("../middleware/authenticate");

require("../db/conn");

const User = require("../model/dataSchema");


router.use(cookieParser());

router.get("/", (req, res) => {
  res.send("home");
});



router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  if ((!name, !email, !password, !role)) {
    return res.status(422).json({
      errors: "Fill the all details",
    });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "User already exists" });
    } else {
      const user = new User({
        name,
        email,
        password,
        role,
      });

      const userRegister = await user.save();

      if (userRegister) {
        return res
          .status(201)
          .json({ message: "User registered successfully" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("tryy")
    const { email, password } = req.body;

    
    

    const userLogin = await User.findOne({ email: email });
console.log(userLogin._id)
    let token = jwt.sign(
      {
        _id: userLogin._id,
      },
      process.env.SECRET_KEY
    );


    
console.log("===========tt",token)
    if (!userLogin || userLogin.password !== password) {
      res.status(400).json({ message: "user error" });
    loggers.error("user error")

    } else {
      res.status(200).json({
        message: "user signed in successfully",
        role: userLogin.role,
        token:token,
      })
    

    }
  } catch (err) {
    res.redirect("/error")
    loggers.error("fill data")

    console.log(err);
  }
});





router.post("/details", authenticate, (req, res) => {
const  {token} = req.body
});



router.get('/editData' , async (req, res) => {
  try {
      const samples = await User.find().lean()
      res.json({
          error: false,
          message: "",
          data: samples
      })
  }
  catch (err) {
      next(err)
  }
})

router.put('/edituser',async (req, res, next) => {
  try {
      let { _id, name, email, role } = req.body
      await User.updateOne({ _id }, {
          $set: {
              name,
              email,
              role
          }
      })
      
      res.json({
          error: false,
          message: 'edit success',
          data: { name, email, role }
      })
  } catch (err) {
      next(err)
  }
})

module.exports = router;
