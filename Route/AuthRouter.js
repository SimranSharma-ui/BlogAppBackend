const express = require("express");
const { Register, Login, logout } = require("../controller/AuthController");
const Router = express.Router();

Router.post("/Register",Register);
Router.post("/Login",Login);
Router.get("/Logout",logout);

module.exports = Router;
