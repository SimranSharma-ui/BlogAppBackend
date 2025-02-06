const express = require("express");
const { Register, Login, logout, ForgetPassword, ResetPassword } = require("../controller/AuthController");
const Router = express.Router();

Router.post("/Register",Register);
Router.post("/Login",Login);
Router.get("/Logout",logout);
Router.post("/ForgetPassword",ForgetPassword)
Router.post('/reset-password/:token',ResetPassword);

module.exports = Router;
