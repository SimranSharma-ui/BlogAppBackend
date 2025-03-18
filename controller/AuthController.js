const AuthUser = require("../model/Authorisation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

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


  const ForgetPassword = async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required!" });
      }
      const user = await AuthUser.findOne({ Email: email });
      console.log("user",user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
        expiresIn: "1hour",
      });
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS, 
        },
      });
  
      const resetLink = `https://blogappbackend-8pw0.onrender.com/reset-password/${token}`;
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Password",
        html: `
          <h1>Reset Your Password</h1>
          <p>Click the following link to reset your password:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>This link will expire in 10 minutes.</p>
        `,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.response);
  
      return res.status(200).json({ message: "Email sent successfully" });
  
    } catch (err) {
      console.error("Error sending email:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
 
  const ResetPassword = async (req, res) => {
    try {
      
        const { token } = req.params;
        const { password } = req.body; 


        if (!token) {
            return res.status(400).json({ message: "Token not provided" });
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const user = await AuthUser.findById(decodedToken.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

      
        const hashedPassword = await bcrypt.hash(password, 8);
        user.Password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.error("Error resetting password:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
  

module.exports = { Register, Login , logout , ForgetPassword ,ResetPassword };
