const MonitoringReading = require("../models/MonitoringReading");
const Room = require("../models/Room");
const Bed = require("../models/Bed");
const Allocation = require("../models/Allocation");
const Building = require("../models/Building");
const Bill = require("../models/Bill");
const Payment = require("../models/Payment");
const Complaint = require("../models/Complaint");
const FoodOrder = require("../models/FoodOrder");

const DAILY_LIMITS = {
  Water: 3000,
  Electricity: 2000,
};

const BLOCK_LIMITS = {
  Water: 1000,
  Electricity: 900,
};

/**
 * PRESERVED EXISTING ENDPOINT
 * GET /api/analytics/summary
 * Retrieves today's monitoring totals and limit status for Water and Electricity
 */
const getMonitoringSummary = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const readings = await MonitoringReading.find({
      recordedAt: { $gte: startOfDay },
    });

    const summary = ["Water", "Electricity"].map((type) => {
      const filtered = readings.filter(
        (reading) => reading.utilityType === type
      );

      const total = filtered.reduce(
        (sum, reading) => sum + reading.value,
        0
      );

      const limit = DAILY_LIMITS[type];
      const percentage = limit ? (total / limit) * 100 : 0;

      return {
        utilityType: type,
        total,
        unit: type === "Water" ? "L" : "kWh",
        dailyLimit: limit,
        percentage: Number(percentage.toFixed(2)),
        status:
          percentage >= 100
            ? "Exceeded"
            : percentage >= 80
              ? "Warning"
              : "Normal",
        readingCount: filtered.length,
      };
    });

    res.status(200).json({
      success: true,
      date: startOfDay,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve monitoring summary",
      error: error.message,
    });
  }
};

/**
 * PRESERVED EXISTING ENDPOINT
 * GET /api/analytics/blocks
 * Retrieves today's utility usage grouped by hostel block
 */
const getBlockSummary = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const readings = await MonitoringReading.find({
      recordedAt: { $gte: startOfDay },
    });

    const blocks = {};

    readings.forEach((reading) => {
      const blockName = reading.blockName || "Unassigned";

      if (!blocks[blockName]) {
        blocks[blockName] = {
          blockName,
          water: 0,
          electricity: 0,
          waterLimit: BLOCK_LIMITS.Water,
          electricityLimit: BLOCK_LIMITS.Electricity,
        };
      }

      if (reading.utilityType === "Water") {
        blocks[blockName].water += reading.value;
      }

      if (reading.utilityType === "Electricity") {
        blocks[blockName].electricity += reading.value;
      }
    });

    const data = Object.values(blocks).map((block) => ({
      ...block,
      status:
        block.water >= block.waterLimit ||
        block.electricity >= block.electricityLimit
          ? "Warning"
          : "Normal",
    }));

    res.status(200).json({
      success: true,
      date: startOfDay,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve block summary",
      error: error.message,
    });
  }
};

/**
 * MODULE 5: OCCUPANCY ANALYTICS
 * GET /api/analytics/occupancy
 * Aggregates room inventory, bed capacity, allocations, and block-wise occupancy
 */
