const express = require("express");

const manaerRoute = express.Router();

const managerController = require("../controller/manager.controller");
const { auth, isManager } = require("../middleware/auth");

manaerRoute.post(
  "/create-department",
  auth,
  isManager,
  managerController.createDepartment
);
manaerRoute.get(
  "/get-department",
  auth,
  isManager,
  managerController.getAllDepartments
);
manaerRoute.put(
  "/update-department/:id",
  auth,
  isManager,
  managerController.updateDepartment
);
manaerRoute.delete(
  "/delete-department/:id",
  auth,
  isManager,
  managerController.deleteDepartment
);
manaerRoute.post(
  "/assign-department/:employeeId/:departmentId",
  auth,
  isManager,
  managerController.assignDepartmentToEmployee
);

module.exports = manaerRoute;
