const CatchAsyncError = require("../middlewares/CatchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const Expense = require("../models/ExpenseModel");

exports.getExpense = CatchAsyncError(async (req, res) => {
  const expense = await Expense.find();
  res.status(200).json({ expense });
});

exports.postExpense = CatchAsyncError(async (req, res) => {
  const {
    expensecategory,
    expensename,
    date,
    amount,
    invoice,
    project,
    customer,
    currency,
    paymentmode,
    tax1,
    tax2,
    repeatevery,
    description,
    customRepeatInterval,
    customRepeatUnit,
    totalCycle,
    infinity,
  } = req.body;
  const { userId, username } = req.query;
  const filePath = req.file ? `${req.protocol}://${req.get("host")}/${req.file.path.replace("\\", "/")}` : "";

  const expense = await Expense.create({
    userId,
    username,
    expensecategory,
    expensename,
    date,
    amount,
    invoice,
    project,
    customer,
    currency,
    paymentmode,
    tax1,
    tax2,
    repeatevery,
    description,
    customRepeatInterval,
    customRepeatUnit,
    totalCycle,
    infinity,
    uploadFile: filePath,
  });
  await expense.save();
  res.status(200).json({
    message: "Expense created successfully",
    expense,
  });
});

exports.updateExpense = CatchAsyncError(async (req, res) => {
  const {
    expensecategory,
    expensename,
    date,
    amount,
    invoice,
    project,
    customer,
    currency,
    paymentmode,
    tax1,
    tax2,
    repeatevery,
    description,
    customRepeatInterval,
    customRepeatUnit,
    totalCycle,
    infinity,
    existingFileName,
  } = req.body;

  const { id } = req.query;
  console.log(req.file,req.file?.filename,'filanem')
  const filePath = req.file ? `${req.protocol}://${req.get("host")}/${req.file.path.replace("\\", "/")}` : "";

  const updateexpense = {
    expensecategory,
    expensename,
    date,
    amount,
    invoice,
    project,
    customer,
    currency,
    paymentmode,
    tax1,
    tax2,
    repeatevery,
    description,
    customRepeatInterval,
    customRepeatUnit,
    totalCycle,
    infinity,
    uploadFile: req.file ? filePath : existingFileName || null,
  };

  const expense = await Expense.findByIdAndUpdate(id, updateexpense, {
    new: true,
  });

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  res.status(200).json({
    message: "Expense updated successfully",
    expense,
  });
});

exports.deleteExpense = CatchAsyncError(async (req, res) => {
  const { userId, id } = req.query;

  const expense = await Expense.findByIdAndDelete(id);

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  res.status(200).json({
    message: "Expense deleted successfully",
  });
});