const getOccupancyAnalytics = async (req, res) => {
  try {
    const [buildings, rooms, beds, allocations] = await Promise.all([
      Building.find().lean(),
      Room.find().lean(),
      Bed.find().lean(),
      Allocation.find({ status: { $regex: /^active$/i } }).lean(),
    ]);

    const totalRooms = rooms.length;
    const totalBeds = beds.length;

    // Determine occupied beds
    const occupiedBedIds = new Set();
    beds.forEach((b) => {
      if (b.status && /^occupied$/i.test(b.status)) {
        occupiedBedIds.add(String(b._id));
      }
    });
    allocations.forEach((a) => {
      if (a.bedId) {
        occupiedBedIds.add(String(a.bedId));
      }
    });

    const occupiedBeds = occupiedBedIds.size;
    const availableBeds = Math.max(totalBeds - occupiedBeds, 0);
    const occupancyPercentage =
      totalBeds > 0
        ? Number(((occupiedBeds / totalBeds) * 100).toFixed(2))
        : 0;

    // Block-wise mapping
    const buildingMap = {};
    buildings.forEach((b) => {
      buildingMap[String(b._id)] = {
        buildingId: String(b._id),
        blockName: b.name || b.code || "Unassigned",
        buildingCode: b.code || "",
        floors: b.floors || 1,
        totalRooms: 0,
        totalBeds: 0,
        occupiedBeds: 0,
        availableBeds: 0,
        occupancyRate: 0,
      };
    });

    const roomToBuilding = {};
    rooms.forEach((r) => {
      const bId = r.buildingId ? String(r.buildingId) : "unknown";
      if (!buildingMap[bId]) {
        buildingMap[bId] = {
          buildingId: bId,
          blockName: bId === "unknown" ? "General / Unassigned" : `Building ${bId}`,
          buildingCode: "",
          floors: 1,
          totalRooms: 0,
          totalBeds: 0,
          occupiedBeds: 0,
          availableBeds: 0,
          occupancyRate: 0,
        };
      }
      buildingMap[bId].totalRooms += 1;
      roomToBuilding[String(r._id)] = bId;
    });

    beds.forEach((b) => {
      const bId = roomToBuilding[String(b.roomId)] || "unknown";
      if (!buildingMap[bId]) {
        buildingMap[bId] = {
          buildingId: bId,
          blockName: "General / Unassigned",
          buildingCode: "",
          floors: 1,
          totalRooms: 0,
          totalBeds: 0,
          occupiedBeds: 0,
          availableBeds: 0,
          occupancyRate: 0,
        };
      }
      buildingMap[bId].totalBeds += 1;
      if (occupiedBedIds.has(String(b._id))) {
        buildingMap[bId].occupiedBeds += 1;
      }
    });

    const blocks = Object.values(buildingMap)
      .filter((b) => b.totalRooms > 0 || b.totalBeds > 0)
      .map((b) => {
        const avail = Math.max(b.totalBeds - b.occupiedBeds, 0);
        const rate =
          b.totalBeds > 0
            ? Number(((b.occupiedBeds / b.totalBeds) * 100).toFixed(2))
            : 0;
        return {
          ...b,
          availableBeds: avail,
          occupancyRate: rate,
        };
      });

    return res.status(200).json({
      success: true,
      data: {
        totalRooms,
        totalBeds,
        occupiedBeds,
        availableBeds,
        occupancyPercentage,
        activeAllocationsCount: allocations.length,
        blocks,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve occupancy analytics",
      error: error.message,
    });
  }
};

/**
 * MODULE 5: FINANCIAL ANALYTICS
 * GET /api/analytics/financial
 * Aggregates billed fees, collected payments, outstanding balances, and monthly revenue
 */
const getFinancialAnalytics = async (req, res) => {
  try {
    const [bills, payments] = await Promise.all([
      Bill.find().lean(),
      Payment.find().lean(),
    ]);

    let totalBilledAmount = 0;
    let pendingBilledAmount = 0;
    let paidBilledAmount = 0;
    let overdueBilledAmount = 0;
    let cancelledBilledAmount = 0;

    const billStatusCounts = {
      pending: 0,
      paid: 0,
      overdue: 0,
      cancelled: 0,
    };

    bills.forEach((b) => {
      const amount = Number(b.amount || 0);
      const lateFee = Number(b.lateFee || 0);
      const billTotal = amount + lateFee;
      const status = String(b.status || "pending").toLowerCase().trim();

      if (status === "cancelled") {
        billStatusCounts.cancelled += 1;
        cancelledBilledAmount += billTotal;
      } else {
        totalBilledAmount += billTotal;
        if (status === "paid") {
          billStatusCounts.paid += 1;
          paidBilledAmount += billTotal;
        } else if (status === "overdue") {
          billStatusCounts.overdue += 1;
          overdueBilledAmount += billTotal;
        } else {
          billStatusCounts.pending += 1;
          pendingBilledAmount += billTotal;
        }
      }
    });

    let totalCollectedPayments = 0;
    let successfulPaymentCount = 0;
    let failedPaymentCount = 0;
    let pendingPaymentCount = 0;
    const paymentMethodBreakdown = {};

    payments.forEach((p) => {
      const status = String(p.status || "").toLowerCase().trim();
      const amount = Number(p.amount || 0);
      const method = p.paymentMethod || p.method || "Other";

      if (/^success(ful)?$/.test(status)) {
        totalCollectedPayments += amount;
        successfulPaymentCount += 1;

        if (!paymentMethodBreakdown[method]) {
          paymentMethodBreakdown[method] = {
            method,
            totalAmount: 0,
            transactionCount: 0,
          };
        }
        paymentMethodBreakdown[method].totalAmount += amount;
        paymentMethodBreakdown[method].transactionCount += 1;
      } else if (/^failed$/.test(status)) {
        failedPaymentCount += 1;
      } else {
        pendingPaymentCount += 1;
      }
    });

    const outstandingBalance = pendingBilledAmount + overdueBilledAmount;
    const collectionRate =
      totalBilledAmount > 0
        ? Number(((totalCollectedPayments / totalBilledAmount) * 100).toFixed(2))
        : 0;

    // Monthly summary
    const monthlyMap = {};

    payments.forEach((p) => {
      const status = String(p.status || "").toLowerCase().trim();
      if (!/^success(ful)?$/.test(status)) return;

      const dateObj = new Date(p.paymentDate || p.createdAt || Date.now());
      if (isNaN(dateObj.getTime())) return;

      const yearMonth = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
      const monthLabel = dateObj.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyMap[yearMonth]) {
        monthlyMap[yearMonth] = {
          yearMonth,
          month: monthLabel,
          collectedAmount: 0,
          transactionCount: 0,
          billedAmount: 0,
        };
      }
      monthlyMap[yearMonth].collectedAmount += Number(p.amount || 0);
      monthlyMap[yearMonth].transactionCount += 1;
    });

    bills.forEach((b) => {
      const status = String(b.status || "").toLowerCase().trim();
      if (status === "cancelled") return;

      const dateObj = new Date(b.createdAt || b.dueDate || Date.now());
      if (isNaN(dateObj.getTime())) return;

      const yearMonth = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
      const monthLabel = dateObj.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyMap[yearMonth]) {
        monthlyMap[yearMonth] = {
          yearMonth,
          month: monthLabel,
          collectedAmount: 0,
          transactionCount: 0,
          billedAmount: 0,
        };
      }
      monthlyMap[yearMonth].billedAmount +=
        Number(b.amount || 0) + Number(b.lateFee || 0);
    });

    const monthlySummary = Object.keys(monthlyMap)
      .sort()
      .map((k) => monthlyMap[k]);

    return res.status(200).json({
      success: true,
      data: {
        totalBilledAmount,
        totalCollectedPayments,
        outstandingBalance,
        collectionRate,
        billsSummary: {
          totalCount: bills.length,
          activeCount: bills.length - billStatusCounts.cancelled,
          statusCounts: billStatusCounts,
          pendingAmount: pendingBilledAmount,
          paidAmount: paidBilledAmount,
          overdueAmount: overdueBilledAmount,
          cancelledAmount: cancelledBilledAmount,
        },
        paymentsSummary: {
          totalCount: payments.length,
          successfulCount: successfulPaymentCount,
          failedCount: failedPaymentCount,
          pendingCount: pendingPaymentCount,
          methodBreakdown: Object.values(paymentMethodBreakdown),
        },
        monthlySummary,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve financial analytics",
      error: error.message,
    });
  }
};

