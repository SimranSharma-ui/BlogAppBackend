const User = require("../model/User");

const Create = async (req, res) => {
  try {
    const { email } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({ error: "User already exists" });
    }

    const newUser = new User(req.body);
    await newUser.save();
    return res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const GetAllUser = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const GetUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user: userExist });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const Update = async (req, res) => {
  try {
    const { id } = req.params;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ error: "User with this ID does not exist" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const Delete = async (req, res) => {
  try {
    const { id } = req.params;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ error: "User with this ID does not exist" });
    }

    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { Create, GetAllUser, Update, Delete, GetUserById };
