const UserModel = require("../models/UserModel");
const LeaveModel = require("../models/LeaveModel");
const SetupModel = require("../models/SetupModel");
const CatchAsyncError = require("../middlewares/CatchAsyncError");
const moment = require("moment");
const sendMail = require("../utils/SendEmail");
// require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { ObjectId } = require("mongodb");
// const port = process.env.PORT || 8001;
exports.getLeaves = CatchAsyncError(async (req, res) => {
  const { userId, username } = req.query;
  const leaves = await LeaveModel.findOne({ userId: userId });
  res.status(200).json(leaves);
});
exports.getAllLeaves = CatchAsyncError(async (req, res) => {
  const leaves = await LeaveModel.find();
  res.status(200).json(leaves);
});

// exports.updateLeave = CatchAsyncError(async (req, res) => {
//   const { id } = req.params;
//   const {
//     userId,
//     leavetype,
//     fromDate,
//     toDate,
//     subject,
//     remarks,
//     fs,
//     ts,
//     numofdays,
//     removeFile,
//   } = req.body;

//   const updates = {};
//   for (const [key, value] of Object.entries(req.body)) {
//     updates[`leaveRequests.$.${key}`] = value;
//   }

//   const leaveDoc = await LeaveModel.findOneAndUpdate(
//     { "leaveRequests._id": id },
//     { $set: updates },
//     { new: true }
//   );
//   console.log(req.file,'fn')
//   if (req.file) {
//     console.log(req.file,'fnn')
//     leaveDoc.leaveRequests.find((sd) => {
//       if (sd._id === new ObjectId(id)) {
//         sd.file = req.file.filename;
//       }
//     });
//     console.log(req.file,'fnnnn')
//     await leaveDoc.save();
//   }
//   if (!leaveDoc) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const sd = await SetupModel.find({}, { "staffs.leaveTypes": 1 });
//   const type = sd[0].staffs.leaveTypes.find((s) => s.leaveType === leavetype);
//   const balance = leaveDoc.leaveBalances[leavetype];
//   if (balance < numofdays) {
//     return res.status(200).json({
//       success: true,
//       message: "You exceeded a leave limit",
//       leave: leaveDoc,
//     });
//   } else {
//     res.status(200).json({
//       success: true,
//       message: "Leave Request Submitted",
//       leave: leaveDoc,
//     });
//   }
// });

