const Employee = require("../models/Employee.js");
const User = require("../models/User.js");
require("../models/Role.js");

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("user", "name email role status")
      .populate("department", "name code")
      .populate("role", "name")
      .populate("manager", "firstName lastName employeeId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


const createEmployee = async (req, res) => {
  try {
    const {
      userId,
      employeeId,
      firstName,
      lastName,
      phone,
      department,
      designation,
      hireDate,
      manager,
      address,
    } = req.body;

    if (!userId || !employeeId || !firstName || !lastName) {
      return res.status(400).json({
        message:
          "userId, employeeId, firstName and lastName are required",
      });
    }

    // User must already exist because signup creates User account
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User account not found",
      });
    }

    // Prevent multiple Employee profiles for same User
    const existingEmployee = await Employee.findOne({
      $or: [
        { user: userId },
        { employeeId: employeeId.trim() },
        { email: user.email },
      ],
    });

    if (existingEmployee) {
      return res.status(409).json({
        message: "Employee profile already exists",
      });
    }

    const employee = await Employee.create({
      user: user._id,
      employeeId,
      firstName,
      lastName,
      email: user.email,
      phone,
      department: department || null,
      designation,
      hireDate: hireDate || null,
      manager: manager || null,
      address,
    });

    return res.status(201).json({
      message: "Employee profile created successfully",
      employee,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Employee ID or email already exists",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "firstName",
      "lastName",
      "phone",
      "department",
      "designation",
      "hireDate",
      "manager",
      "address",
      "status",
    ];

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        employee[field] = req.body[field];
      }
    });

    await employee.save();

    return res.status(200).json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateEmployeeRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = [
      "EMPLOYEE",
      "DEPARTMENT_HEAD",
      "ASSET_MANAGER",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const user = await User.findById(employee.user);

    if (!user) {
      return res.status(404).json({
        message: "Linked user account not found",
      });
    }

    user.role = role;

    await user.save();

    return res.status(200).json({
      message: "Employee role updated successfully",
      employeeId: employee._id,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  updateEmployeeRole
};