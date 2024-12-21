const Blog = require("../model/Blog");
const upload = require("../Middleware/Multer");

const Create = async (req, res) => {
  try {
    const { Name, Description, liked } = req.body;

    if (!Name || !Description || liked === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageUrl = `http://localhost:3000/Uploader/${req.file.filename}`;

    const newBlog = new Blog({
      Name,
      Description,
      liked,
      Image: imageUrl,
    });

    await newBlog.save();

    return res
      .status(201)
      .json({ message: "Blog created successfully", Blog: newBlog });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const AllBlogs = async (req, res) => {
  try {
    const Blogs = await Blog.find();
    return res
      .status(200)
      .json({ message: "All Blogs Are here", blogs: Blogs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const existBlog = await Blog.findById({ _id: id });
      if (!existBlog) {
        return res
          .status(404)
          .json({ message: "Blog with this id does not exist" });
      }

      const { Name, Description, liked } = req.body;

      let imageUrl = existBlog.imageUrl;

      if (req.file) {
        
        imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
      }

      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        {
          Name,
          Description,
          liked,
          imageUrl, 
        },
        { new: true }
      );

      return res
        .status(200)
        .json({ message: "Blog Updated Successfully", Blog: updatedBlog });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const GetOneBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const existedBlog = await Blog.findOne({ _id: id });
    if (!existedBlog) {
      return res
        .status(404)
        .json({ message: "Blog with this id does not exists" });
    }
    return res.status(200).json({ message: "there is Blog", existedBlog });
  } catch (err) {
    console.log("Error", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const existBlog = await Blog.findById({ _id: id });
    if (!existBlog) {
      return res
        .status(404)
        .json({ message: "Blog with this id does not exists" });
    }
    const deletedBlog = await Blog.findByIdAndDelete(id);
    return res.status(201).json({ message: "Blog Deleted Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Sever Error" });
  }
};

module.exports = { Create, AllBlogs, updateBlog, deleteBlog, GetOneBlog };
