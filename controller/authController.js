const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const register = async (req, res) => {
  const { username, password, email, roles } = req.body;

  try {
    if (!password) throw new Error("Password is required");
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ password: hashedPassword, username, email, roles });
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Registration error: ", error.message);
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!password || !username)
      throw new Error("Password & username is required");
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Credentials Invalid" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Credentials Invalid" });

    if (!process.env.JWT_SECRET) throw new Error("JWT secret is not defined");

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        roles: user.roles
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    console.error("Login error: ", error.message);
    res.status(400).json({ message: error.message });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const viewEmployee = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No employee with id: ${id}`);

  try {
    const employee = await User.findById(id);
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { username, password, email, roles } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No Employee with id: ${id}`);

  try {
    const updatedEmployee = await User.findByIdAndUpdate(
      id,
      { username, password, email, roles },
      { new: true }
    );
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEmployee = await User.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: `No employee with id: ${id}` });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login, getAllEmployees, viewEmployee, updateEmployee, deleteEmployee };
