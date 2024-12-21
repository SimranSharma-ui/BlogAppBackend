const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router1 = require("./Route/UserRouter");
const router2 = require("./Route/TodoRouter");
const router3 = require("./Route/BlogRouter");
const path = require("path"); 

const dotenv = require("dotenv");
const { dirname, join } = require("path");

dotenv.config();  

const app = express();
app.use(cors());  
app.use(express.json());

const _dirname = __dirname;

app.use("/uploader", express.static(path.join(__dirname, "Uploader"))); 

// MongoDB connection
const mongoDb = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB is Connected");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB:", err);
    });
};

mongoDb();

// Routers
app.use("/api/User", router1);
app.use("/api/Todo", router2);
app.use("/api/Blog", router3);

// Port configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