/**
 * MODULE 5: COMPLAINT ANALYTICS
 * GET /api/analytics/complaints
 * Aggregates complaints, priority/category distributions, and SLA resolution times
 */
const getComplaintAnalytics = async (req, res) => {
  try {
    const complaints = await Complaint.find().lean();

    const totalComplaints = complaints.length;
    let openComplaints = 0;
    let resolvedComplaints = 0;
    let rejectedComplaints = 0;

    const priorityDistribution = {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0,
    };

    const categoryDistribution = {};
    const statusDistribution = {
      Pending: 0,
      "In Progress": 0,
      Resolved: 0,
      Rejected: 0,
    };

    let totalResolutionHours = 0;
    let resolvedWithTimestampsCount = 0;

    complaints.forEach((c) => {
      const statusRaw = String(c.status || "Pending").trim();
      const statusKey =
        /^pending$/i.test(statusRaw)
          ? "Pending"
          : /^in progress$/i.test(statusRaw)
          ? "In Progress"
          : /^resolved$/i.test(statusRaw)
          ? "Resolved"
          : /^rejected$/i.test(statusRaw)
          ? "Rejected"
          : "Pending";

      statusDistribution[statusKey] =
        (statusDistribution[statusKey] || 0) + 1;

      if (statusKey === "Resolved") {
        resolvedComplaints += 1;
        if (c.createdAt && c.updatedAt) {
          const created = new Date(c.createdAt).getTime();
          const updated = new Date(c.updatedAt).getTime();
          if (updated > created) {
            const diffHours = (updated - created) / (1000 * 60 * 60);
            totalResolutionHours += diffHours;
            resolvedWithTimestampsCount += 1;
          }
        }
      } else if (statusKey === "Rejected") {
        rejectedComplaints += 1;
      } else {
        openComplaints += 1;
      }

      // Priority
      const pRaw = String(c.priority || "Medium").toLowerCase().trim();
      if (pRaw === "low") priorityDistribution.Low += 1;
      else if (pRaw === "high") priorityDistribution.High += 1;
      else if (pRaw === "critical") priorityDistribution.Critical += 1;
      else priorityDistribution.Medium += 1;

      // Category
      const cat = c.category ? String(c.category).trim() : "Other";
      categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
    });

    const averageResolutionHours =
      resolvedWithTimestampsCount > 0
        ? Number(
            (totalResolutionHours / resolvedWithTimestampsCount).toFixed(1)
          )
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalComplaints,
        openComplaints,
        resolvedComplaints,
        rejectedComplaints,
        priorityDistribution,
        categoryDistribution,
        statusDistribution,
        averageResolutionHours,
        resolvedWithTimestampsCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve complaint analytics",
      error: error.message,
    });
  }
};

