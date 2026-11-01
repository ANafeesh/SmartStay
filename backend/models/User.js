const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
      select: false,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: [
        "student",
        "admin",
        "hostel_admin",
        "warden",
        "security",
        "security_officer",
        "maintenance",
        "maintenance_staff",
        "finance",
        "finance_staff",
        "vendor",
        "delivery",
        "delivery_person",
        "executive",
      ],
      default: "student",
      lowercase: true,
      trim: true,
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "inactive", "pending"],
      default: "active",
      lowercase: true,
      trim: true,
    },
    registrationNumber: {
      type: String,
      sparse: true,
      trim: true,
    },
    studentId: {
      type: String,
      trim: true,
    },
    room: {
      type: String,
      trim: true,
    },
    building: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compare password candidate with stored bcrypt hash
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.passwordHash) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Explicitly bind to existing 'users' collection in MongoDB Atlas
module.exports = mongoose.model("User", UserSchema, "users");
