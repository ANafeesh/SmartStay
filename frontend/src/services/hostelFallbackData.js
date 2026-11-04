/**
 * University Hostel Fallback Data (SmartStay Campus Residence)
 * Provides realistic campus hostel data with fixed 4 Blocks, 4 Floors, and 96 Rooms.
 */

export const SAMPLE_BUILDINGS = [
  {
    "_id": "bld-001",
    "id": "bld-001",
    "name": "Block A - Aurora Hall",
    "code": "BLOCK-A",
    "gender": "male",
    "floors": 4,
    "totalRooms": 24,
    "totalBeds": 64,
    "occupiedBeds": 36,
    "availableBeds": 28,
    "wardenName": "Dr. K. Perera",
    "status": "active",
    "isActive": true
  },
  {
    "_id": "bld-002",
    "id": "bld-002",
    "name": "Block B - Horizon Hall",
    "code": "BLOCK-B",
    "gender": "male",
    "floors": 4,
    "totalRooms": 24,
    "totalBeds": 64,
    "occupiedBeds": 36,
    "availableBeds": 28,
    "wardenName": "Dr. K. Perera",
    "status": "active",
    "isActive": true
  },
  {
    "_id": "bld-003",
    "id": "bld-003",
    "name": "Block C - Lakeside Residence",
    "code": "BLOCK-C",
    "gender": "female",
    "floors": 4,
    "totalRooms": 24,
    "totalBeds": 64,
    "occupiedBeds": 34,
    "availableBeds": 30,
    "wardenName": "Mrs. N. Jayawardena",
    "status": "active",
    "isActive": true
  },
  {
    "_id": "bld-004",
    "id": "bld-004",
    "name": "Block D - Co-Living Annex",
    "code": "BLOCK-D",
    "gender": "mixed",
    "floors": 4,
    "totalRooms": 24,
    "totalBeds": 64,
    "occupiedBeds": 32,
    "availableBeds": 32,
    "wardenName": "Dr. K. Perera",
    "status": "active",
    "isActive": true
  }
];

