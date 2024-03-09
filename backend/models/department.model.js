const mongoose = require("mongoose");

const departmentSchema = mongoose.Schema({
  name: { type: String, required: true },
});

const DepartmentModel = mongoose.model("Department", departmentSchema);

module.exports = DepartmentModel;