/**
 * MODULE 5: UTILITY TELEMETRY TREND
 * GET /api/analytics/telemetry-trend
 * Provides chronological consumption telemetry, daily/monthly groupings, and usage totals
 */
const getTelemetryTrend = async (req, res) => {
  try {
    const { period, utilityType, blockName } = req.query;
    const filter = {};

    if (utilityType && utilityType !== "All") {
      filter.utilityType = utilityType;
    }

    if (blockName && blockName !== "All") {
      filter.blockName = blockName;
    }

    if (period) {
      const now = Date.now();
      if (period === "24h") {
        filter.recordedAt = { $gte: new Date(now - 24 * 60 * 60 * 1000) };
      } else if (period === "7d") {
        filter.recordedAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
      } else if (period === "30d") {
        filter.recordedAt = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
      }
    }

    const readings = await MonitoringReading.find(filter)
      .sort({ recordedAt: 1 })
      .lean();

    let totalWater = 0;
    let totalElectricity = 0;
    const dailyMap = {};
    const monthlyMap = {};

    readings.forEach((r) => {
      const val = Number(r.value || 0);
      const isWater = r.utilityType === "Water";
      const isElec = r.utilityType === "Electricity";

      if (isWater) totalWater += val;
      if (isElec) totalElectricity += val;

      const dateObj = new Date(r.recordedAt || Date.now());
      if (isNaN(dateObj.getTime())) return;

      const dayKey = dateObj.toISOString().slice(0, 10);
      const monthKey = dayKey.slice(0, 7);

      if (!dailyMap[dayKey]) {
        dailyMap[dayKey] = {
          date: dayKey,
          water: 0,
          electricity: 0,
          readingCount: 0,
        };
      }
      if (isWater) dailyMap[dayKey].water += val;
      if (isElec) dailyMap[dayKey].electricity += val;
      dailyMap[dayKey].readingCount += 1;

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = {
          month: monthKey,
          water: 0,
          electricity: 0,
          readingCount: 0,
        };
      }
      if (isWater) monthlyMap[monthKey].water += val;
      if (isElec) monthlyMap[monthKey].electricity += val;
      monthlyMap[monthKey].readingCount += 1;
    });

    const timeline = readings.map((r) => {
      const d = new Date(r.recordedAt || Date.now());
      return {
        id: String(r._id),
        utilityType: r.utilityType,
        value: r.value,
        unit: r.unit,
        blockName: r.blockName || "Unassigned",
        source: r.source || "Manual",
        recordedAt: r.recordedAt,
        time: !isNaN(d.getTime())
          ? d.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        date: !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : "",
      };
    });

    return res.status(200).json({
      success: true,
      count: readings.length,
      data: {
        totalWater,
        totalElectricity,
        readingCount: readings.length,
        dailySummary: Object.values(dailyMap),
        monthlySummary: Object.values(monthlyMap),
        timeline,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve telemetry trend",
      error: error.message,
    });
  }
};

