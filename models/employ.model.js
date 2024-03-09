const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  location: { type: String, require: true },
  role: {
    type: String,
    enum: ["manager", "employee"],
    default: "employee",
  },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
});

const EmployModel = mongoose.model("employee", userSchema);

module.exports = EmployModel;
