const AuthUser = require("../model/Authorisation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Register = async (req, res) => {
  try {
    const { Name, Password, Email } = req.body;
    if (!Name || !Password || Email === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existedUser = await AuthUser.findOne({ Email });
    if (existedUser) {
      return res
        .status(409)
        .json({ message: "User is Already Registerd With This Email" });
    }
    const hashedPassword = await bcrypt.hash(Password, 8);
    const NewUser = new AuthUser({ Name, Email, Password: hashedPassword });
    await NewUser.save();
    return res
      .status(201)
      .json({ message: "User is Successfully Registred!", user: NewUser });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const Login = async (req, res) => {
    try {
      const { Password, Email } = req.body;
      if (!Password || Email === undefined) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const existedUser = await AuthUser.findOne({ Email: Email });
      if (!existedUser) {
        return res.status(404).json({ message: "User is Not registered" });
      }
      const IsMatch = await bcrypt.compare(Password, existedUser.Password);
      if (!IsMatch) {
        return res.status(404).json({ message: "Incorrect Password" });
      }
      const Token = jwt.sign(
        { existedUserId: existedUser._id },
        process.env.SECRET_KEY,
        { expiresIn: "2h" }
      );
      res.cookie('token', Token, {
        secure: process.env.NODE_ENV === 'production',  
        maxAge: 3600000,         
      });
      return res.status(200).json({ message: "User Successfully Logged in", token:Token });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

   const logout = (req, res) => {
    try {
      res.clearCookie("token");
      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server error" });
    }
  };
  

module.exports = { Register, Login , logout };
