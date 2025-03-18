const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router1 = require("./Route/UserRouter");
const router2 = require("./Route/TodoRouter");
const router3 = require("./Route/BlogRouter");
const AuthRouter = require("./Route/AuthRouter");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
app.use(cookieParser());

app.use(
    cors({
        origin: [
            "https://blog-app-frontend-peach.vercel.app",  // ✅ Allow Vercel frontend
            "http://localhost:5173"  // ✅ Allow local development
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// ✅ Allow CORS for all routes
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization");
    
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

app.use("/uploader", express.static(path.join(__dirname, "Uploader")));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB Error:", err));

app.use("/api/User", router1);
app.use("/api/Todo", router2);
app.use("/api/Blog", router3);
app.use("/Authorisation", AuthRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
