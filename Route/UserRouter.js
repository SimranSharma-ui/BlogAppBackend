const {Create,GetAllUser,Update,Delete ,GetUserById} = require("../controller/UserController");
const express = require("express")

const Router = express.Router();

Router.post("/Create",Create);
Router.get("/getAllUsers",GetAllUser);
Router.put("/Update/:id",Update);
Router.delete("/Delete/:id",Delete);
Router.get("/getUserById/:id",GetUserById);


module.exports = Router;