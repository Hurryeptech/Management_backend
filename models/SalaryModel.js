const mongoose = require("mongoose")

const allowanceSchema = new mongoose.Schema({
    type: { type: String },
    percentage: { type: String },
    amount: { type: String },
});

const salarySchema = new mongoose.Schema({
    employee: {
        type: String,
    },
    employeeName: {
        type: String,
        required: [true, "Please Enter Employee Name"]
    },
    workingDays: {
        type: String,
        required: [true, "Please Enter working days"]
    },
    allowances: [allowanceSchema],
    deductions: [allowanceSchema],
    basicAmount: {
        type: String,
        required: [true, "Please Enter basic amount"]
    },
    sickLeave: {
        type: String,
        required: [true, "Please Enter SL"]
    },
    earnings: {
        type: String,
        required: [true, "Please Enter Earnings"]
    },
    deduction: {
        type: String,
        required: [true, "Please Enter Deductions"]
    },
    netSalary: {
        type: String,
        required: [true, "Please Enter Net Salary"]
    },
    paymentMode: {
        type: String,
        required: [true, "Please Enter Payment Mode"]
    },
    casualLeave: {
        type: String,
        required: [true, "Please Enter CL"]
    },
    paymentDate: {
        type: String,
        required: [true, "Please Enter payment date"]
    },
    salaryMonth: {
        type: String,
        required: [true, "Please Enter salary month"]
    },

})

module.exports = mongoose.model("payroll", salarySchema)