exports.updateLeave = CatchAsyncError(async (req, res) => {
  const { id } = req.params;
  const {
    userId,
    leavetype,
    fromDate,
    toDate,
    subject,
    remarks,
    fs: fromSession,
    ts: toSession,
    numofdays,
    removeFile,
  } = req.body;

  const updates = {};
  for (const [key, value] of Object.entries(req.body)) {
    if (key !== "removeFile") {
      updates[`leaveRequests.$.${key}`] = value;
    }
  }

  const leaveDoc = await LeaveModel.findOneAndUpdate(
    { "leaveRequests._id": id },
    { $set: updates },
    { new: true }
  );

  if (!leaveDoc) {
    return res.status(404).json({ message: "Leave not found" });
  }

  const leaveRequest = leaveDoc.leaveRequests.find(
    (sd) => sd._id.toString() === id
  );

  // ✅ If a new file is uploaded, replace the existing file
  if (req.file) {
    // If there's an old file, remove it
    if (leaveRequest.file) {
      const oldPath = path.join(__dirname, "..", "uploads", leaveRequest.file);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    const host = `${req.protocol}://${req.get("host")}`;
    const filepath = req.file ? `${host}/uploads/${req.file.filename}` : null;
    leaveRequest.file = filepath;
  }

  // ✅ If the file is removed from the frontend, delete it from disk and DB
  if (removeFile === "true" && !req.file && leaveRequest.file) {
    const oldPath = path.join(__dirname, "..", "uploads", leaveRequest.file);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
    leaveRequest.file = undefined;
  }

  await leaveDoc.save();

  // Leave balance logic (unchanged)
  const sd = await SetupModel.find({}, { "staffs.leaveTypes": 1 });
  const type = sd[0].staffs.leaveTypes.find((s) => s.leaveType === leavetype);
  const balance = leaveDoc.leaveBalances[leavetype];
  if (balance < numofdays) {
    return res.status(200).json({
      success: true,
      message: "You exceeded a leave limit",
      leave: leaveDoc,
    });
  } else {
    res.status(200).json({
      success: true,
      message: "Leave Request Submitted",
      leave: leaveDoc,
    });
  }
});

exports.deleteLeave = CatchAsyncError(async (req, res) => {
  const { userId, leaveId } = req.query;
  const del = await LeaveModel.findOne({ userId: userId });

  if (!del) {
    return res.status(400).json({ message: "User not found" });
  } else {
    del.leaveRequests.pull({ _id: leaveId });
    await del.save();

    res.status(200).json({ message: "Leave deleted successfully!" });
  }
});

exports.LeaveResult = CatchAsyncError(async (req, res) => {
  const { userId, leaveId, numofdays, status, acceptmember } = req.body;

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const accept = await UserModel.findById(acceptmember);
  const leave = await LeaveModel.findOneAndUpdate(
    { userId: userId, "leaveRequests._id": leaveId },
    {
      $set: {
        "leaveRequests.$.status": status,
        "leaveRequests.$.resultby": accept.firstName,
      },
    },
    { new: true }
  );

  if (!leave) {
    return res.status(404).json({
      success: false,
      message: "Leave request not found",
    });
  }

  const users = await UserModel.find(
    {
      $or: [{ administrator: true }, { humanResource: true }],
    },
    { userEmail: 1, _id: 0 }
  );
  const usersmap = users.map((user) => user.userEmail);
  // const options = {
  //   from: process.env.SMTP_USER_EMAIL,
  //   to: "hariharan934526@gmail.com",
  //   cc: usersmap.join(","),
  //   subject: `Leave Request ${status}`,
  //   text: `Leave Request ${status} for ${leave.username}
  //   \n\ Best regards ${accept.firstName}`,
  // };
  // const mail = sendMail(options);
  // if (!mail) {
  //   return res.status(500).json({ message: "Error sending email" });
  // }
  if (status === "Accepted") {
    const verify = await LeaveModel.findOne({
      userId: userId,
      "leaveRequests._id": leaveId,
    });

    const leaves = verify.leaveRequests.find((s) =>
      s._id.equals(new ObjectId(leaveId))
    );

    // const balance=verify.leaveBalances.map((s)=>{
    //        if(Object.keys(s).includes(leaves.leavetype))
    //        {
    //         console.log(s)
    //         s[leaves.leavetype] = s[leaves.leavetype] - numofdays
    //         console.log(s)
    //        }
    //        return s
    //   })
    const bal = Object.keys(verify.leaveBalances).map((sd) => {
      if (leaves.leavetype === sd)
        return (verify.leaveBalances[sd] =
          verify.leaveBalances[sd] - numofdays);
      return verify.leaveBalances;
    });
    // console.log("balance",balance)
    //    verify.leaveBalances= balance
    verify.markModified("leaveBalances");
    await verify.save();

    return res.status(200).json({
      success: true,
      message: "Leave request is accepted",
    });
  } else if (status === "Declined") {
    return res.status(200).json({
      success: true,
      message: "LeaveRequest Declined",
    });
  }
  res.status(200).json({
    success: true,
    message: "LeaveRequest Forwarded To Admin",
  });
});
exports.ApplyLeave = CatchAsyncError(async (req, res, next) => {
  const {
    userId,
    username,
    leavetype,
    fromDate,
    toDate,
    subject,
    remarks,
    fs,
    ts,
    numofdays,
  } = req.body;

  let message;
  let employee = await LeaveModel.findOne({ userId });

  // Fetch leave type details
  const findingLeave = await SetupModel.findOne({
    "staffs.leaveTypes.leaveType": leavetype,
  });

  if (!findingLeave) {
    return res.status(400).json({ message: "Invalid Leave Type" });
  }

  const leaveTypeDetails = findingLeave.staffs.leaveTypes.find(
    (leave) => leave.leaveType === leavetype
  );

  if (!leaveTypeDetails) {
    return res.status(400).json({ message: "Leave type not configured" });
  }

  const { numberOfDays, leaveAccrualType, carryForward, carryForwardType } =
    leaveTypeDetails;

  let balance;

  if (!employee) {
    employee = new LeaveModel({
      userId,
      username,
      leaveBalances: { [leavetype]: numberOfDays },
      lastResetDate: {},
      leaveRequests: [],
    });
    balance = numberOfDays;
  } else {
    balance = employee.leaveBalances.hasOwnProperty(leavetype);

    if (!balance) {
      employee.leaveBalances[leavetype] = numberOfDays;
      employee.markModified("leaveBalances");
    }
  }

  const host = `${req.protocol}://${req.get("host")}`;
  const filepath = req.file ? `${host}/uploads/${req.file.filename}` : null;
  // const filename = ?  : null;
  // const filepath = `${path}/uploads/${filename}`;

  employee.leaveRequests.push({
    leavetype,
    fromDate,
    toDate,
    subject,
    remarks,
    fs,
    ts,
    numofdays,
    file: filepath,
    // file: req.file ? req.file.filename : null,
    status: "Pending",
  });

  await employee.save();

  if (balance[leavetype] < JSON.parse(numofdays)) {
    return res.status(200).json({
      success: true,
      message: "You exceeded a leave limit",
      employee,
    });
  }
  res.status(200).json({
    success: true,
    message: "Request Submitted",
    employee,
  });
});

exports.croncheck = CatchAsyncError(async (req, res) => {
  const setup = await SetupModel.findOne({}, { "staffs.leaveTypes": 1 });
  let maps = {};
  let maps2 = {};
  let op = [];
  const se = setup.staffs.leaveTypes.forEach((sd) => {
    if (!(sd.carryForward === "Yes")) {
      maps[sd.leaveType] = sd.numberOfDays;
    } else {
      maps2[sd.leaveType] = sd.numberOfDays;
    }
  });

  const users = await LeaveModel.find({});
  if (Object.keys(maps).length > 0) {
    users.forEach((user) => {
      let updates = {};
      for (const [leaveType, days] of Object.entries(maps)) {
        if (!user.leaveBalances.hasOwnProperty(leaveType)) {
          updates[`leaveBalances.${leaveType}`] = days;
          user.leaveBalances[leaveType] = days;
        } else {
          updates[`leaveBalances.${leaveType}`] =
            user.leaveBalances[leaveType] + days;
        }
      }
      if (Object.keys(updates).length > 0) {
        op.push({
          updateOne: {
            filter: { userId: user.userId },
            update: { $set: updates },
          },
        });
      }
    });
  }

  if (Object.keys(maps2).length > 0) {
    users.forEach((user) => {
      let updates2 = {};
      for (const [leaveType, days] of Object.entries(maps2)) {
        if (!user.leaveBalances.hasOwnProperty(leaveType)) {
          updates2[`leaveBalances.${leaveType}`] = days;
          user.leaveBalances[leaveType] = days;
        } else {
          updates2[`leaveBalances.${leaveType}`] =
            user.leaveBalances[leaveType] + days;
        }
      }
      if (Object.keys(updates2).length > 0) {
        op.push({
          updateOne: {
            filter: { userId: user.userId },
            update: { $set: updates2 },
          },
        });
      }
    });
  }

  if (op.length > 0) {
    await LeaveModel.bulkWrite(op);
  }
  res.status(200).json({
    success: true,
  });
});

exports.DeleteFile = CatchAsyncError(async (req, res) => {});
