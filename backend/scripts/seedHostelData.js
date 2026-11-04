const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Building = require("../models/Building");
const Room = require("../models/Room");
const Bed = require("../models/Bed");
const Allocation = require("../models/Allocation");
const Transfer = require("../models/Transfer");

const BLOCKS = [
  {
    prefix: "A",
    name: "Block A - Aurora Hall",
    code: "BLOCK-A",
    address: "North Campus Green",
    floors: 4,
    description: "Undergraduate Male Residence - Aurora Hall",
    isActive: true,
  },
  {
    prefix: "B",
    name: "Block B - Horizon Hall",
    code: "BLOCK-B",
    address: "Central Campus Walk",
    floors: 4,
    description: "Senior & International Male Residence - Horizon Hall",
    isActive: true,
  },
  {
    prefix: "C",
    name: "Block C - Lakeside Residence",
    code: "BLOCK-C",
    address: "East Lake Promontory",
    floors: 4,
    description: "Undergraduate Female Residence - Lakeside Residence",
    isActive: true,
  },
  {
    prefix: "D",
    name: "Block D - Co-Living Annex",
    code: "BLOCK-D",
    address: "West Campus Boulevard",
    floors: 4,
    description: "Postgraduate & Exchange Co-Living Annex",
    isActive: true,
  },
];

// Sample students to allocate
const KEY_STUDENT_ALLOCATIONS = [
  {
    regId: "STD-2026-090",
    name: "Ahamed Nafeesh",
    blockPrefix: "B",
    roomNumber: "B-204",
    bedNumber: "Bed 1",
  },
  {
    regId: "STD-2026-112",
    name: "M. I. M Izni",
    blockPrefix: "B",
    roomNumber: "B-204",
    bedNumber: "Bed 2",
  },
  {
    regId: "STD-2026-069",
    name: "A. Kanesalingam",
    blockPrefix: "A",
    roomNumber: "A-101",
    bedNumber: "Bed 1",
  },
  {
    regId: "STD-2026-102",
    name: "M. H. U Hafrath",
    blockPrefix: "A",
    roomNumber: "A-101",
    bedNumber: "Bed 2",
  },
  {
    regId: "STD-2026-045",
    name: "Kavindu Perera",
    blockPrefix: "A",
    roomNumber: "A-302",
    bedNumber: "Bed 1",
  },
  {
    regId: "STD-2026-074",
    name: "A. Dhusanthika",
    blockPrefix: "C",
    roomNumber: "C-101",
    bedNumber: "Bed 1",
  },
  {
    regId: "STD-2026-078",
    name: "Fathima Rizna",
    blockPrefix: "C",
    roomNumber: "C-302",
    bedNumber: "Bed 1",
  },
  {
    regId: "STD-2026-012",
    name: "Dishan Silva",
    blockPrefix: "D",
    roomNumber: "D-405",
    bedNumber: "Bed 1",
  },
];

// Standard Sri Lankan / International student names pool for background occupants
const RESIDENT_NAMES = [
  "Nuwan Pradeep", "Sachithra Senanayake", "Charith Asalanka", "Danushka Gunathilaka",
  "Chamika Karunaratne", "Kasun Rajitha", "Ashen Bandara", "Pathum Nissanka",
  "Maheesh Theekshana", "Matheesha Pathirana", "Dunith Wellalage", "Kamindu Mendis",
  "Sadeera Samarawickrama", "Binura Fernando", "Pramod Madushan", "Dushmantha Chameera",
  "Sanduni Dilrukshi", "Tharushi Karunaratne", "Gayanthika Abeyratne", "Nadeesha Ramanayake",
  "Dilhani Lekamge", "Nilani Rathnayake", "Hansani Piumila", "Chathurangani Silva",
  "Oshadi Ranasinghe", "Sugandika Kumari", "Inoka Ranaweera", "Udeshika Prabodhani",
  "Anushka Sanjeewani", "Hasini Perera", "Harshitha Samarawickrama", "Vishmi Gunaratne",
  "Mohamed Shifran", "Ahmed Ziyad", "Fathima Shabnam", "Ayesha Siddiqua",
  "Rohan De Silva", "Priyantha Jayasuriya", "Malinda Pushpakumara", "Jehan Mubarak",
  "Raveen De Silva", "Shiran Fernando", "Lahiru Samarakoon", "Janith Liyanage",
  "Tharindu Ratnayake", "Akila Dananjaya", "Avishka Fernando", "Dhananjaya Lakshan",
  "Minod Bhanuka", "Niroshan Dickwella", "Angelo Perera", "Seekkuge Prasanna",
  "Suranga Lakmal", "Nuwan Kulasekara", "Dhammika Prasad", "Chanaka Welegedara",
  "Farveez Maharoof", "Upul Tharanga", "Kaushal Silva", "Lahiru Thirimanne",
  "Kusal Janith", "Wanindu Hasaranga", "Dhananjaya De Silva", "Kusal Mendis"
];