export const SAMPLE_ROOMS = [
  {
    "_id": "rm-001",
    "id": "rm-001",
    "roomNumber": "A-101",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-001",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-002",
    "id": "rm-002",
    "roomNumber": "A-102",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-001",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-003",
    "id": "rm-003",
    "roomNumber": "A-103",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-001",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-004",
    "id": "rm-004",
    "roomNumber": "A-104",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-001",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-005",
    "id": "rm-005",
    "roomNumber": "A-105",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-001",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-006",
    "id": "rm-006",
    "roomNumber": "A-106",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-001",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-007",
    "id": "rm-007",
    "roomNumber": "A-201",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-001",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-008",
    "id": "rm-008",
    "roomNumber": "A-202",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-001",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-009",
    "id": "rm-009",
    "roomNumber": "A-203",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-001",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-010",
    "id": "rm-010",
    "roomNumber": "A-204",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-001",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-011",
    "id": "rm-011",
    "roomNumber": "A-205",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-001",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-012",
    "id": "rm-012",
    "roomNumber": "A-206",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-001",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-013",
    "id": "rm-013",
    "roomNumber": "A-301",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-001",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-014",
    "id": "rm-014",
    "roomNumber": "A-302",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-001",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-015",
    "id": "rm-015",
    "roomNumber": "A-303",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-001",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-016",
    "id": "rm-016",
    "roomNumber": "A-304",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-001",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-017",
    "id": "rm-017",
    "roomNumber": "A-305",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-001",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-018",
    "id": "rm-018",
    "roomNumber": "A-306",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-001",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-019",
    "id": "rm-019",
    "roomNumber": "A-401",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-001",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-020",
    "id": "rm-020",
    "roomNumber": "A-402",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-001",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-021",
    "id": "rm-021",
    "roomNumber": "A-403",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-001",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-022",
    "id": "rm-022",
    "roomNumber": "A-404",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-001",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-023",
    "id": "rm-023",
    "roomNumber": "A-405",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-001",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-024",
    "id": "rm-024",
    "roomNumber": "A-406",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-001",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-025",
    "id": "rm-025",
    "roomNumber": "B-101",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-002",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-026",
    "id": "rm-026",
    "roomNumber": "B-102",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-002",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-027",
    "id": "rm-027",
    "roomNumber": "B-103",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-002",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-028",
    "id": "rm-028",
    "roomNumber": "B-104",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-002",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-029",
    "id": "rm-029",
    "roomNumber": "B-105",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-002",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-030",
    "id": "rm-030",
    "roomNumber": "B-106",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-002",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-031",
    "id": "rm-031",
    "roomNumber": "B-201",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-002",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-032",
    "id": "rm-032",
    "roomNumber": "B-202",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-002",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-033",
    "id": "rm-033",
    "roomNumber": "B-203",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-002",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-034",
    "id": "rm-034",
    "roomNumber": "B-204",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-002",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-035",
    "id": "rm-035",
    "roomNumber": "B-205",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-002",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-036",
    "id": "rm-036",
    "roomNumber": "B-206",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-002",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-037",
    "id": "rm-037",
    "roomNumber": "B-301",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-002",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-038",
    "id": "rm-038",
    "roomNumber": "B-302",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-002",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-039",
    "id": "rm-039",
    "roomNumber": "B-303",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-002",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-040",
    "id": "rm-040",
    "roomNumber": "B-304",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-002",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-041",
    "id": "rm-041",
    "roomNumber": "B-305",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-002",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-042",
    "id": "rm-042",
    "roomNumber": "B-306",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-002",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-043",
    "id": "rm-043",
    "roomNumber": "B-401",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-002",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-044",
    "id": "rm-044",
    "roomNumber": "B-402",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-002",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-045",
    "id": "rm-045",
    "roomNumber": "B-403",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-002",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-046",
    "id": "rm-046",
    "roomNumber": "B-404",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-002",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-047",
    "id": "rm-047",
    "roomNumber": "B-405",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-002",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-048",
    "id": "rm-048",
    "roomNumber": "B-406",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-002",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-049",
    "id": "rm-049",
    "roomNumber": "C-101",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-003",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-050",
    "id": "rm-050",
    "roomNumber": "C-102",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-003",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-051",
    "id": "rm-051",
    "roomNumber": "C-103",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-003",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-052",
    "id": "rm-052",
    "roomNumber": "C-104",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-003",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-053",
    "id": "rm-053",
    "roomNumber": "C-105",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-003",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-054",
    "id": "rm-054",
    "roomNumber": "C-106",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-003",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-055",
    "id": "rm-055",
    "roomNumber": "C-201",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-003",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-056",
    "id": "rm-056",
    "roomNumber": "C-202",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-003",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-057",
    "id": "rm-057",
    "roomNumber": "C-203",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-003",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-058",
    "id": "rm-058",
    "roomNumber": "C-204",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-003",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-059",
    "id": "rm-059",
    "roomNumber": "C-205",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-003",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-060",
    "id": "rm-060",
    "roomNumber": "C-206",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-003",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-061",
    "id": "rm-061",
    "roomNumber": "C-301",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-003",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-062",
    "id": "rm-062",
    "roomNumber": "C-302",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-003",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-063",
    "id": "rm-063",
    "roomNumber": "C-303",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-003",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-064",
    "id": "rm-064",
    "roomNumber": "C-304",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-003",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-065",
    "id": "rm-065",
    "roomNumber": "C-305",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-003",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-066",
    "id": "rm-066",
    "roomNumber": "C-306",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-003",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-067",
    "id": "rm-067",
    "roomNumber": "C-401",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-003",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-068",
    "id": "rm-068",
    "roomNumber": "C-402",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-003",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-069",
    "id": "rm-069",
    "roomNumber": "C-403",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-003",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-070",
    "id": "rm-070",
    "roomNumber": "C-404",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-003",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-071",
    "id": "rm-071",
    "roomNumber": "C-405",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-003",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-072",
    "id": "rm-072",
    "roomNumber": "C-406",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-003",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-073",
    "id": "rm-073",
    "roomNumber": "D-101",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-004",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-074",
    "id": "rm-074",
    "roomNumber": "D-102",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-004",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-075",
    "id": "rm-075",
    "roomNumber": "D-103",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-004",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-076",
    "id": "rm-076",
    "roomNumber": "D-104",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-004",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-077",
    "id": "rm-077",
    "roomNumber": "D-105",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-004",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-078",
    "id": "rm-078",
    "roomNumber": "D-106",
    "floorNumber": 1,
    "floor": 1,
    "buildingId": "bld-004",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-079",
    "id": "rm-079",
    "roomNumber": "D-201",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-004",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-080",
    "id": "rm-080",
    "roomNumber": "D-202",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-004",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-081",
    "id": "rm-081",
    "roomNumber": "D-203",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-004",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-082",
    "id": "rm-082",
    "roomNumber": "D-204",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-004",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-083",
    "id": "rm-083",
    "roomNumber": "D-205",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-004",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-084",
    "id": "rm-084",
    "roomNumber": "D-206",
    "floorNumber": 2,
    "floor": 2,
    "buildingId": "bld-004",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-085",
    "id": "rm-085",
    "roomNumber": "D-301",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-004",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-086",
    "id": "rm-086",
    "roomNumber": "D-302",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-004",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-087",
    "id": "rm-087",
    "roomNumber": "D-303",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-004",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-088",
    "id": "rm-088",
    "roomNumber": "D-304",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-004",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-089",
    "id": "rm-089",
    "roomNumber": "D-305",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-004",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-090",
    "id": "rm-090",
    "roomNumber": "D-306",
    "floorNumber": 3,
    "floor": 3,
    "buildingId": "bld-004",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-091",
    "id": "rm-091",
    "roomNumber": "D-401",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-004",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-092",
    "id": "rm-092",
    "roomNumber": "D-402",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-004",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-093",
    "id": "rm-093",
    "roomNumber": "D-403",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-004",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-094",
    "id": "rm-094",
    "roomNumber": "D-404",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-004",
    "capacity": 3,
    "status": "available",
    "roomType": "Triple Sharing"
  },
  {
    "_id": "rm-095",
    "id": "rm-095",
    "roomNumber": "D-405",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-004",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  },
  {
    "_id": "rm-096",
    "id": "rm-096",
    "roomNumber": "D-406",
    "floorNumber": 4,
    "floor": 4,
    "buildingId": "bld-004",
    "capacity": 2,
    "status": "available",
    "roomType": "Double Deluxe"
  }
];

export const SAMPLE_BEDS = [
  {
    "_id": "bed-0001",
    "id": "bed-0001",
    "bedNumber": "Bed 1",
    "roomId": "rm-001",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "A. Kanesalingam"
  },
  {
    "_id": "bed-0002",
    "id": "bed-0002",
    "bedNumber": "Bed 2",
    "roomId": "rm-001",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "M. H. U Hafrath"
  },
  {
    "_id": "bed-0003",
    "id": "bed-0003",
    "bedNumber": "Bed 3",
    "roomId": "rm-001",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0004",
    "id": "bed-0004",
    "bedNumber": "Bed 1",
    "roomId": "rm-002",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0005",
    "id": "bed-0005",
    "bedNumber": "Bed 2",
    "roomId": "rm-002",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0006",
    "id": "bed-0006",
    "bedNumber": "Bed 3",
    "roomId": "rm-002",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0007",
    "id": "bed-0007",
    "bedNumber": "Bed 1",
    "roomId": "rm-003",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 3"
  },
  {
    "_id": "bed-0008",
    "id": "bed-0008",
    "bedNumber": "Bed 2",
    "roomId": "rm-003",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0009",
    "id": "bed-0009",
    "bedNumber": "Bed 3",
    "roomId": "rm-003",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0010",
    "id": "bed-0010",
    "bedNumber": "Bed 1",
    "roomId": "rm-004",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0011",
    "id": "bed-0011",
    "bedNumber": "Bed 2",
    "roomId": "rm-004",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0012",
    "id": "bed-0012",
    "bedNumber": "Bed 3",
    "roomId": "rm-004",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0013",
    "id": "bed-0013",
    "bedNumber": "Bed 1",
    "roomId": "rm-005",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Kavindu Perera"
  },
  {
    "_id": "bed-0014",
    "id": "bed-0014",
    "bedNumber": "Bed 2",
    "roomId": "rm-005",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0015",
    "id": "bed-0015",
    "bedNumber": "Bed 1",
    "roomId": "rm-006",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0016",
    "id": "bed-0016",
    "bedNumber": "Bed 2",
    "roomId": "rm-006",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0017",
    "id": "bed-0017",
    "bedNumber": "Bed 1",
    "roomId": "rm-007",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 5"
  },
  {
    "_id": "bed-0018",
    "id": "bed-0018",
    "bedNumber": "Bed 2",
    "roomId": "rm-007",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0019",
    "id": "bed-0019",
    "bedNumber": "Bed 3",
    "roomId": "rm-007",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0020",
    "id": "bed-0020",
    "bedNumber": "Bed 1",
    "roomId": "rm-008",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0021",
    "id": "bed-0021",
    "bedNumber": "Bed 2",
    "roomId": "rm-008",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0022",
    "id": "bed-0022",
    "bedNumber": "Bed 3",
    "roomId": "rm-008",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0023",
    "id": "bed-0023",
    "bedNumber": "Bed 1",
    "roomId": "rm-009",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 6"
  },
  {
    "_id": "bed-0024",
    "id": "bed-0024",
    "bedNumber": "Bed 2",
    "roomId": "rm-009",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0025",
    "id": "bed-0025",
    "bedNumber": "Bed 3",
    "roomId": "rm-009",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0026",
    "id": "bed-0026",
    "bedNumber": "Bed 1",
    "roomId": "rm-010",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0027",
    "id": "bed-0027",
    "bedNumber": "Bed 2",
    "roomId": "rm-010",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0028",
    "id": "bed-0028",
    "bedNumber": "Bed 3",
    "roomId": "rm-010",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0029",
    "id": "bed-0029",
    "bedNumber": "Bed 1",
    "roomId": "rm-011",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 7"
  },
  {
    "_id": "bed-0030",
    "id": "bed-0030",
    "bedNumber": "Bed 2",
    "roomId": "rm-011",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0031",
    "id": "bed-0031",
    "bedNumber": "Bed 1",
    "roomId": "rm-012",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0032",
    "id": "bed-0032",
    "bedNumber": "Bed 2",
    "roomId": "rm-012",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0033",
    "id": "bed-0033",
    "bedNumber": "Bed 1",
    "roomId": "rm-013",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 8"
  },
  {
    "_id": "bed-0034",
    "id": "bed-0034",
    "bedNumber": "Bed 2",
    "roomId": "rm-013",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0035",
    "id": "bed-0035",
    "bedNumber": "Bed 3",
    "roomId": "rm-013",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0036",
    "id": "bed-0036",
    "bedNumber": "Bed 1",
    "roomId": "rm-014",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0037",
    "id": "bed-0037",
    "bedNumber": "Bed 2",
    "roomId": "rm-014",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0038",
    "id": "bed-0038",
    "bedNumber": "Bed 3",
    "roomId": "rm-014",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0039",
    "id": "bed-0039",
    "bedNumber": "Bed 1",
    "roomId": "rm-015",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 9"
  },
  {
    "_id": "bed-0040",
    "id": "bed-0040",
    "bedNumber": "Bed 2",
    "roomId": "rm-015",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0041",
    "id": "bed-0041",
    "bedNumber": "Bed 3",
    "roomId": "rm-015",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0042",
    "id": "bed-0042",
    "bedNumber": "Bed 1",
    "roomId": "rm-016",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0043",
    "id": "bed-0043",
    "bedNumber": "Bed 2",
    "roomId": "rm-016",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0044",
    "id": "bed-0044",
    "bedNumber": "Bed 3",
    "roomId": "rm-016",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0045",
    "id": "bed-0045",
    "bedNumber": "Bed 1",
    "roomId": "rm-017",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 10"
  },
  {
    "_id": "bed-0046",
    "id": "bed-0046",
    "bedNumber": "Bed 2",
    "roomId": "rm-017",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0047",
    "id": "bed-0047",
    "bedNumber": "Bed 1",
    "roomId": "rm-018",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0048",
    "id": "bed-0048",
    "bedNumber": "Bed 2",
    "roomId": "rm-018",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0049",
    "id": "bed-0049",
    "bedNumber": "Bed 1",
    "roomId": "rm-019",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 11"
  },
  {
    "_id": "bed-0050",
    "id": "bed-0050",
    "bedNumber": "Bed 2",
    "roomId": "rm-019",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0051",
    "id": "bed-0051",
    "bedNumber": "Bed 3",
    "roomId": "rm-019",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0052",
    "id": "bed-0052",
    "bedNumber": "Bed 1",
    "roomId": "rm-020",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0053",
    "id": "bed-0053",
    "bedNumber": "Bed 2",
    "roomId": "rm-020",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0054",
    "id": "bed-0054",
    "bedNumber": "Bed 3",
    "roomId": "rm-020",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0055",
    "id": "bed-0055",
    "bedNumber": "Bed 1",
    "roomId": "rm-021",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 12"
  },
  {
    "_id": "bed-0056",
    "id": "bed-0056",
    "bedNumber": "Bed 2",
    "roomId": "rm-021",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0057",
    "id": "bed-0057",
    "bedNumber": "Bed 3",
    "roomId": "rm-021",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0058",
    "id": "bed-0058",
    "bedNumber": "Bed 1",
    "roomId": "rm-022",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0059",
    "id": "bed-0059",
    "bedNumber": "Bed 2",
    "roomId": "rm-022",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0060",
    "id": "bed-0060",
    "bedNumber": "Bed 3",
    "roomId": "rm-022",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0061",
    "id": "bed-0061",
    "bedNumber": "Bed 1",
    "roomId": "rm-023",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 13"
  },
  {
    "_id": "bed-0062",
    "id": "bed-0062",
    "bedNumber": "Bed 2",
    "roomId": "rm-023",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0063",
    "id": "bed-0063",
    "bedNumber": "Bed 1",
    "roomId": "rm-024",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0064",
    "id": "bed-0064",
    "bedNumber": "Bed 2",
    "roomId": "rm-024",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0065",
    "id": "bed-0065",
    "bedNumber": "Bed 1",
    "roomId": "rm-025",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 14"
  },
  {
    "_id": "bed-0066",
    "id": "bed-0066",
    "bedNumber": "Bed 2",
    "roomId": "rm-025",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0067",
    "id": "bed-0067",
    "bedNumber": "Bed 3",
    "roomId": "rm-025",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0068",
    "id": "bed-0068",
    "bedNumber": "Bed 1",
    "roomId": "rm-026",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0069",
    "id": "bed-0069",
    "bedNumber": "Bed 2",
    "roomId": "rm-026",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0070",
    "id": "bed-0070",
    "bedNumber": "Bed 3",
    "roomId": "rm-026",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0071",
    "id": "bed-0071",
    "bedNumber": "Bed 1",
    "roomId": "rm-027",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 15"
  },
  {
    "_id": "bed-0072",
    "id": "bed-0072",
    "bedNumber": "Bed 2",
    "roomId": "rm-027",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0073",
    "id": "bed-0073",
    "bedNumber": "Bed 3",
    "roomId": "rm-027",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0074",
    "id": "bed-0074",
    "bedNumber": "Bed 1",
    "roomId": "rm-028",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0075",
    "id": "bed-0075",
    "bedNumber": "Bed 2",
    "roomId": "rm-028",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0076",
    "id": "bed-0076",
    "bedNumber": "Bed 3",
    "roomId": "rm-028",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0077",
    "id": "bed-0077",
    "bedNumber": "Bed 1",
    "roomId": "rm-029",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 16"
  },
  {
    "_id": "bed-0078",
    "id": "bed-0078",
    "bedNumber": "Bed 2",
    "roomId": "rm-029",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0079",
    "id": "bed-0079",
    "bedNumber": "Bed 1",
    "roomId": "rm-030",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0080",
    "id": "bed-0080",
    "bedNumber": "Bed 2",
    "roomId": "rm-030",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0081",
    "id": "bed-0081",
    "bedNumber": "Bed 1",
    "roomId": "rm-031",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 17"
  },
  {
    "_id": "bed-0082",
    "id": "bed-0082",
    "bedNumber": "Bed 2",
    "roomId": "rm-031",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0083",
    "id": "bed-0083",
    "bedNumber": "Bed 3",
    "roomId": "rm-031",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0084",
    "id": "bed-0084",
    "bedNumber": "Bed 1",
    "roomId": "rm-032",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0085",
    "id": "bed-0085",
    "bedNumber": "Bed 2",
    "roomId": "rm-032",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0086",
    "id": "bed-0086",
    "bedNumber": "Bed 3",
    "roomId": "rm-032",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0087",
    "id": "bed-0087",
    "bedNumber": "Bed 1",
    "roomId": "rm-033",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 18"
  },
  {
    "_id": "bed-0088",
    "id": "bed-0088",
    "bedNumber": "Bed 2",
    "roomId": "rm-033",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0089",
    "id": "bed-0089",
    "bedNumber": "Bed 3",
    "roomId": "rm-033",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0090",
    "id": "bed-0090",
    "bedNumber": "Bed 1",
    "roomId": "rm-034",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Ahamed Nafeesh"
  },
  {
    "_id": "bed-0091",
    "id": "bed-0091",
    "bedNumber": "Bed 2",
    "roomId": "rm-034",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "M. I. M Izni"
  },
  {
    "_id": "bed-0092",
    "id": "bed-0092",
    "bedNumber": "Bed 3",
    "roomId": "rm-034",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0093",
    "id": "bed-0093",
    "bedNumber": "Bed 1",
    "roomId": "rm-035",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 21"
  },
  {
    "_id": "bed-0094",
    "id": "bed-0094",
    "bedNumber": "Bed 2",
    "roomId": "rm-035",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0095",
    "id": "bed-0095",
    "bedNumber": "Bed 1",
    "roomId": "rm-036",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0096",
    "id": "bed-0096",
    "bedNumber": "Bed 2",
    "roomId": "rm-036",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0097",
    "id": "bed-0097",
    "bedNumber": "Bed 1",
    "roomId": "rm-037",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 22"
  },
  {
    "_id": "bed-0098",
    "id": "bed-0098",
    "bedNumber": "Bed 2",
    "roomId": "rm-037",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0099",
    "id": "bed-0099",
    "bedNumber": "Bed 3",
    "roomId": "rm-037",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0100",
    "id": "bed-0100",
    "bedNumber": "Bed 1",
    "roomId": "rm-038",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0101",
    "id": "bed-0101",
    "bedNumber": "Bed 2",
    "roomId": "rm-038",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0102",
    "id": "bed-0102",
    "bedNumber": "Bed 3",
    "roomId": "rm-038",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0103",
    "id": "bed-0103",
    "bedNumber": "Bed 1",
    "roomId": "rm-039",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 23"
  },
  {
    "_id": "bed-0104",
    "id": "bed-0104",
    "bedNumber": "Bed 2",
    "roomId": "rm-039",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0105",
    "id": "bed-0105",
    "bedNumber": "Bed 3",
    "roomId": "rm-039",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0106",
    "id": "bed-0106",
    "bedNumber": "Bed 1",
    "roomId": "rm-040",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0107",
    "id": "bed-0107",
    "bedNumber": "Bed 2",
    "roomId": "rm-040",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0108",
    "id": "bed-0108",
    "bedNumber": "Bed 3",
    "roomId": "rm-040",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0109",
    "id": "bed-0109",
    "bedNumber": "Bed 1",
    "roomId": "rm-041",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 24"
  },
  {
    "_id": "bed-0110",
    "id": "bed-0110",
    "bedNumber": "Bed 2",
    "roomId": "rm-041",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0111",
    "id": "bed-0111",
    "bedNumber": "Bed 1",
    "roomId": "rm-042",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0112",
    "id": "bed-0112",
    "bedNumber": "Bed 2",
    "roomId": "rm-042",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0113",
    "id": "bed-0113",
    "bedNumber": "Bed 1",
    "roomId": "rm-043",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 25"
  },
  {
    "_id": "bed-0114",
    "id": "bed-0114",
    "bedNumber": "Bed 2",
    "roomId": "rm-043",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0115",
    "id": "bed-0115",
    "bedNumber": "Bed 3",
    "roomId": "rm-043",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0116",
    "id": "bed-0116",
    "bedNumber": "Bed 1",
    "roomId": "rm-044",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0117",
    "id": "bed-0117",
    "bedNumber": "Bed 2",
    "roomId": "rm-044",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0118",
    "id": "bed-0118",
    "bedNumber": "Bed 3",
    "roomId": "rm-044",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0119",
    "id": "bed-0119",
    "bedNumber": "Bed 1",
    "roomId": "rm-045",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 26"
  },
  {
    "_id": "bed-0120",
    "id": "bed-0120",
    "bedNumber": "Bed 2",
    "roomId": "rm-045",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0121",
    "id": "bed-0121",
    "bedNumber": "Bed 3",
    "roomId": "rm-045",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0122",
    "id": "bed-0122",
    "bedNumber": "Bed 1",
    "roomId": "rm-046",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0123",
    "id": "bed-0123",
    "bedNumber": "Bed 2",
    "roomId": "rm-046",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0124",
    "id": "bed-0124",
    "bedNumber": "Bed 3",
    "roomId": "rm-046",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0125",
    "id": "bed-0125",
    "bedNumber": "Bed 1",
    "roomId": "rm-047",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 27"
  },
  {
    "_id": "bed-0126",
    "id": "bed-0126",
    "bedNumber": "Bed 2",
    "roomId": "rm-047",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0127",
    "id": "bed-0127",
    "bedNumber": "Bed 1",
    "roomId": "rm-048",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0128",
    "id": "bed-0128",
    "bedNumber": "Bed 2",
    "roomId": "rm-048",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0129",
    "id": "bed-0129",
    "bedNumber": "Bed 1",
    "roomId": "rm-049",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "A. Dhusanthika"
  },
  {
    "_id": "bed-0130",
    "id": "bed-0130",
    "bedNumber": "Bed 2",
    "roomId": "rm-049",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0131",
    "id": "bed-0131",
    "bedNumber": "Bed 3",
    "roomId": "rm-049",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0132",
    "id": "bed-0132",
    "bedNumber": "Bed 1",
    "roomId": "rm-050",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0133",
    "id": "bed-0133",
    "bedNumber": "Bed 2",
    "roomId": "rm-050",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0134",
    "id": "bed-0134",
    "bedNumber": "Bed 3",
    "roomId": "rm-050",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0135",
    "id": "bed-0135",
    "bedNumber": "Bed 1",
    "roomId": "rm-051",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 29"
  },
  {
    "_id": "bed-0136",
    "id": "bed-0136",
    "bedNumber": "Bed 2",
    "roomId": "rm-051",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0137",
    "id": "bed-0137",
    "bedNumber": "Bed 3",
    "roomId": "rm-051",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0138",
    "id": "bed-0138",
    "bedNumber": "Bed 1",
    "roomId": "rm-052",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0139",
    "id": "bed-0139",
    "bedNumber": "Bed 2",
    "roomId": "rm-052",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0140",
    "id": "bed-0140",
    "bedNumber": "Bed 3",
    "roomId": "rm-052",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0141",
    "id": "bed-0141",
    "bedNumber": "Bed 1",
    "roomId": "rm-053",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 30"
  },
  {
    "_id": "bed-0142",
    "id": "bed-0142",
    "bedNumber": "Bed 2",
    "roomId": "rm-053",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0143",
    "id": "bed-0143",
    "bedNumber": "Bed 1",
    "roomId": "rm-054",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0144",
    "id": "bed-0144",
    "bedNumber": "Bed 2",
    "roomId": "rm-054",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0145",
    "id": "bed-0145",
    "bedNumber": "Bed 1",
    "roomId": "rm-055",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 31"
  },
  {
    "_id": "bed-0146",
    "id": "bed-0146",
    "bedNumber": "Bed 2",
    "roomId": "rm-055",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0147",
    "id": "bed-0147",
    "bedNumber": "Bed 3",
    "roomId": "rm-055",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0148",
    "id": "bed-0148",
    "bedNumber": "Bed 1",
    "roomId": "rm-056",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0149",
    "id": "bed-0149",
    "bedNumber": "Bed 2",
    "roomId": "rm-056",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0150",
    "id": "bed-0150",
    "bedNumber": "Bed 3",
    "roomId": "rm-056",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0151",
    "id": "bed-0151",
    "bedNumber": "Bed 1",
    "roomId": "rm-057",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 32"
  },
  {
    "_id": "bed-0152",
    "id": "bed-0152",
    "bedNumber": "Bed 2",
    "roomId": "rm-057",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0153",
    "id": "bed-0153",
    "bedNumber": "Bed 3",
    "roomId": "rm-057",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0154",
    "id": "bed-0154",
    "bedNumber": "Bed 1",
    "roomId": "rm-058",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0155",
    "id": "bed-0155",
    "bedNumber": "Bed 2",
    "roomId": "rm-058",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0156",
    "id": "bed-0156",
    "bedNumber": "Bed 3",
    "roomId": "rm-058",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0157",
    "id": "bed-0157",
    "bedNumber": "Bed 1",
    "roomId": "rm-059",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 33"
  },
  {
    "_id": "bed-0158",
    "id": "bed-0158",
    "bedNumber": "Bed 2",
    "roomId": "rm-059",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0159",
    "id": "bed-0159",
    "bedNumber": "Bed 1",
    "roomId": "rm-060",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0160",
    "id": "bed-0160",
    "bedNumber": "Bed 2",
    "roomId": "rm-060",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0161",
    "id": "bed-0161",
    "bedNumber": "Bed 1",
    "roomId": "rm-061",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 34"
  },
  {
    "_id": "bed-0162",
    "id": "bed-0162",
    "bedNumber": "Bed 2",
    "roomId": "rm-061",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0163",
    "id": "bed-0163",
    "bedNumber": "Bed 3",
    "roomId": "rm-061",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0164",
    "id": "bed-0164",
    "bedNumber": "Bed 1",
    "roomId": "rm-062",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Fathima Rizna"
  },
  {
    "_id": "bed-0165",
    "id": "bed-0165",
    "bedNumber": "Bed 2",
    "roomId": "rm-062",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0166",
    "id": "bed-0166",
    "bedNumber": "Bed 3",
    "roomId": "rm-062",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0167",
    "id": "bed-0167",
    "bedNumber": "Bed 1",
    "roomId": "rm-063",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 36"
  },
  {
    "_id": "bed-0168",
    "id": "bed-0168",
    "bedNumber": "Bed 2",
    "roomId": "rm-063",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0169",
    "id": "bed-0169",
    "bedNumber": "Bed 3",
    "roomId": "rm-063",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0170",
    "id": "bed-0170",
    "bedNumber": "Bed 1",
    "roomId": "rm-064",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0171",
    "id": "bed-0171",
    "bedNumber": "Bed 2",
    "roomId": "rm-064",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0172",
    "id": "bed-0172",
    "bedNumber": "Bed 3",
    "roomId": "rm-064",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0173",
    "id": "bed-0173",
    "bedNumber": "Bed 1",
    "roomId": "rm-065",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 37"
  },
  {
    "_id": "bed-0174",
    "id": "bed-0174",
    "bedNumber": "Bed 2",
    "roomId": "rm-065",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0175",
    "id": "bed-0175",
    "bedNumber": "Bed 1",
    "roomId": "rm-066",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0176",
    "id": "bed-0176",
    "bedNumber": "Bed 2",
    "roomId": "rm-066",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0177",
    "id": "bed-0177",
    "bedNumber": "Bed 1",
    "roomId": "rm-067",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 38"
  },
  {
    "_id": "bed-0178",
    "id": "bed-0178",
    "bedNumber": "Bed 2",
    "roomId": "rm-067",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0179",
    "id": "bed-0179",
    "bedNumber": "Bed 3",
    "roomId": "rm-067",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0180",
    "id": "bed-0180",
    "bedNumber": "Bed 1",
    "roomId": "rm-068",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0181",
    "id": "bed-0181",
    "bedNumber": "Bed 2",
    "roomId": "rm-068",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0182",
    "id": "bed-0182",
    "bedNumber": "Bed 3",
    "roomId": "rm-068",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0183",
    "id": "bed-0183",
    "bedNumber": "Bed 1",
    "roomId": "rm-069",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 39"
  },
  {
    "_id": "bed-0184",
    "id": "bed-0184",
    "bedNumber": "Bed 2",
    "roomId": "rm-069",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0185",
    "id": "bed-0185",
    "bedNumber": "Bed 3",
    "roomId": "rm-069",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0186",
    "id": "bed-0186",
    "bedNumber": "Bed 1",
    "roomId": "rm-070",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0187",
    "id": "bed-0187",
    "bedNumber": "Bed 2",
    "roomId": "rm-070",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0188",
    "id": "bed-0188",
    "bedNumber": "Bed 3",
    "roomId": "rm-070",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0189",
    "id": "bed-0189",
    "bedNumber": "Bed 1",
    "roomId": "rm-071",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 40"
  },
  {
    "_id": "bed-0190",
    "id": "bed-0190",
    "bedNumber": "Bed 2",
    "roomId": "rm-071",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0191",
    "id": "bed-0191",
    "bedNumber": "Bed 1",
    "roomId": "rm-072",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0192",
    "id": "bed-0192",
    "bedNumber": "Bed 2",
    "roomId": "rm-072",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0193",
    "id": "bed-0193",
    "bedNumber": "Bed 1",
    "roomId": "rm-073",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 41"
  },
  {
    "_id": "bed-0194",
    "id": "bed-0194",
    "bedNumber": "Bed 2",
    "roomId": "rm-073",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0195",
    "id": "bed-0195",
    "bedNumber": "Bed 3",
    "roomId": "rm-073",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0196",
    "id": "bed-0196",
    "bedNumber": "Bed 1",
    "roomId": "rm-074",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0197",
    "id": "bed-0197",
    "bedNumber": "Bed 2",
    "roomId": "rm-074",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0198",
    "id": "bed-0198",
    "bedNumber": "Bed 3",
    "roomId": "rm-074",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0199",
    "id": "bed-0199",
    "bedNumber": "Bed 1",
    "roomId": "rm-075",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 42"
  },
  {
    "_id": "bed-0200",
    "id": "bed-0200",
    "bedNumber": "Bed 2",
    "roomId": "rm-075",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0201",
    "id": "bed-0201",
    "bedNumber": "Bed 3",
    "roomId": "rm-075",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0202",
    "id": "bed-0202",
    "bedNumber": "Bed 1",
    "roomId": "rm-076",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0203",
    "id": "bed-0203",
    "bedNumber": "Bed 2",
    "roomId": "rm-076",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0204",
    "id": "bed-0204",
    "bedNumber": "Bed 3",
    "roomId": "rm-076",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0205",
    "id": "bed-0205",
    "bedNumber": "Bed 1",
    "roomId": "rm-077",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 43"
  },
  {
    "_id": "bed-0206",
    "id": "bed-0206",
    "bedNumber": "Bed 2",
    "roomId": "rm-077",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0207",
    "id": "bed-0207",
    "bedNumber": "Bed 1",
    "roomId": "rm-078",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0208",
    "id": "bed-0208",
    "bedNumber": "Bed 2",
    "roomId": "rm-078",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0209",
    "id": "bed-0209",
    "bedNumber": "Bed 1",
    "roomId": "rm-079",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 44"
  },
  {
    "_id": "bed-0210",
    "id": "bed-0210",
    "bedNumber": "Bed 2",
    "roomId": "rm-079",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0211",
    "id": "bed-0211",
    "bedNumber": "Bed 3",
    "roomId": "rm-079",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0212",
    "id": "bed-0212",
    "bedNumber": "Bed 1",
    "roomId": "rm-080",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0213",
    "id": "bed-0213",
    "bedNumber": "Bed 2",
    "roomId": "rm-080",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0214",
    "id": "bed-0214",
    "bedNumber": "Bed 3",
    "roomId": "rm-080",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0215",
    "id": "bed-0215",
    "bedNumber": "Bed 1",
    "roomId": "rm-081",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 45"
  },
  {
    "_id": "bed-0216",
    "id": "bed-0216",
    "bedNumber": "Bed 2",
    "roomId": "rm-081",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0217",
    "id": "bed-0217",
    "bedNumber": "Bed 3",
    "roomId": "rm-081",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0218",
    "id": "bed-0218",
    "bedNumber": "Bed 1",
    "roomId": "rm-082",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0219",
    "id": "bed-0219",
    "bedNumber": "Bed 2",
    "roomId": "rm-082",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0220",
    "id": "bed-0220",
    "bedNumber": "Bed 3",
    "roomId": "rm-082",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0221",
    "id": "bed-0221",
    "bedNumber": "Bed 1",
    "roomId": "rm-083",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 46"
  },
  {
    "_id": "bed-0222",
    "id": "bed-0222",
    "bedNumber": "Bed 2",
    "roomId": "rm-083",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0223",
    "id": "bed-0223",
    "bedNumber": "Bed 1",
    "roomId": "rm-084",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0224",
    "id": "bed-0224",
    "bedNumber": "Bed 2",
    "roomId": "rm-084",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0225",
    "id": "bed-0225",
    "bedNumber": "Bed 1",
    "roomId": "rm-085",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 47"
  },
  {
    "_id": "bed-0226",
    "id": "bed-0226",
    "bedNumber": "Bed 2",
    "roomId": "rm-085",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0227",
    "id": "bed-0227",
    "bedNumber": "Bed 3",
    "roomId": "rm-085",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0228",
    "id": "bed-0228",
    "bedNumber": "Bed 1",
    "roomId": "rm-086",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0229",
    "id": "bed-0229",
    "bedNumber": "Bed 2",
    "roomId": "rm-086",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0230",
    "id": "bed-0230",
    "bedNumber": "Bed 3",
    "roomId": "rm-086",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0231",
    "id": "bed-0231",
    "bedNumber": "Bed 1",
    "roomId": "rm-087",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 48"
  },
  {
    "_id": "bed-0232",
    "id": "bed-0232",
    "bedNumber": "Bed 2",
    "roomId": "rm-087",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0233",
    "id": "bed-0233",
    "bedNumber": "Bed 3",
    "roomId": "rm-087",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0234",
    "id": "bed-0234",
    "bedNumber": "Bed 1",
    "roomId": "rm-088",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0235",
    "id": "bed-0235",
    "bedNumber": "Bed 2",
    "roomId": "rm-088",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0236",
    "id": "bed-0236",
    "bedNumber": "Bed 3",
    "roomId": "rm-088",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0237",
    "id": "bed-0237",
    "bedNumber": "Bed 1",
    "roomId": "rm-089",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 49"
  },
  {
    "_id": "bed-0238",
    "id": "bed-0238",
    "bedNumber": "Bed 2",
    "roomId": "rm-089",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0239",
    "id": "bed-0239",
    "bedNumber": "Bed 1",
    "roomId": "rm-090",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0240",
    "id": "bed-0240",
    "bedNumber": "Bed 2",
    "roomId": "rm-090",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0241",
    "id": "bed-0241",
    "bedNumber": "Bed 1",
    "roomId": "rm-091",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 50"
  },
  {
    "_id": "bed-0242",
    "id": "bed-0242",
    "bedNumber": "Bed 2",
    "roomId": "rm-091",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0243",
    "id": "bed-0243",
    "bedNumber": "Bed 3",
    "roomId": "rm-091",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0244",
    "id": "bed-0244",
    "bedNumber": "Bed 1",
    "roomId": "rm-092",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0245",
    "id": "bed-0245",
    "bedNumber": "Bed 2",
    "roomId": "rm-092",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0246",
    "id": "bed-0246",
    "bedNumber": "Bed 3",
    "roomId": "rm-092",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0247",
    "id": "bed-0247",
    "bedNumber": "Bed 1",
    "roomId": "rm-093",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Resident Student 51"
  },
  {
    "_id": "bed-0248",
    "id": "bed-0248",
    "bedNumber": "Bed 2",
    "roomId": "rm-093",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0249",
    "id": "bed-0249",
    "bedNumber": "Bed 3",
    "roomId": "rm-093",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0250",
    "id": "bed-0250",
    "bedNumber": "Bed 1",
    "roomId": "rm-094",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0251",
    "id": "bed-0251",
    "bedNumber": "Bed 2",
    "roomId": "rm-094",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0252",
    "id": "bed-0252",
    "bedNumber": "Bed 3",
    "roomId": "rm-094",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0253",
    "id": "bed-0253",
    "bedNumber": "Bed 1",
    "roomId": "rm-095",
    "status": "Occupied",
    "isOccupied": true,
    "occupiedBy": "Dishan Silva"
  },
  {
    "_id": "bed-0254",
    "id": "bed-0254",
    "bedNumber": "Bed 2",
    "roomId": "rm-095",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0255",
    "id": "bed-0255",
    "bedNumber": "Bed 1",
    "roomId": "rm-096",
    "status": "Available",
    "isOccupied": false
  },
  {
    "_id": "bed-0256",
    "id": "bed-0256",
    "bedNumber": "Bed 2",
    "roomId": "rm-096",
    "status": "Available",
    "isOccupied": false
  }
];

export const SAMPLE_ALLOCATIONS = [
  {
    "_id": "alloc-001",
    "id": "alloc-001",
    "studentName": "A. Kanesalingam",
    "regNo": "STD-2026-069",
    "studentId": "STD-2026-069",
    "room": "A-101",
    "roomId": "rm-001",
    "bed": "Bed 1",
    "bedId": "bed-0001",
    "building": "Block A - Aurora Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-002",
    "id": "alloc-002",
    "studentName": "M. H. U Hafrath",
    "regNo": "STD-2026-102",
    "studentId": "STD-2026-102",
    "room": "A-101",
    "roomId": "rm-001",
    "bed": "Bed 2",
    "bedId": "bed-0002",
    "building": "Block A - Aurora Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-003",
    "id": "alloc-003",
    "studentName": "Resident Student 3",
    "regNo": "STD-2026-203",
    "studentId": "STD-2026-203",
    "room": "A-103",
    "roomId": "rm-003",
    "bed": "Bed 1",
    "bedId": "bed-0007",
    "building": "Block A - Aurora Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-004",
    "id": "alloc-004",
    "studentName": "Kavindu Perera",
    "regNo": "STD-2026-045",
    "studentId": "STD-2026-045",
    "room": "A-105",
    "roomId": "rm-005",
    "bed": "Bed 1",
    "bedId": "bed-0013",
    "building": "Block A - Aurora Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-005",
    "id": "alloc-005",
    "studentName": "Resident Student 5",
    "regNo": "STD-2026-205",
    "studentId": "STD-2026-205",
    "room": "A-201",
    "roomId": "rm-007",
    "bed": "Bed 1",
    "bedId": "bed-0017",
    "building": "Block A - Aurora Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-006",
    "id": "alloc-006",
    "studentName": "Resident Student 6",
    "regNo": "STD-2026-206",
    "studentId": "STD-2026-206",
    "room": "A-203",
    "roomId": "rm-009",
    "bed": "Bed 1",
    "bedId": "bed-0023",
    "building": "Block A - Aurora Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-007",
    "id": "alloc-007",
    "studentName": "Resident Student 7",
    "regNo": "STD-2026-207",
    "studentId": "STD-2026-207",
    "room": "A-205",
    "roomId": "rm-011",
    "bed": "Bed 1",
    "bedId": "bed-0029",
    "building": "Block A - Aurora Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-008",
    "id": "alloc-008",
    "studentName": "Resident Student 8",
    "regNo": "STD-2026-208",
    "studentId": "STD-2026-208",
    "room": "A-301",
    "roomId": "rm-013",
    "bed": "Bed 1",
    "bedId": "bed-0033",
    "building": "Block A - Aurora Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-009",
    "id": "alloc-009",
    "studentName": "Resident Student 9",
    "regNo": "STD-2026-209",
    "studentId": "STD-2026-209",
    "room": "A-303",
    "roomId": "rm-015",
    "bed": "Bed 1",
    "bedId": "bed-0039",
    "building": "Block A - Aurora Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-010",
    "id": "alloc-010",
    "studentName": "Resident Student 10",
    "regNo": "STD-2026-210",
    "studentId": "STD-2026-210",
    "room": "A-305",
    "roomId": "rm-017",
    "bed": "Bed 1",
    "bedId": "bed-0045",
    "building": "Block A - Aurora Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-011",
    "id": "alloc-011",
    "studentName": "Resident Student 11",
    "regNo": "STD-2026-211",
    "studentId": "STD-2026-211",
    "room": "A-401",
    "roomId": "rm-019",
    "bed": "Bed 1",
    "bedId": "bed-0049",
    "building": "Block A - Aurora Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-012",
    "id": "alloc-012",
    "studentName": "Resident Student 12",
    "regNo": "STD-2026-212",
    "studentId": "STD-2026-212",
    "room": "A-403",
    "roomId": "rm-021",
    "bed": "Bed 1",
    "bedId": "bed-0055",
    "building": "Block A - Aurora Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-013",
    "id": "alloc-013",
    "studentName": "Resident Student 13",
    "regNo": "STD-2026-213",
    "studentId": "STD-2026-213",
    "room": "A-405",
    "roomId": "rm-023",
    "bed": "Bed 1",
    "bedId": "bed-0061",
    "building": "Block A - Aurora Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-014",
    "id": "alloc-014",
    "studentName": "Resident Student 14",
    "regNo": "STD-2026-214",
    "studentId": "STD-2026-214",
    "room": "B-101",
    "roomId": "rm-025",
    "bed": "Bed 1",
    "bedId": "bed-0065",
    "building": "Block B - Horizon Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-015",
    "id": "alloc-015",
    "studentName": "Resident Student 15",
    "regNo": "STD-2026-215",
    "studentId": "STD-2026-215",
    "room": "B-103",
    "roomId": "rm-027",
    "bed": "Bed 1",
    "bedId": "bed-0071",
    "building": "Block B - Horizon Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-016",
    "id": "alloc-016",
    "studentName": "Resident Student 16",
    "regNo": "STD-2026-216",
    "studentId": "STD-2026-216",
    "room": "B-105",
    "roomId": "rm-029",
    "bed": "Bed 1",
    "bedId": "bed-0077",
    "building": "Block B - Horizon Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-017",
    "id": "alloc-017",
    "studentName": "Resident Student 17",
    "regNo": "STD-2026-217",
    "studentId": "STD-2026-217",
    "room": "B-201",
    "roomId": "rm-031",
    "bed": "Bed 1",
    "bedId": "bed-0081",
    "building": "Block B - Horizon Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-018",
    "id": "alloc-018",
    "studentName": "Resident Student 18",
    "regNo": "STD-2026-218",
    "studentId": "STD-2026-218",
    "room": "B-203",
    "roomId": "rm-033",
    "bed": "Bed 1",
    "bedId": "bed-0087",
    "building": "Block B - Horizon Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-019",
    "id": "alloc-019",
    "studentName": "Ahamed Nafeesh",
    "regNo": "STD-2026-090",
    "studentId": "STD-2026-090",
    "room": "B-204",
    "roomId": "rm-034",
    "bed": "Bed 1",
    "bedId": "bed-0090",
    "building": "Block B - Horizon Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-020",
    "id": "alloc-020",
    "studentName": "M. I. M Izni",
    "regNo": "STD-2026-112",
    "studentId": "STD-2026-112",
    "room": "B-204",
    "roomId": "rm-034",
    "bed": "Bed 2",
    "bedId": "bed-0091",
    "building": "Block B - Horizon Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-021",
    "id": "alloc-021",
    "studentName": "Resident Student 21",
    "regNo": "STD-2026-221",
    "studentId": "STD-2026-221",
    "room": "B-205",
    "roomId": "rm-035",
    "bed": "Bed 1",
    "bedId": "bed-0093",
    "building": "Block B - Horizon Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-022",
    "id": "alloc-022",
    "studentName": "Resident Student 22",
    "regNo": "STD-2026-222",
    "studentId": "STD-2026-222",
    "room": "B-301",
    "roomId": "rm-037",
    "bed": "Bed 1",
    "bedId": "bed-0097",
    "building": "Block B - Horizon Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-023",
    "id": "alloc-023",
    "studentName": "Resident Student 23",
    "regNo": "STD-2026-223",
    "studentId": "STD-2026-223",
    "room": "B-303",
    "roomId": "rm-039",
    "bed": "Bed 1",
    "bedId": "bed-0103",
    "building": "Block B - Horizon Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-024",
    "id": "alloc-024",
    "studentName": "Resident Student 24",
    "regNo": "STD-2026-224",
    "studentId": "STD-2026-224",
    "room": "B-305",
    "roomId": "rm-041",
    "bed": "Bed 1",
    "bedId": "bed-0109",
    "building": "Block B - Horizon Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-025",
    "id": "alloc-025",
    "studentName": "Resident Student 25",
    "regNo": "STD-2026-225",
    "studentId": "STD-2026-225",
    "room": "B-401",
    "roomId": "rm-043",
    "bed": "Bed 1",
    "bedId": "bed-0113",
    "building": "Block B - Horizon Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-026",
    "id": "alloc-026",
    "studentName": "Resident Student 26",
    "regNo": "STD-2026-226",
    "studentId": "STD-2026-226",
    "room": "B-403",
    "roomId": "rm-045",
    "bed": "Bed 1",
    "bedId": "bed-0119",
    "building": "Block B - Horizon Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-027",
    "id": "alloc-027",
    "studentName": "Resident Student 27",
    "regNo": "STD-2026-227",
    "studentId": "STD-2026-227",
    "room": "B-405",
    "roomId": "rm-047",
    "bed": "Bed 1",
    "bedId": "bed-0125",
    "building": "Block B - Horizon Hall",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-028",
    "id": "alloc-028",
    "studentName": "A. Dhusanthika",
    "regNo": "STD-2026-074",
    "studentId": "STD-2026-074",
    "room": "C-101",
    "roomId": "rm-049",
    "bed": "Bed 1",
    "bedId": "bed-0129",
    "building": "Block C - Lakeside Residence",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-029",
    "id": "alloc-029",
    "studentName": "Resident Student 29",
    "regNo": "STD-2026-229",
    "studentId": "STD-2026-229",
    "room": "C-103",
    "roomId": "rm-051",
    "bed": "Bed 1",
    "bedId": "bed-0135",
    "building": "Block C - Lakeside Residence",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-030",
    "id": "alloc-030",
    "studentName": "Resident Student 30",
    "regNo": "STD-2026-230",
    "studentId": "STD-2026-230",
    "room": "C-105",
    "roomId": "rm-053",
    "bed": "Bed 1",
    "bedId": "bed-0141",
    "building": "Block C - Lakeside Residence",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-031",
    "id": "alloc-031",
    "studentName": "Resident Student 31",
    "regNo": "STD-2026-231",
    "studentId": "STD-2026-231",
    "room": "C-201",
    "roomId": "rm-055",
    "bed": "Bed 1",
    "bedId": "bed-0145",
    "building": "Block C - Lakeside Residence",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-032",
    "id": "alloc-032",
    "studentName": "Resident Student 32",
    "regNo": "STD-2026-232",
    "studentId": "STD-2026-232",
    "room": "C-203",
    "roomId": "rm-057",
    "bed": "Bed 1",
    "bedId": "bed-0151",
    "building": "Block C - Lakeside Residence",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-033",
    "id": "alloc-033",
    "studentName": "Resident Student 33",
    "regNo": "STD-2026-233",
    "studentId": "STD-2026-233",
    "room": "C-205",
    "roomId": "rm-059",
    "bed": "Bed 1",
    "bedId": "bed-0157",
    "building": "Block C - Lakeside Residence",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-034",
    "id": "alloc-034",
    "studentName": "Resident Student 34",
    "regNo": "STD-2026-234",
    "studentId": "STD-2026-234",
    "room": "C-301",
    "roomId": "rm-061",
    "bed": "Bed 1",
    "bedId": "bed-0161",
    "building": "Block C - Lakeside Residence",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-035",
    "id": "alloc-035",
    "studentName": "Fathima Rizna",
    "regNo": "STD-2026-078",
    "studentId": "STD-2026-078",
    "room": "C-302",
    "roomId": "rm-062",
    "bed": "Bed 1",
    "bedId": "bed-0164",
    "building": "Block C - Lakeside Residence",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-036",
    "id": "alloc-036",
    "studentName": "Resident Student 36",
    "regNo": "STD-2026-236",
    "studentId": "STD-2026-236",
    "room": "C-303",
    "roomId": "rm-063",
    "bed": "Bed 1",
    "bedId": "bed-0167",
    "building": "Block C - Lakeside Residence",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-037",
    "id": "alloc-037",
    "studentName": "Resident Student 37",
    "regNo": "STD-2026-237",
    "studentId": "STD-2026-237",
    "room": "C-305",
    "roomId": "rm-065",
    "bed": "Bed 1",
    "bedId": "bed-0173",
    "building": "Block C - Lakeside Residence",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-038",
    "id": "alloc-038",
    "studentName": "Resident Student 38",
    "regNo": "STD-2026-238",
    "studentId": "STD-2026-238",
    "room": "C-401",
    "roomId": "rm-067",
    "bed": "Bed 1",
    "bedId": "bed-0177",
    "building": "Block C - Lakeside Residence",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-039",
    "id": "alloc-039",
    "studentName": "Resident Student 39",
    "regNo": "STD-2026-239",
    "studentId": "STD-2026-239",
    "room": "C-403",
    "roomId": "rm-069",
    "bed": "Bed 1",
    "bedId": "bed-0183",
    "building": "Block C - Lakeside Residence",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-040",
    "id": "alloc-040",
    "studentName": "Resident Student 40",
    "regNo": "STD-2026-240",
    "studentId": "STD-2026-240",
    "room": "C-405",
    "roomId": "rm-071",
    "bed": "Bed 1",
    "bedId": "bed-0189",
    "building": "Block C - Lakeside Residence",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-041",
    "id": "alloc-041",
    "studentName": "Resident Student 41",
    "regNo": "STD-2026-241",
    "studentId": "STD-2026-241",
    "room": "D-101",
    "roomId": "rm-073",
    "bed": "Bed 1",
    "bedId": "bed-0193",
    "building": "Block D - Co-Living Annex",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-042",
    "id": "alloc-042",
    "studentName": "Resident Student 42",
    "regNo": "STD-2026-242",
    "studentId": "STD-2026-242",
    "room": "D-103",
    "roomId": "rm-075",
    "bed": "Bed 1",
    "bedId": "bed-0199",
    "building": "Block D - Co-Living Annex",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-043",
    "id": "alloc-043",
    "studentName": "Resident Student 43",
    "regNo": "STD-2026-243",
    "studentId": "STD-2026-243",
    "room": "D-105",
    "roomId": "rm-077",
    "bed": "Bed 1",
    "bedId": "bed-0205",
    "building": "Block D - Co-Living Annex",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-044",
    "id": "alloc-044",
    "studentName": "Resident Student 44",
    "regNo": "STD-2026-244",
    "studentId": "STD-2026-244",
    "room": "D-201",
    "roomId": "rm-079",
    "bed": "Bed 1",
    "bedId": "bed-0209",
    "building": "Block D - Co-Living Annex",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-045",
    "id": "alloc-045",
    "studentName": "Resident Student 45",
    "regNo": "STD-2026-245",
    "studentId": "STD-2026-245",
    "room": "D-203",
    "roomId": "rm-081",
    "bed": "Bed 1",
    "bedId": "bed-0215",
    "building": "Block D - Co-Living Annex",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-046",
    "id": "alloc-046",
    "studentName": "Resident Student 46",
    "regNo": "STD-2026-246",
    "studentId": "STD-2026-246",
    "room": "D-205",
    "roomId": "rm-083",
    "bed": "Bed 1",
    "bedId": "bed-0221",
    "building": "Block D - Co-Living Annex",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-047",
    "id": "alloc-047",
    "studentName": "Resident Student 47",
    "regNo": "STD-2026-247",
    "studentId": "STD-2026-247",
    "room": "D-301",
    "roomId": "rm-085",
    "bed": "Bed 1",
    "bedId": "bed-0225",
    "building": "Block D - Co-Living Annex",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-048",
    "id": "alloc-048",
    "studentName": "Resident Student 48",
    "regNo": "STD-2026-248",
    "studentId": "STD-2026-248",
    "room": "D-303",
    "roomId": "rm-087",
    "bed": "Bed 1",
    "bedId": "bed-0231",
    "building": "Block D - Co-Living Annex",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-049",
    "id": "alloc-049",
    "studentName": "Resident Student 49",
    "regNo": "STD-2026-249",
    "studentId": "STD-2026-249",
    "room": "D-305",
    "roomId": "rm-089",
    "bed": "Bed 1",
    "bedId": "bed-0237",
    "building": "Block D - Co-Living Annex",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-050",
    "id": "alloc-050",
    "studentName": "Resident Student 50",
    "regNo": "STD-2026-250",
    "studentId": "STD-2026-250",
    "room": "D-401",
    "roomId": "rm-091",
    "bed": "Bed 1",
    "bedId": "bed-0241",
    "building": "Block D - Co-Living Annex",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-051",
    "id": "alloc-051",
    "studentName": "Resident Student 51",
    "regNo": "STD-2026-251",
    "studentId": "STD-2026-251",
    "room": "D-403",
    "roomId": "rm-093",
    "bed": "Bed 1",
    "bedId": "bed-0247",
    "building": "Block D - Co-Living Annex",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  },
  {
    "_id": "alloc-052",
    "id": "alloc-052",
    "studentName": "Dishan Silva",
    "regNo": "STD-2026-012",
    "studentId": "STD-2026-012",
    "room": "D-405",
    "roomId": "rm-095",
    "bed": "Bed 1",
    "bedId": "bed-0253",
    "building": "Block D - Co-Living Annex",
    "allocatedDate": "2026-02-15",
    "status": "Active"
  }
];

export const SAMPLE_TRANSFERS = [
  {
    "_id": "tr-001",
    "id": "tr-001",
    "studentName": "M. I. M Izni",
    "studentId": "STD-2026-112",
    "currentRoom": "B-204",
    "currentBed": "Bed 2",
    "requestedRoom": "B-206",
    "requestedBed": "Bed 1",
    "reason": "Quiet study floor preference for final year semester project",
    "status": "Approved",
    "requestDate": "2026-09-18"
  },
  {
    "_id": "tr-002",
    "id": "tr-002",
    "studentName": "Kavindu Perera",
    "studentId": "STD-2026-045",
    "currentRoom": "A-302",
    "currentBed": "Bed 1",
    "requestedRoom": "A-104",
    "requestedBed": "Bed 2",
    "reason": "Medical ground floor allocation request",
    "status": "Pending",
    "requestDate": "2026-09-24"
  }
];
