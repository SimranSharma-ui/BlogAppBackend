const express = require("express");
const upload = require("../Middleware/Multer");  
const { AllBlogs, Create, updateBlog, deleteBlog, GetOneBlog } = require("../controller/BlogController");

const router = express.Router();

router.get("/AllBlogs", AllBlogs);
router.post("/create", upload, Create);  
router.put("/update/:id",upload, updateBlog);
router.delete("/delete/:id", deleteBlog);
router.get("/getOneBlog/:id", GetOneBlog);

module.exports = router;
