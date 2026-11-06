const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const connectDB = require("../config/db");
const MonitoringReading = require("../models/MonitoringReading");

async function seedTelemetry() {
  await connectDB();
  const count = await MonitoringReading.countDocuments();
  if (count <= 1) {
    const blocks = ["Block A - Aurora Hall", "Block B - Horizon Hall", "Block C - Lakeside Residence", "Block D - Co-Living Annex"];
    const utilities = ["Water", "Electricity"];
    const records = [];
    const now = Date.now();
    for (let d = 14; d >= 0; d--) {
      for (const block of blocks) {
        for (const util of utilities) {
          const isWater = util === "Water";
          const val = isWater ? Math.floor(250 + Math.random() * 550) : Math.floor(180 + Math.random() * 420);
          records.push({
            utilityType: util,
            value: val,
            unit: isWater ? "L" : "kWh",
            blockName: block,
            source: "Sensor",
            recordedAt: new Date(now - d * 24 * 3600 * 1000 + Math.floor(Math.random() * 3600 * 1000 * 12))
          });
        }
      }
    }
    // Add 2 critical/warning readings for alerts
    records.push({
      utilityType: "Water",
      value: 1150,
      unit: "L",
      blockName: "Block B - Horizon Hall",
      source: "Sensor",
      recordedAt: new Date(now - 1000 * 60 * 45)
    });
    records.push({
      utilityType: "Electricity",
      value: 980,
      unit: "kWh",
      blockName: "Block C - Lakeside Residence",
      source: "Sensor",
      recordedAt: new Date(now - 1000 * 60 * 20)
    });
    await MonitoringReading.insertMany(records);
    console.log(`Seeded ${records.length} telemetry monitoring readings!`);
  } else {
    console.log(`Readings already populated: ${count}`);
  }
  process.exit(0);
}

seedTelemetry().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
