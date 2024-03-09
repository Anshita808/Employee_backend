const jwt = require("jsonwebtoken");
const EmployModel = require("../models/employ.model");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const token = req.headers?.authorization;
    if (!token) return res.status(403).send({ msg: "invalid token" });

    const decode = jwt.verify(token, process.env.secreteKey);
    const user = await EmployModel.findOne({ _id: decode.userId });
    if (!user)
      return res.status(403).send({ msg: "User not found or invalid token" });

    req.user = user;
    req.userId = decode.userId;
    next();
  } catch (error) {
    res.status(503).send({ msg: error.message });
  }
};

const isManager = async (req, res, next) => {
  try {
    const employee = await EmployModel.findById(req.userId);

    if (!employee || employee.role !== "manager")
      return res.status(403).send({ msg: "Access Forbidden" });
    next();
  } catch (error) {
    res.status(503).send({ msg: error.message });
  }
};

module.exports = {
  auth,
  isManager,
};
