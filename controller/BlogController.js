const Blog = require("../model/Blog");

const Create = async (req, res) => {
  try {
    const { Name, Description, liked, Category } = req.body;
    if (!Name || !Description || !Category || liked === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    const imageUrl = `https://blogappbackend-8pw0.onrender.com/Uploader/${req.file.filename}`;
    const newBlog = new Blog({
      Name,
      Description,
      liked,
      Category,
      Image: imageUrl,
    });
    await newBlog.save();
    return res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const AllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    return res.status(200).json({ message: "All Blogs Are here", blogs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Description, liked, Category } = req.body;
    const existBlog = await Blog.findById(id);
    if (!existBlog) {
      return res.status(404).json({ message: "Blog with this id does not exist" });
    }

    if (!Name || !Description || !Category || liked === null) {
      return res.status(400).json({
        message: "All fields (Name, Description, liked) are required",
      });
    }

    let imageUrl = existBlog.Image;
    if (req.file) {
      imageUrl = `https://blogappbackend-8pw0.onrender.com/Uploader/${req.file.filename}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        Name,
        Description,
        liked,
        Category,
        Image: imageUrl,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const GetOneBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog with this id does not exist" });
    }
    return res.status(200).json({ message: "There is Blog", blog });
  } catch (err) {
    console.log("Error", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const existBlog = await Blog.findById(id);
    if (!existBlog) {
      return res.status(404).json({ message: "Blog with this id does not exist" });
    }
    await Blog.findByIdAndDelete(id);
    return res.status(200).json({ message: "Blog Deleted Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { Create, AllBlogs, updateBlog, deleteBlog, GetOneBlog };
