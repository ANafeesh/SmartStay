
const Building = require("../models/Building");

// Create a building
const createBuilding = async (req, res) => {
  try {
    const { name, code, address, floors, description } = req.body;

    const building = await Building.create({
      name,
      code,
      address,
      floors,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Building created successfully",
      data: building,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Building code already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create building",
      error: error.message,
    });
  }
};

// Get all buildings
const getAllBuildings = async (req, res) => {
  try {
    const buildings = await Building.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: buildings.length,
      data: buildings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch buildings",
      error: error.message,
    });
  }
};

// Get one building by ID
const getBuildingById = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);

    if (!building) {
      return res.status(404).json({
        success: false,
        message: "Building not found",
      });
    }

    res.status(200).json({
      success: true,
      data: building,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid building ID",
    });
  }
};

// Update a building
const updateBuilding = async (req, res) => {
  try {
    const building = await Building.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!building) {
      return res.status(404).json({
        success: false,
        message: "Building not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Building updated successfully",
      data: building,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Building code already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(400).json({
      success: false,
      message: "Failed to update building",
      error: error.message,
    });
  }
};

// Delete a building
const deleteBuilding = async (req, res) => {
  try {
    const building = await Building.findByIdAndDelete(req.params.id);

    if (!building) {
      return res.status(404).json({
        success: false,
        message: "Building not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Building deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete building",
      error: error.message,
    });
  }
};

module.exports = {
  createBuilding,
  getAllBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
};
