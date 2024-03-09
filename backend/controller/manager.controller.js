const DepartmentModel = require("../models/department.model");
const EmployModel = require("../models/employ.model");

const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    const newDepartment = new DepartmentModel({ name });
    await newDepartment.save();

    res
      .status(201)
      .send({ msg: "Department created", department: newDepartment });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const getAllDepartments = async (req, res) => {
  try {
    const departments = await DepartmentModel.find();
    if (departments.length === 0)
      return res
        .status(403)
        .send({ msg: "No Department Found ! Create Department" });
    res.status(200).send({ departments });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedDepartment = await DepartmentModel.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updatedDepartment) {
      return res.status(404).send({ msg: "Department not found" });
    }

    res
      .status(200)
      .send({ msg: "Department updated", department: updatedDepartment });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDepartment = await DepartmentModel.findByIdAndDelete(id);
    if (!deletedDepartment) {
      return res.status(404).send({ msg: "Department not found" });
    }

    res.status(200).send({ msg: "Department deleted" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const assignDepartmentToEmployee = async (req, res) => {
  try {
    const { employeeId, departmentId } = req.params;

    // Check if the employee exists
    const employee = await EmployModel.findById(employeeId);
    if (!employee) {
      return res.status(404).send({ msg: "Employee not found" });
    }

    // Check if the user is a manager
    if (req.user.role !== "manager") {
      return res
        .status(403)
        .send({ msg: "Only managers can assign departments" });
    }

    // Check if the department exists
    let department = await DepartmentModel.findById(departmentId);

    // If the department doesn't exist, create a new one
    if (!department) {
      department = new DepartmentModel({
        _id: departmentId,
        name: "Department",
      });
      await department.save();
    }

    // Assign the department to the employee using updateOne
    await EmployModel.updateOne(
      { _id: employeeId },
      { $set: { department: departmentId } }
    );

    res.status(200).send({
      msg: "Department assigned to employee successfully",
      employeeId,
    });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
  assignDepartmentToEmployee,
};