/**
 * MODULE 5: MONITORING ALERTS
 * GET /api/analytics/alerts
 * Dynamically computes threshold violations and warnings based on real consumption telemetry
 */
const getMonitoringAlerts = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const readings = await MonitoringReading.find({
      recordedAt: { $gte: startOfDay },
    }).lean();

    const alerts = [];

    // 1. Overall campus limit checks
    ["Water", "Electricity"].forEach((type) => {
      const filtered = readings.filter((r) => r.utilityType === type);
      const total = filtered.reduce(
        (sum, r) => sum + Number(r.value || 0),
        0
      );
      const limit = DAILY_LIMITS[type];
      const percentage = limit
        ? Number(((total / limit) * 100).toFixed(1))
        : 0;
      const unit = type === "Water" ? "L" : "kWh";

      if (percentage >= 80) {
        const isCritical = percentage >= 100;
        alerts.push({
          id: `ALT-OVERALL-${type}-${startOfDay.toISOString().slice(0, 10)}`,
          title: `${type} Usage ${isCritical ? "Limit Exceeded" : "Threshold Warning"}`,
          description: `Total campus ${type.toLowerCase()} consumption today is ${total.toLocaleString()} ${unit} (${percentage}% of ${limit.toLocaleString()} ${unit} daily limit).`,
          severity: isCritical ? "Critical" : "Warning",
          status: "Active",
          utilityType: type,
          block: "All Blocks",
          currentUsage: total,
          limit,
          unit,
          percentage,
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }
    });

    // 2. Block-specific limit checks
    const blocks = {};
    readings.forEach((r) => {
      const bName = r.blockName || "Unassigned";
      if (!blocks[bName]) {
        blocks[bName] = { Water: 0, Electricity: 0 };
      }
      if (r.utilityType === "Water")
        blocks[bName].Water += Number(r.value || 0);
      if (r.utilityType === "Electricity")
        blocks[bName].Electricity += Number(r.value || 0);
    });

    Object.entries(blocks).forEach(([blockName, usage]) => {
      ["Water", "Electricity"].forEach((type) => {
        const total = usage[type];
        const limit = BLOCK_LIMITS[type];
        const percentage = limit
          ? Number(((total / limit) * 100).toFixed(1))
          : 0;
        const unit = type === "Water" ? "L" : "kWh";

        if (percentage >= 80) {
          const isCritical = percentage >= 100;
          alerts.push({
            id: `ALT-${blockName.replace(/\s+/g, "_")}-${type}-${startOfDay.toISOString().slice(0, 10)}`,
            title: `${blockName} ${type} ${isCritical ? "Limit Exceeded" : "Warning"}`,
            description: `${blockName} ${type.toLowerCase()} consumption reached ${total.toLocaleString()} ${unit} (${percentage}% of ${limit.toLocaleString()} ${unit} block limit).`,
            severity: isCritical ? "Critical" : "Warning",
            status: "Active",
            utilityType: type,
            block: blockName,
            currentUsage: total,
            limit,
            unit,
            percentage,
            time: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        }
      });
    });

    return res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve monitoring alerts",
      error: error.message,
    });
  }
};

