const express = require("express");
const { auth, isManager } = require("../middleware/auth");
const employRoute = express.Router();

const employController = require("../controller/employee.controller");


employRoute.post("/register", employController.register);
employRoute.post("/login", employController.login);
employRoute.get("/getAllEmploy", auth, employController.getAllEmployees);
employRoute.put("/update-employ/:id", auth, isManager, employController.updateEmployee);
employRoute.delete("/delete-employ/:id", auth, isManager, employController.deleteEmployee);
employRoute.get("/filter-employ", auth, employController.filterEmployees);

module.exports = employRoute;