async function seedHostel(disconnectAfter = true) {
  console.log("=== SmartStay Campus Hostel Fixed Data Seeder ===");
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is missing from backend/.env");
  }

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas successfully.");
  }

  // 1. Clean existing hostel collections only
  console.log("Cleaning existing hostel buildings, rooms, beds, allocations, transfers...");
  await Building.deleteMany({});
  await Room.deleteMany({});
  await Bed.deleteMany({});
  await Allocation.deleteMany({});
  await Transfer.deleteMany({});
  console.log("Cleared old hostel records.");

  // 2. Insert the 4 Campus Blocks
  console.log("Creating 4 Campus Hostel Blocks...");
  const createdBuildings = [];
  for (const block of BLOCKS) {
    const building = await Building.create({
      name: block.name,
      code: block.code,
      address: block.address,
      floors: block.floors,
      description: block.description,
      isActive: block.isActive,
    });
    createdBuildings.push({ ...block, doc: building });
    console.log(`  -> Created ${building.name} (${building.code}) with ${building.floors} floors.`);
  }

  // 3. Insert Rooms for Each Block & Floor
  console.log("\nGenerating standard rooms (6 rooms per floor, 4 floors = 24 rooms/block = 96 total)...");
  const createdRooms = [];
  const roomMap = new Map(); // key: "B-204" -> roomDoc

  for (const b of createdBuildings) {
    const buildingDoc = b.doc;
    for (let floor = 1; floor <= buildingDoc.floors; floor++) {
      for (let roomIdx = 1; roomIdx <= 6; roomIdx++) {
        // Room number format: A-101, A-102, ..., B-204, etc.
        const numSuffix = `${floor}0${roomIdx}`;
        const roomNumber = `${b.prefix}-${numSuffix}`;

        // Capacity: 101-104 are Triple Sharing (3 beds), 105-106 are Double Deluxe (2 beds)
        const capacity = roomIdx <= 4 ? 3 : 2;
        const roomType = roomIdx <= 4 ? "Shared" : "Deluxe";

        const room = await Room.create({
          buildingId: buildingDoc._id,
          roomNumber,
          floor,
          capacity,
          roomType,
          status: "Available",
          isActive: true,
        });

        createdRooms.push(room);
        roomMap.set(roomNumber, room);
      }
    }
  }
  console.log(`  -> Created ${createdRooms.length} rooms across all 4 blocks.`);

  // 4. Generate Beds for Each Room
  console.log("\nGenerating beds for each room...");
  const createdBeds = [];
  const bedMap = new Map(); // key: "B-204:Bed 1" -> bedDoc

  for (const room of createdRooms) {
    for (let bedIdx = 1; bedIdx <= room.capacity; bedIdx++) {
      const bedNumber = `Bed ${bedIdx}`;
      const bed = await Bed.create({
        roomId: room._id,
        bedNumber,
        status: "Available",
        isActive: true,
      });

      createdBeds.push(bed);
      bedMap.set(`${room.roomNumber}:${bedNumber}`, bed);
    }
  }
  console.log(`  -> Created ${createdBeds.length} beds across all rooms.`);

  // 5. Create Key Student Allocations
  console.log("\nSeeding student room allocations...");
  const createdAllocations = [];
  const occupiedBedIds = new Set();

  for (const item of KEY_STUDENT_ALLOCATIONS) {
    const room = roomMap.get(item.roomNumber);
    const bed = bedMap.get(`${item.roomNumber}:${item.bedNumber}`);

    if (room && bed) {
      const alloc = await Allocation.create({
        studentRegistrationId: item.regId,
        studentName: item.name,
        roomId: room._id,
        bedId: bed._id,
        allocationDate: new Date(2026, 1, 15),
        status: "Active",
        notes: "Official university semester hostel allocation",
      });

      createdAllocations.push(alloc);
      occupiedBedIds.add(String(bed._id));

      // Mark bed as occupied
      bed.status = "Occupied";
      await bed.save();
    }
  }

  // 6. Allocate background students to achieve realistic ~54% campus occupancy
  const RESERVED_EMPTY_BED_KEYS = new Set([
    "A-104:Bed 2", // Reserved for Kavindu Perera's pending transfer
  ]);

  let nameIndex = 0;
  for (const room of createdRooms) {
    const roomNum = parseInt(room.roomNumber.split("-")[1], 10);
    const targetOccupants = (roomNum % 6 === 5 || roomNum % 6 === 0) ? 1 : (room.capacity === 3 ? 2 : 1);

    for (let bedIdx = 1; bedIdx <= targetOccupants; bedIdx++) {
      const bedKey = `${room.roomNumber}:Bed ${bedIdx}`;
      const bed = bedMap.get(bedKey);

      if (bed && !occupiedBedIds.has(String(bed._id)) && !RESERVED_EMPTY_BED_KEYS.has(bedKey)) {
        const studentName = RESIDENT_NAMES[nameIndex % RESIDENT_NAMES.length];
        const studentRegId = `STD-2026-${String(200 + nameIndex).padStart(3, "0")}`;
        nameIndex++;

        const alloc = await Allocation.create({
          studentRegistrationId: studentRegId,
          studentName,
          roomId: room._id,
          bedId: bed._id,
          allocationDate: new Date(2026, 1, 20),
          status: "Active",
          notes: "Regular semester bed allocation",
        });

        createdAllocations.push(alloc);
        occupiedBedIds.add(String(bed._id));

        bed.status = "Occupied";
        await bed.save();
      }
    }

    // Update room status
    const roomBeds = createdBeds.filter((b) => String(b.roomId) === String(room._id));
    const allOccupied = roomBeds.every((b) => occupiedBedIds.has(String(b._id)));
    if (allOccupied) {
      room.status = "Occupied";
      await room.save();
    }
  }

  console.log(`  -> Successfully allocated ${createdAllocations.length} students across the hostels.`);
  console.log(`  -> Total Occupied Beds: ${occupiedBedIds.size} / ${createdBeds.length} (${((occupiedBedIds.size / createdBeds.length) * 100).toFixed(1)}% Occupancy Rate).`);

  // 7. Seed Sample Transfers
  console.log("\nSeeding room transfer requests...");
  const nafeeshAlloc = createdAllocations.find((a) => a.studentRegistrationId === "STD-2026-112");
  const kavinduAlloc = createdAllocations.find((a) => a.studentRegistrationId === "STD-2026-045");

  const roomB204 = roomMap.get("B-204");
  const roomB206 = roomMap.get("B-206");
  const bedB204_2 = bedMap.get("B-204:Bed 2");
  const bedB206_1 = bedMap.get("B-206:Bed 1");

  const roomA302 = roomMap.get("A-302");
  const roomA104 = roomMap.get("A-104");
  const bedA302_1 = bedMap.get("A-302:Bed 1");
  const bedA104_2 = bedMap.get("A-104:Bed 2");

  if (nafeeshAlloc && roomB204 && roomB206 && bedB204_2 && bedB206_1) {
    await Transfer.create({
      allocationId: nafeeshAlloc._id,
      studentRegistrationId: "STD-2026-112",
      fromRoomId: roomB204._id,
      fromBedId: bedB204_2._id,
      toRoomId: roomB206._id,
      toBedId: bedB206_1._id,
      reason: "Quiet study floor preference for final year semester project",
      status: "Approved",
      reviewedAt: new Date(2026, 8, 20),
    });
  }

  if (kavinduAlloc && roomA302 && roomA104 && bedA302_1 && bedA104_2) {
    await Transfer.create({
      allocationId: kavinduAlloc._id,
      studentRegistrationId: "STD-2026-045",
      fromRoomId: roomA302._id,
      fromBedId: bedA302_1._id,
      toRoomId: roomA104._id,
      toBedId: bedA104_2._id,
      reason: "Medical ground floor allocation request",
      status: "Pending",
    });
  }
  console.log("  -> Transfer requests seeded.");

  console.log("\n==========================================");
  console.log("  HOSTEL SEEDING COMPLETED SUCCESSFULLY!  ");
  console.log("==========================================");
  console.log(`- Total Blocks / Buildings: ${createdBuildings.length}`);
  console.log(`- Total Floors: ${createdBuildings.length * 4}`);
  console.log(`- Total Rooms: ${createdRooms.length}`);
  console.log(`- Total Beds: ${createdBeds.length}`);
  console.log(`- Occupied Beds: ${occupiedBedIds.size}`);
  console.log(`- Available Beds: ${createdBeds.length - occupiedBedIds.size}`);
  console.log("==========================================\n");

  if (disconnectAfter) {
    await mongoose.disconnect();
  }
}

async function ensureHostelDataSeeded() {
  const count = await Building.countDocuments();
  const roomCount = await Room.countDocuments();
  if (count < 4 || roomCount < 96) {
    console.log("Hostel data missing or incomplete, automatically seeding 4 blocks and 96 rooms...");
    await seedHostel(false);
  }
}

if (require.main === module) {
  seedHostel(true).catch((err) => {
    console.error("Hostel seeding failed:", err);
    process.exit(1);
  });
}

module.exports = { seedHostel, ensureHostelDataSeeded };
