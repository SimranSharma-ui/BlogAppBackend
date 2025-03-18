const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router1 = require("./Route/UserRouter");
const router2 = require("./Route/TodoRouter");
const router3 = require("./Route/BlogRouter");
const AuthRouter = require("./Route/AuthRouter");
const cookieParser = require("cookie-parser");
const path = require("path");

const dotenv = require("dotenv");
const { dirname, join } = require("path");

dotenv.config();

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: ["https://blog-app-frontend-peach.vercel.app", "http://localhost:5173/"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
 
  })
);


app.use(express.json());


const _dirname = __dirname;

app.use("/uploader", express.static(path.join(__dirname, "Uploader")));

const mongoDb = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB is Connected");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB:", err);
    });
};

mongoDb();


app.use("/api/User", router1);
app.use("/api/Todo", router2);
app.use("/api/Blog", router3);
app.use("/Authorisation", AuthRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
