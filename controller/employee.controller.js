const EmployModel = require("../models/employ.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const { name, email, password, location, role } = req.body;

    const isUserPresent = await EmployModel.findOne({ email });

    if (isUserPresent)
      return res.status(403).send({ msg: "Employee already registered" });

    const hashPass = await bcrypt.hash(password, 10);

    const newEmp = new EmployModel({
      name,
      email,
      password: hashPass,
      location,
      role,
    });

    await newEmp.save();

    res.status(200).send({ msg: "Employee created", newEmp });
  } catch (error) {
    res.status(503).send({ msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isUserExists = await EmployModel.findOne({ email });

    if (!isUserExists) return res.status(403).send({ msg: "Employ not found" });

    const isPassCorrect = await bcrypt.compare(password, isUserExists.password);

    if (!isPassCorrect)
      return res.status(403).send({ msg: "Wrong credential" });

    const token = await jwt.sign(
      { userId: isUserExists._id },
      process.env.secreteKey
    );

    res.status(200).send({ msg: "Login Success", token, isUserExists });
  } catch (error) {}
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await EmployModel.find().populate("department");
    res.status(200).send({ employees });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployee = await EmployModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedEmployee) {
      return res.status(404).send({ msg: "Employee not found" });
    }

    res
      .status(200)
      .send({ msg: "Employee updated", employee: updatedEmployee });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEmployee = await EmployModel.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).send({ msg: "Employee not found" });
    }

    res.status(200).send({ msg: "Employee deleted" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const filterEmployees = async (req, res) => {
  try {
    const { location, sort } = req.query;

    // Build query based on filters
    let query = {};

    if (location) {
      query.location = location;
    }

    // Build sorting options
    let sortOption = {};
    if (sort) {
      if (sort === "asc") {
        sortOption.name = 1; // Ascending order
      } else if (sort === "desc") {
        sortOption.name = -1; // Descending order
      }
    }

    // Find employees based on query and sort options
    const employees = await EmployModel.find(query).sort(sortOption);

    if (employees.length === 0) {
      return res
        .status(404)
        .send({ msg: "No employees found matching the criteria" });
    }

    res.status(200).send({ msg: "Filtered employees", employees });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports = {
  register,
  login,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  filterEmployees,
};