/**
 * MODULE 5: FOOD ORDER ANALYTICS
 * GET /api/analytics/food-orders
 * Aggregates order volumes, status distributions, meal popularity, and realized revenue
 */
const getFoodOrderAnalytics = async (req, res) => {
  try {
    const orders = await FoodOrder.find().lean();

    const totalOrders = orders.length;
    let realizedRevenue = 0;
    let activeOrderRevenue = 0;
    let cancelledRevenue = 0;

    const statusCounts = {
      placed: 0,
      preparing: 0,
      outForDelivery: 0,
      delivered: 0,
      cancelled: 0,
    };

    const itemPopularityMap = {};
    const dailyVolumeMap = {};

    orders.forEach((o) => {
      const amount = Number(o.totalAmount || 0);
      const rawStatus = String(o.status || o.orderStatus || "placed")
        .toLowerCase()
        .trim();

      if (rawStatus === "cancelled") {
        statusCounts.cancelled += 1;
        cancelledRevenue += amount;
      } else if (rawStatus === "completed" || rawStatus === "delivered") {
        statusCounts.delivered += 1;
        realizedRevenue += amount;
        activeOrderRevenue += amount;
      } else if (rawStatus === "preparing") {
        statusCounts.preparing += 1;
        activeOrderRevenue += amount;
      } else if (
        rawStatus === "out for delivery" ||
        rawStatus === "outfordelivery"
      ) {
        statusCounts.outForDelivery += 1;
        activeOrderRevenue += amount;
      } else {
        statusCounts.placed += 1;
        activeOrderRevenue += amount;
      }

      const dateObj = new Date(o.createdAt || Date.now());
      if (!isNaN(dateObj.getTime())) {
        const dayKey = dateObj.toISOString().slice(0, 10);
        if (!dailyVolumeMap[dayKey]) {
          dailyVolumeMap[dayKey] = {
            date: dayKey,
            orderCount: 0,
            revenue: 0,
          };
        }
        dailyVolumeMap[dayKey].orderCount += 1;
        if (rawStatus !== "cancelled") {
          dailyVolumeMap[dayKey].revenue += amount;
        }
      }

      const items = o.items || o.orderItems || [];
      items.forEach((item) => {
        const name = String(
          item.name || item.foodName || "Food Item"
        ).trim();
        const qty = Number(item.qty || item.quantity || 1);
        const price = Number(item.price || 0);

        if (!itemPopularityMap[name]) {
          itemPopularityMap[name] = {
            name,
            totalQuantity: 0,
            totalRevenue: 0,
            orderCount: 0,
          };
        }
        itemPopularityMap[name].totalQuantity += qty;
        itemPopularityMap[name].totalRevenue += qty * price;
        itemPopularityMap[name].orderCount += 1;
      });
    });

    const popularMeals = Object.values(itemPopularityMap)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10);

    const volumeTrends = Object.keys(dailyVolumeMap)
      .sort()
      .map((k) => dailyVolumeMap[k]);

    return res.status(200).json({
      success: true,
      data: {
        totalOrders,
        realizedRevenue,
        activeOrderRevenue,
        cancelledRevenue,
        statusCounts,
        popularMeals,
        volumeTrends,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve food order analytics",
      error: error.message,
    });
  }
};

module.exports = {
  getMonitoringSummary,
  getBlockSummary,
  getOccupancyAnalytics,
  getFinancialAnalytics,
  getComplaintAnalytics,
  getTelemetryTrend,
  getMonitoringAlerts,
  getFoodOrderAnalytics,
};
