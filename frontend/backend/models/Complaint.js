const mongoose = require("mongoose");

const ComplaintImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    name: { type: String },
  },
  { _id: false }
);

const ComplaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    studentId: {
      type: String,
      required: true,
            trim: true,
    },
    studentName: {
      type: String,
      required: true,
            trim: true,
    },
    title: {
      type: String,
      required: [true, "Complaint title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      default: "Plumbing",
      trim: true,
    },
    priority: {
      type: String,
      required: true,
      default: "Medium",
      enum: ["Low", "Medium", "High", "Critical", "low", "medium", "high", "critical"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    building: {
      type: String,
      required: [true, "Building is required"],
      trim: true,
    },
    floor: {
      type: String,
      required: [true, "Floor is required"],
      trim: true,
    },
    room: {
      type: String,
      required: [true, "Room is required"],
      trim: true,
    },
    images: [ComplaintImageSchema],
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    assignedTo: {
      type: String,
      default: "Hostel Maintenance Division",
    },
    resolutionNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick queries
ComplaintSchema.index({ studentId: 1, createdAt: -1 });
ComplaintSchema.index({ status: 1 });

module.exports = mongoose.model("Complaint", ComplaintSchema);
