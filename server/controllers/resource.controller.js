const Resource = require("../models/Resource.js");

require("../models/Department.js");
require("../models/Employee.js");

const createResource = async (req, res) => {
  try {
    const {
      name,
      type,
      category,
      url,
      description,
      accessLevel,
      department,
      createdBy,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Resource name is required",
      });
    }

    const resource = await Resource.create({
      name,
      type,
      category,
      url,
      description,
      accessLevel,
      department: department || null,
      createdBy: createdBy || null,
    });

    return res.status(201).json({
      message: "Resource created successfully",
      resource,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getResources = async (req, res) => {
  try {
    const filter = {};

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.department) {
      filter.department = req.query.department;
    }

    if (req.query.accessLevel) {
      filter.accessLevel = req.query.accessLevel;
    }

    if (req.query.isArchived !== undefined) {
      filter.isArchived = req.query.isArchived === "true";
    }

    const resources = await Resource.find(filter)
      .populate("department", "name code")
      .populate("createdBy", "employeeId firstName lastName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate("department", "name code")
      .populate("createdBy", "employeeId firstName lastName");

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    return res.status(200).json({
      resource,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    const allowedFields = [
      "name",
      "type",
      "category",
      "url",
      "description",
      "accessLevel",
      "department",
      "isArchived",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        resource[field] = req.body[field];
      }
    });

    await resource.save();

    return res.status(200).json({
      message: "Resource updated successfully",
      resource,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createResource,
  getResources,
  getResourceById,
  updateResource
};