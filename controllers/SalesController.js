const CatchAsyncError = require("../middlewares/CatchAsyncError");
const EventModel = require("../models/EventModel");
const ErrorHandler = require("../utils/ErrorHandler");
const ItemModel = require("../models/ItemModel");
const ProposalModel = require("../models/proposalModel");
const PaymentModel = require("../models/paymentModel");
const InvoiceModel = require("../models/InvoiceModel");
const CreditModel = require("../models/CreditNoteModel");
const CustomerModel = require("../models/CustomerModel");
const path = require("path");
const cloudinary = require("../utils/cloudinary");
const moment = require("moment");
const fs = require("fs");
const puppeteer = require("puppeteer");
const paymentModel = require("../models/paymentModel");
const { default: mongoose } = require("mongoose");

const browserPromise = puppeteer.launch({
  headless: true,
});
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

exports.addItem = CatchAsyncError(async (req, res, next) => {
  const { title, description, gst, rate, qty, saccode } = req.body;
  try {
    const addItem = await ItemModel.create({
      title,
      description,
      gst,
      rate,
      qty,
      saccode,
    });
    if (!addItem) {
      return next(new ErrorHandler("Error in Adding Item", 400));
    }
    res.status(200).json({ success: true, message: "Item Added Successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ErrorHandler("Enter New SAC code", 500));
    }
    return next(new ErrorHandler("Faild to Add item", 500));
  }
});
exports.updateItem = CatchAsyncError(async (req, res, next) => {
  const { itemId } = req.params;
  try {
    const update = await ItemModel.findByIdAndUpdate(itemId, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Item Updated Successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ErrorHandler("Enter New SAC code", 500));
    }
    return next(new ErrorHandler("Faild to Add item", 500));
  }
});
exports.deleteItem=CatchAsyncError(async(req,res,next)=>{
  const {itemId}=req.params;
  try{
     const del = await ItemModel.findByIdAndDelete(itemId)
     res.status(200).json({
      success: true,
      message: "Item Delete Successfully",
    });
  }
  catch(e){
    return next(new ErrorHandler("Failed to Delete Item", 500));
  }
})

exports.importItem = async (req, res, next) => {
  const items = req.body;

  try {
    if (!items || items.length === 0) {
      return next(new ErrorHandler("No Items Found", 400));
    }

    const itemsImport = await ItemModel.insertMany(items);

    if (itemsImport) {
      res
        .status(200)
        .json({ success: true, message: "Items Imported Successfully" });
    }
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Failed to Import Items", 500));
  }
};

exports.addCustomer = CatchAsyncError(async (req, res, next) => {
  const {
    companyName,
    gstNo,
    contact,
    assigned,
    mobile,
    email,
    billing,
    shipping,
  } = req.body;

  try {
    const addCustom = await CustomerModel.create({
      companyName,
      gstNo,
      contact,
      assigned,
      mobile,
      email,
      active: true,
      billing,
      shipping,
    });

    if (!addCustom) {
      return next(new ErrorHandler("Error in Adding Customer", 400));
    }

    res
      .status(200)
      .json({ success: true, message: "Customer Added Successfully" });
  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      return res.status(400).json({
        success: false,
        message: `Duplicate entry: ${field} "${value}" already exists`,
      });
    }

    return next(new ErrorHandler("Failed to Add Customer", 500));
  }
});

exports.editCustomer = CatchAsyncError(async (req, res, next) => {
  const {
    id,
    companyName,
    gstNo,
    contact,
    mobile,
    email,
    billing,
    shipping,
    assigned,
  } = req.body;

  try {
    const editCustom = await CustomerModel.findByIdAndUpdate(
      { _id: id },
      {
        companyName,
        gstNo,
        contact,
        mobile,
        email,
        billing,
        shipping,
        assigned,
      },
      { new: true, upsert: true }
    );
    if (!editCustom) {
      return next(new ErrorHandler("Error in updating Customer", 400));
    }
    res
      .status(200)
      .json({ success: true, message: "Customer Updated Successfully" });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Failed to updating Customer", 500));
  }
});

exports.editCustomerAddress = CatchAsyncError(async (req, res, next) => {
  const { id, billing, shipping } = req.body;

  try {
    const editCustom = await CustomerModel.findByIdAndUpdate(
      { _id: id },
      { billing, shipping },
      { new: true, upsert: true }
    );
    if (!editCustom) {
      return next(new ErrorHandler("Error in updating Customer", 400));
    }
    res
      .status(200)
      .json({ success: true, message: "Customer Updated Successfully" });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Failed to updating Customer", 500));
  }
});

exports.deleteCustomer = CatchAsyncError(async (req, res, next) => {
  const { deleteId } = req.body;
  try {
    const customers = await CustomerModel.findByIdAndDelete({ _id: deleteId });
    if (!customers) {
      return next(new ErrorHandler("Unable to Delete Customer", 400));
    }
    res.status(200).json({ success: true, customers });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Failed to Delete Customer", 500));
  }
});
exports.getAllCustomer = CatchAsyncError(async (req, res, next) => {
  let proposalNo = 1;

  const totalInvoice = await ProposalModel.countDocuments();
  const lastDocument = await ProposalModel.findOne({}).sort({ _id: -1 });

  let result = lastDocument
    ? parseInt(lastDocument.proposalNo.split("-")[1])
    : 0;
  if (totalInvoice) {
    proposalNo = result + 1;
  }
  if (proposalNo.toString().length === 1) {
    proposalNo = `0${proposalNo}`;
  }
  const customers = await CustomerModel.find();
  if (!customers) {
    return next(new ErrorHandler("No Items Found", 404));
  }
  res.status(200).json({ success: true, customers, proposalNo });
});

exports.addProposal = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    const fileName = `${data.values.proposalNo}.pdf`;
    let message =
      data.values.mode === "add"
        ? "Proposal Saved Successfully"
        : "Proposal Updated Successfully";
    const pdfDirectory = path.join(__dirname, "../pdfs");
    ensureDirectoryExists(pdfDirectory);
    const filePath = path.join(pdfDirectory, fileName);

    await saveProposal(data, fileName, filePath);

    res.status(200).json({ message, success: true });
  } catch (error) {
    console.error("Failed to generate and save PDF:", error);
    res.status(500).json({ error: "Failed to generate and save PDF" });
  }
});

exports.addInvoice = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    const fileName = `${data.values.invoiceNo}.pdf`;
    let message =
      data.values.mode === "add"
        ? "Invoice Saved Successfully"
        : "Invoice Updated Successfully";
    const pdfDirectory = path.join(__dirname, "../invoice");
    await ensureDirectoryExists(pdfDirectory);
    const filePath = path.join(pdfDirectory, fileName);

    await saveInvoice(data, fileName, filePath);

    res.status(200).json({ message, success: true });
  } catch (error) {
    console.error("Failed to generate and save PDF:", error);
    res.status(500).json({ error: "Failed to generate and save PDF" });
  }
});
exports.cloneInvoice = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;

    const {
      taxes,
      rows,
      values,
      companyAddress,
      billingAddress,
      shippingAddress,
    } = data;
    const { _id, ...rest } = values;

    const lastDoc = await InvoiceModel.find().sort({ _id: -1 });
    let invoiceNo = 1;
    if (lastDoc.length > 0) {
      const lastInvoiceNo = lastDoc[0].invoiceNo.split("-")[1];
      invoiceNo = parseInt(lastInvoiceNo) + 1;
      if (invoiceNo.toString().length === 1) {
        invoiceNo = `0${invoiceNo}`;
      }
    }
    const newTransaction = new InvoiceModel({
      ...rest,
      invoiceNo: `INV-${invoiceNo}`,
      total: values.amountDue,
      companyAddress,
      billingAddress,
      shippingAddress,
      rows,
      taxes,
    });
    await newTransaction.save();

    res
      .status(200)
      .json({ message: "Invoice Saved Successfully", success: true });
  } catch (error) {
    console.error("Failed to generate and save PDF:", error);
    res.status(500).json({ error: "Failed to generate and save PDF" });
  }
});
exports.addCredit = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    const fileName = `${data.values.creditNo}.pdf`;
    let message =
      data.values.mode === "add"
        ? "Credit Note Saved Successfully"
        : "Credit Note Updated Successfully";
    const pdfDirectory = path.join(__dirname, "../creditnote");
    await ensureDirectoryExists(pdfDirectory);
    const filePath = path.join(pdfDirectory, fileName);

    await saveCredit(data, fileName, filePath);

    res.status(200).json({ message, success: true });
  } catch (error) {
    console.error("Failed to generate and save PDF:", error);
    res.status(500).json({ error: "Failed to generate and save PDF" });
  }
});
exports.addPayment = CatchAsyncError(async (req, res, next) => {
  try {
    const { invoiceNo, client, paymentMode, date, amount, note } = req.body;
    const getInvoice = await InvoiceModel.findOne({ invoiceNo });
    let status;
    let amountDue = parseFloat(getInvoice.amountDue) - parseFloat(amount);
    let totalPaid = parseFloat(getInvoice.totalPaid) + parseFloat(amount);
    if (parseFloat(amountDue) === 0) {
      status = "unpaid";
    } else if (parseFloat(amountDue) === parseFloat(getInvoice.total)) {
      status = "paid";
    } else {
      status = "partially-paid";
    }
    const updateInvoice = await InvoiceModel.findOneAndUpdate(
      { invoiceNo },
      {
        totalPaid: totalPaid.toFixed(2),
        amountDue: amountDue.toFixed(2),
        status,
      }
    );
    const addPayment = await PaymentModel.create({
      invoiceNo,
      client,
      paymentMode,
      date,
      amount,
      note,
    });

    if (addPayment)
      res
        .status(200)
        .json({ message: "Payment Added Successfully", success: true });
  } catch (error) {
    console.error("Failed to generate and save PDF:", error);
    res.status(500).json({ error: "Failed to generate and save PDF" });
  }
});

exports.editPayment = async (req, res) => {
  const { _id, invoiceNo, client, paymentMode, date, note, amount } = req.body;

  try {
    const data = { invoiceNo, client, paymentMode, date, note, amount };
    const [getTrans, getPayment, getPayments] = await Promise.all([
      InvoiceModel.findOne({ invoiceNo }),
      PaymentModel.findById(_id),
      PaymentModel.find({ invoiceNo }),
    ]);

    const otherPayments = getPayments.filter(
      (p) => p._id.toString() !== _id.toString()
    );
    const editAmt = parseFloat(getPayment.amount);
    const newAmt = parseFloat(amount);

    const amtVal = otherPayments.reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    );

    const amt = (amtVal + newAmt).toFixed(2);
    const checkamountDue = (getTrans.total - amt).toFixed(2);
    const status =
      checkamountDue == 0
        ? "paid"
        : checkamountDue < parseFloat(getTrans.total)
        ? "partially-paid"
        : "unpaid";

    await Promise.all([
      InvoiceModel.findOneAndUpdate(
        { invoiceNo },
        { status, totalPaid: amt, amountDue: checkamountDue },
        { new: true, upsert: true }
      ),
      PaymentModel.findOneAndUpdate({ _id }, data, { new: true, upsert: true }),
    ]);

    res.status(201).json({
      success: true,
      message: "Payment Updated Successfully",
    });
  } catch (error) {
    console.error("Failed to update payment:", error);
    res.status(500).json({ error: "Failed to update payment", error });
  }
};

exports.getProposalPDF = CatchAsyncError(async (req, res, next) => {
  try {
    const { pdf, proposalNo } = req.body;
    const fileName = `${proposalNo}.pdf`;

    const pdfBuffer = await getPDF(pdf);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    res.end(pdfBuffer);
  } catch (error) {
    console.error("Failed to generate and save PDF:", error);
    res.status(500).json({ error: "Failed to generate and save PDF" });
  }
});

exports.deletePayment = async (req, res) => {
  try {
    const { id, invoiceNo } = req.query;
    console.log(req.query);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const historyDetails = await PaymentModel.findById({ _id: id });
    const getTrans = await InvoiceModel.findOne({
      invoiceNo,
    });
    const amount = historyDetails.amount;
    const addTotalPaid = (
      parseFloat(getTrans.totalPaid) - parseFloat(amount)
    ).toFixed(2);
    const checkamountDue = (
      parseFloat(getTrans.amountDue) + parseFloat(amount)
    ).toFixed(2);
    let status;
    if (checkamountDue == 0.0) {
      status = "Paid";
    } else if (parseFloat(getTrans.total).toFixed(2) > checkamountDue) {
      status = "Half-Paid";
    } else {
      status = "Unpaid";
    }

    const updateTrans = await InvoiceModel.findOneAndUpdate(
      { invoiceNo: historyDetails.invoiceNo },
      {
        totalPaid: addTotalPaid,
        amountDue: checkamountDue,
        status,
      },
      { new: true, upsert: true }
    );
    const historyDeleted = await PaymentModel.findByIdAndDelete({ _id: id });

    if (!historyDeleted) {
      return res.status(404).json({
        message: "Delete is not completed: No transaction found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment Deleted Successfully",
      historyDeleted,
    });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred while deleting the history",
      error: err.message,
    });
  }
};

exports.getAllProposal = CatchAsyncError(async (req, res, next) => {
  try {
    const proposals = await ProposalModel.find();

    if (!proposals || proposals.length === 0) {
      return res.status(200).json({ success: true, proposals: [] });
    }

    const today = moment();

    const updatedProposals = await Promise.all(
      proposals.map(async (item) => {
        const endDate = moment(item.opentill);
        const status = (item.status || "").toLowerCase();

        if (
          endDate.isBefore(today, "day") &&
          status !== "accepted" &&
          status !== "declined"
        ) {
          item.status = "expired";
          await item.save(); // persist the status update
        }

        const { pdfurl, ...rest } = item._doc;

        return {
          ...rest,
          client: item.clientAddress?.client || "",
        };
      })
    );

    res.status(200).json({ success: true, proposals: updatedProposals });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Failed to get Proposals", 500));
  }
});

exports.getAllInvoice = CatchAsyncError(async (req, res, next) => {
  try {
    const invoices = await InvoiceModel.find();

    if (!invoices || invoices.length === 0) {
      return res.status(200).json({ success: true, invoices: [] });
    }

    const today = moment();

    const updatedInvoices = await Promise.all(
      invoices.map(async (item) => {
        const endDate = moment(item.dueDate);
        const status = (item.status || "").toLowerCase();

        if (endDate.isBefore(today, "day")) {
          item.status = "overDue";
          await item.save();
        }

        const { pdfurl, ...rest } = item._doc;

        return {
          ...rest,
          client: item.billingAddress?.name || "",
        };
      })
    );

    res.status(200).json({ success: true, invoices: updatedInvoices });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Failed to get Proposals", 500));
  }
});
exports.getPaymentByInvoice = CatchAsyncError(async (req, res, next) => {
  try {
    const { invoiceNo } = req.query;

    const payments = await PaymentModel.find({ invoiceNo });

    res.status(200).json({ success: true, payments });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Failed to get Proposals", 500));
  }
});

exports.editRefund = CatchAsyncError(async (req, res, next) => {
  try {
    const { _id, creditNo, date, paymentMode, amount, note, refNo } = req.body;

    // Ensure _id is treated as an ObjectId
    const refundId = new mongoose.Types.ObjectId(_id);

    // Get the credit note and refund entry
    const getCredit = await CreditModel.findOne(
      { creditNo, "refunds._id": refundId },
      { "refunds.$": 1, totalPaid: 1, amountDue: 1 }
    );

    if (!getCredit || !getCredit.refunds || getCredit.refunds.length === 0) {
      return next(new ErrorHandler("Refund entry not found", 404));
    }

    const refundData = getCredit.refunds[0];
    const oldAmount = parseFloat(refundData.amount);
    const newAmount = parseFloat(amount);

    const updatedTotalPaid =
      parseFloat(getCredit.totalPaid) - oldAmount + newAmount;
    const updatedAmountDue =
      parseFloat(getCredit.amountDue) + oldAmount - newAmount;

    // Update the credit note
    const updatedCredit = await CreditModel.findOneAndUpdate(
      { creditNo },
      {
        $set: {
          totalPaid: updatedTotalPaid.toFixed(2),
          amountDue: updatedAmountDue.toFixed(2),
        },
        $pull: {
          refunds: { _id: refundId },
        },
      },
      { new: true }
    );

    // Push the new refund entry
    updatedCredit.refunds.push({
      date,
      paymentMode,
      amount,
      note,
      refNo,
    });

    await updatedCredit.save();

    res
      .status(200)
      .json({ success: true, message: "Refund Updated Successfully" });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Failed to update refund", 500));
  }
});

exports.deleteCredits = CatchAsyncError(async (req, res, next) => {
  try {
    const { invoiceNo, _id, amount, creditNo } = req.query;

    const getCredit = await CreditModel.findOne({ creditNo });
    const getInvoice = await InvoiceModel.findOne({ invoiceNo });

    if (!getCredit || !getInvoice) {
      return next(new ErrorHandler("Credit Note or Invoice not found", 404));
    }

    // 1. Update totalPaid and amountDue
    const totalPaid = parseFloat(getCredit.totalPaid) - parseFloat(amount);
    const amountDue = parseFloat(getCredit.amountDue) + parseFloat(amount);

    // 2. Update credits in InvoiceModel
    const credits = parseFloat(getInvoice.credits) - parseFloat(amount);
    await InvoiceModel.findOneAndUpdate(
      { invoiceNo },
      { credits: credits.toFixed(2) },
      { new: true, upsert: true }
    );

    // 3. Remove the specific credit entry from the credits array in CreditModel
    const updateCredit = await CreditModel.findOneAndUpdate(
      { creditNo },
      {
        $set: {
          totalPaid: totalPaid.toFixed(2),
          amountDue: amountDue.toFixed(2),
        },
        $pull: {
          credits: {
            _id: _id, // assuming _id of the subdocument
            invoiceNo: invoiceNo, // double-safety
          },
        },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, message: "Credits Deleted Successfully" });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Failed to delete credit", 500));
  }
});

exports.deleteRefunds = CatchAsyncError(async (req, res, next) => {
  try {
    const { _id, amount, creditNo } = req.query;

    const getCredit = await CreditModel.findOne({ creditNo });

    if (!getCredit) {
      return next(new ErrorHandler("Credit Note not found", 404));
    }

    const totalPaid = parseFloat(getCredit.totalPaid) - parseFloat(amount);
    const amountDue = parseFloat(getCredit.amountDue) + parseFloat(amount);
    const refund = parseFloat(getCredit.refund) - parseFloat(amount);

    const updateCredit = await CreditModel.findOneAndUpdate(
      { creditNo },
      {
        $set: {
          totalPaid: totalPaid.toFixed(2),
          amountDue: amountDue.toFixed(2),
          refund: refund.toFixed(2),
        },
        $pull: {
          refunds: {
            _id: _id,
          },
        },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, message: "Refunds Deleted Successfully" });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Failed to delete refund", 500));
  }
});

exports.getPaymentByInvoice = CatchAsyncError(async (req, res, next) => {
  try {
    const { invoiceNo } = req.query;

    const payments = await PaymentModel.find({ invoiceNo });

    res.status(200).json({ success: true, payments });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Failed to get Proposals", 500));
  }
});

async function updateInvoiceCredits(creditData) {
  const invoiceNos = creditData.credits.map((entry) => entry.invoiceNo);

  const invoices = await InvoiceModel.find({
    invoiceNo: { $in: invoiceNos },
  });

  const updates = invoices
    .map((invoice) => {
      const match = creditData.credits.find(
        (entry) => entry.invoiceNo === invoice.invoiceNo
      );
      if (match) {
        const newCredits = parseFloat(match.amount || 0);
        const existingCredits = parseFloat(invoice.credits || 0);
        console.log(newCredits, "New Credits");
        console.log(existingCredits, "Existing Credits");
        const totalCredits = existingCredits + newCredits;

        return {
          updateOne: {
            filter: { invoiceNo: invoice.invoiceNo },
            update: {
              $set: {
                credits: totalCredits.toFixed(2), // or keep as number
              },
            },
          },
        };
      }

      return null;
    })
    .filter(Boolean); // remove nulls

  if (updates.length > 0) {
    await InvoiceModel.bulkWrite(updates);
  }

  return { updated: updates.length };
}

exports.applyCredits = CatchAsyncError(async (req, res, next) => {
  try {
    const { credits: newCredits, applied, creditNo } = req.body;
    let status = "open";
    const getCreditNote = await CreditModel.findOne({ creditNo });
    if (!getCreditNote) {
      return next(new ErrorHandler("No Credit Note Found", 404));
    }
    const existingCredits = getCreditNote.credits || [];

    const mergedCredits = [...existingCredits];

    newCredits.forEach((newCredit) => {
      const index = mergedCredits.findIndex(
        (c) => c.invoiceNo === newCredit.invoiceNo
      );

      if (index !== -1) {
        // Add to existing credit
        const existingAmount = parseFloat(mergedCredits[index].amount || 0);
        const newAmount = parseFloat(newCredit.amount || 0);
        mergedCredits[index].amount = (existingAmount + newAmount).toFixed(2);
        mergedCredits[index].date = newCredit.date; // optionally update date
      } else {
        // Add new entry
        mergedCredits.push({ ...newCredit });
      }
    });
    const invoices = await InvoiceModel.find({
      invoiceNo: { $in: newCredits.map((c) => c.invoiceNo) },
    });
    const totalPaid = parseFloat(getCreditNote.totalPaid) + parseFloat(applied);
    const amountDue = parseFloat(getCreditNote.amountDue) - parseFloat(applied);
    const updatedModel = await updateInvoiceCredits({ credits: newCredits });
    if (amountDue === 0) status = "closed";
    const updateCreditNote = await CreditModel.findOneAndUpdate(
      { creditNo },
      {
        totalPaid: totalPaid.toFixed(2),
        status,
        amountDue: amountDue.toFixed(2),
        credits: mergedCredits,
      },
      { new: true, upsert: true }
    );
    if (updatedModel && updateCreditNote)
      res
        .status(200)
        .json({ success: true, message: "Credits Applied to Invoices" });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Failed to get Proposals", 500));
  }
});
exports.addRefund = CatchAsyncError(async (req, res, next) => {
  try {
    const { creditNo, amount, date, paymentMode, refNo, note } = req.body;

    // Prepare the refund object
    const refundEntry = {
      amount,
      date,
      paymentMode,
      refNo,
      note,
    };
    const getCreditNote = await CreditModel.findOne({ creditNo });
    const totalPaid = parseFloat(getCreditNote.totalPaid) + parseFloat(amount);
    const amountDue = parseFloat(getCreditNote.amountDue) - parseFloat(amount);
    const totalRefund = parseFloat(getCreditNote.refund) + parseFloat(amount);
    // Push the refund entry into the refund array
    const updatedCreditNote = await CreditModel.findOneAndUpdate(
      { creditNo },
      {
        $push: { refunds: refundEntry },
        $set: { refund: totalRefund.toFixed(2), totalPaid, amountDue },
      },
      { new: true }
    );

    if (!updatedCreditNote) {
      return next(new ErrorHandler("Credit Note not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Refund added successfully",
      data: updatedCreditNote,
    });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Failed to add refund", 500));
  }
});

exports.getAllInvoice = CatchAsyncError(async (req, res, next) => {
  try {
    const invoices = await InvoiceModel.find();

    if (!invoices || invoices.length === 0) {
      return res.status(200).json({ success: true, invoices: [] });
    }

    const today = moment();

    const updatedInvoices = await Promise.all(
      invoices.map(async (item) => {
        const endDate = moment(item.dueDate);
        const status = (item.status || "").toLowerCase();

        if (endDate.isBefore(today, "day")) {
          item.status = "overDue";
          await item.save();
        }

        const { pdfurl, ...rest } = item._doc;

        return {
          ...rest,
          client: item.billingAddress?.name || "",
        };
      })
    );

    res.status(200).json({ success: true, invoices: updatedInvoices });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Failed to get Proposals", 500));
  }
});
exports.getAllCredits = CatchAsyncError(async (req, res, next) => {
  try {
    const credits = await CreditModel.find();

    if (!credits || credits.length === 0) {
      return res.status(200).json({ success: true, credits: [] });
    }

    const today = moment();

    res.status(200).json({ success: true, credits });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Failed to get Proposals", 500));
  }
});

exports.getAllPayment = CatchAsyncError(async (req, res, next) => {
  try {
    const payments = await PaymentModel.find();

    if (!payments || payments.length === 0) {
      return res.status(200).json({ success: true, payments: [] });
    } else {
      res.status(200).json({ success: true, payments });
    }
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Failed to get Proposals", 500));
  }
});
exports.updateProposal = CatchAsyncError(async (req, res, next) => {
  try {
    const { firstName, lastName, id, status, email, mobile } = req.body;
    const proposals = await ProposalModel.findOne({
      _id: id,
      "clientAddress.mobile": mobile,
      "clientAddress.email": email,
    });
    if (!proposals) {
      return next(new ErrorHandler("No Proposal Found", 404));
    } else {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "crm",
      });
      const updateproposal = await ProposalModel.findByIdAndUpdate(
        { _id: id },
        { image: result.secure_url, status },
        { new: true, upsert: true }
      );
      if (updateproposal)
        res.status(200).json({
          success: true,
          message: "Proposal Updated Successfully",
          status,
        });
    }
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Failed to get Proposals", 500));
  }
});
exports.deleteProposal = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.query;
    const proposals = await ProposalModel.findByIdAndDelete({
      _id: id,
    });
    if (!proposals) {
      return next(new ErrorHandler("No Proposal Found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Proposal Deleted Successfully",
    });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Failed to get Proposals", 500));
  }
});

exports.deleteInvoice = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.query;
    const invoice = await InvoiceModel.findByIdAndDelete({
      _id: id,
    });
    if (!invoice) {
      return next(new ErrorHandler("No Invoice Found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Invoice Deleted Successfully",
    });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Failed to get Invoices", 500));
  }
});
exports.deleteCredit = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.query;
    const invoice = await InvoiceModel.findByIdAndDelete({
      _id: id,
    });
    if (!invoice) {
      return next(new ErrorHandler("No Invoice Found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Credit Note Deleted Successfully",
    });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Failed to get Invoices", 500));
  }
});
exports.declineProposal = CatchAsyncError(async (req, res, next) => {
  try {
    const { id, status } = req.body;
    const updateproposal = await ProposalModel.findByIdAndUpdate(
      { _id: id },
      { status },
      { new: true, upsert: true }
    );
    if (updateproposal)
      res.status(200).json({
        success: true,
        message: "Proposal Updated Successfully",
        status,
      });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Failed to get Proposals", 500));
  }
});

exports.editActive = CatchAsyncError(async (req, res, next) => {
  const { id, active } = req.body;
  try {
    const customers = await CustomerModel.findByIdAndUpdate(
      { _id: id },
      { active: active }
    );
    if (!customers) {
      return next(new ErrorHandler("Error in Edit Cutomer", 400));
    }
    res.status(200).json({ success: true, message: "Customer Updated" });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Failed to Update Customer", 500));
  }
});
exports.getAllItem = CatchAsyncError(async (req, res, next) => {
  const items = await ItemModel.find();
  if (!items) {
    return next(new ErrorHandler("No Items Found", 404));
  }
  res.status(200).json({ success: true, items });
});

const saveProposal = async (data, fileName, filePath) => {
  const { taxes, rows, values, companyAddress, clientAddress, pdf } = data;

  try {
    const browser = await browserPromise;
    const page = await browser.newPage();
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
       <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
        <title>Invoice</title>
        <style>
          /* Minimized CSS for Tailwind styling and watermarks */
          body { font-family: 'Outfit', sans-serif; }
          .thead {
            padding:8px 8px;
            font-size: 0.875rem;
            line-height: 1.25rem;
            text-align: left;
            font-weight: 500;
          }
            .summary-section {
            padding: 0 !important;
            margin: 0 !important;
            line-height: 1.2 !important; /* Adjust as needed */
          }

          .no-pad {
            padding: 0 !important;
            margin: 0 !important;
          }
          .thead1 {
             font-size: 0.875rem;
            line-height: 1.25rem;
            text-align: left;
            font-weight: 500;
            padding-left: 0.75rem;
          }
          thead {
            display: table-header-group; /* Ensures header repeats */
          }

          tbody {
            display: table-row-group;
          }
          .hidden-in-pdf { display: none !important; }
         tbody {
          page-break-inside: auto !important;
        }
          tr, td, th {
            page-break-inside: auto !important;
            break-inside: auto !important;
          }
          .total {
          display:flex;
          justify-content: space-between;
          align-items: center;
          width:100%;
          }
          .subtotal {
           display:flex;
           flex-direction: column;
           align-items: flex-end;
           text-align: right;
          }
           .summary-section {
            page-break-inside: auto !important; /* Allow breaking inside this block */
            break-inside: auto !important;
          }
           .gst{
           display:flex;
           align-items:center;
           }
        </style>
      </head>
      <body>${pdf}</body>
    </html>`;
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "10mm", right: "10mm" },
    });

    await page.close();
    if (values.mode === "add") {
      const newTransaction = new ProposalModel({
        ...values,
        pdfurl: fileName,
        companyAddress,
        clientAddress,
        rows,
        taxes,
      });
      await newTransaction.save();
    } else {
      const updateTransaction = await ProposalModel.findOneAndUpdate(
        { proposalNo: values.proposalNo },
        {
          ...values,
          pdfurl: fileName,
          companyAddress,
          clientAddress,
          rows,
          taxes,
        },
        { new: true, upsert: true }
      );
    }
  } catch (error) {
    console.error("Error in saving proposal:", error);
    throw error;
  }
};
const saveInvoice = async (data, fileName, filePath) => {
  const {
    taxes,
    rows,
    values,
    companyAddress,
    billingAddress,
    shippingAddress,
    pdf,
  } = data;

  try {
    const browser = await browserPromise;
    const page = await browser.newPage();
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
       <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
        <title>Invoice</title>
        <style>
          /* Minimized CSS for Tailwind styling and watermarks */
          body { font-family: 'Outfit', sans-serif; }
          .thead {
            padding:8px 8px;
            font-size: 0.875rem;
            line-height: 1.25rem;
            text-align: left;
            font-weight: 500;
          }
            .summary-section {
            padding: 0 !important;
            margin: 0 !important;
            line-height: 1.2 !important; /* Adjust as needed */
          }

          .no-pad {
            padding: 0 !important;
            margin: 0 !important;
          }
          .thead1 {
            font-size: 0.875rem;
            line-height: 1.25rem;
            text-align: left;
            font-weight: 500;
            padding-left: 0.75rem;
          }
          thead {
            display: table-header-group; /* Ensures header repeats */
          }

          tbody {
            display: table-row-group;
          }
          .hidden-in-pdf { display: none !important; }
         tbody {
          page-break-inside: auto !important;
        }
          tr, td, th {
            page-break-inside: auto !important;
            break-inside: auto !important;
          }
          .total {
          display:flex;
          justify-content: space-between;
          align-items: center;
          width:100%;
          }
          .subtotal {
           display:flex;
           flex-direction: column;
           align-items: flex-end;
           text-align: right;
          }
           .summary-section {
            page-break-inside: auto !important; /* Allow breaking inside this block */
            break-inside: auto !important;
          }
           .gst{
           display:flex;
           align-items:center;
           }
        </style>
      </head>
      <body>${pdf}</body>
    </html>`;
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "10mm", right: "10mm" },
    });

    await page.close();
    if (values.mode === "add") {
      const newTransaction = new InvoiceModel({
        ...values,
        pdfurl: fileName,
        companyAddress,
        billingAddress,
        shippingAddress,
        rows,
        taxes,
      });
      await newTransaction.save();
    } else {
      const updateTransaction = await InvoiceModel.findOneAndUpdate(
        { invoiceNo: values.invoiceNo },
        {
          ...values,
          pdfurl: fileName,
          companyAddress,
          billingAddress,
          shippingAddress,
          rows,
          taxes,
        },
        { new: true, upsert: true }
      );
    }
  } catch (error) {
    console.error("Error in saving proposal:", error);
    throw error;
  }
};
const saveCredit = async (data, fileName, filePath) => {
  const {
    taxes,
    rows,
    values,
    companyAddress,
    billingAddress,
    shippingAddress,
    pdf,
  } = data;

  try {
    const browser = await browserPromise;
    const page = await browser.newPage();
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
       <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
        <title>Invoice</title>
        <style>
          /* Minimized CSS for Tailwind styling and watermarks */
          body { font-family: 'Outfit', sans-serif; }
          .thead {
            padding:8px 8px;
            font-size: 0.875rem;
            line-height: 1.25rem;
            text-align: left;
            font-weight: 500;
          }
            .summary-section {
            padding: 0 !important;
            margin: 0 !important;
            line-height: 1.2 !important; /* Adjust as needed */
          }

          .no-pad {
            padding: 0 !important;
            margin: 0 !important;
          }
          .thead1 {
            font-size: 0.875rem;
            line-height: 1.25rem;
            text-align: left;
            font-weight: 500;
            padding-left: 0.75rem;
          }
          thead {
            display: table-header-group; /* Ensures header repeats */
          }

          tbody {
            display: table-row-group;
          }
          .hidden-in-pdf { display: none !important; }
         tbody {
          page-break-inside: auto !important;
        }
          tr, td, th {
            page-break-inside: auto !important;
            break-inside: auto !important;
          }
          .total {
          display:flex;
          justify-content: space-between;
          align-items: center;
          width:100%;
          }
          .subtotal {
           display:flex;
           flex-direction: column;
           align-items: flex-end;
           text-align: right;
          }
           .summary-section {
            page-break-inside: auto !important; /* Allow breaking inside this block */
            break-inside: auto !important;
          }
           .gst{
           display:flex;
           align-items:center;
           }
        </style>
      </head>
      <body>${pdf}</body>
    </html>`;
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "10mm", right: "10mm" },
    });

    await page.close();
    const invoice = await InvoiceModel.findOne({
      invoiceNo: values.invoiceNo,
    });
    if (values.mode === "add") {
      const newTransaction = new CreditModel({
        ...values,
        invoiceDate: invoice ? invoice.date : "",
        pdfurl: fileName,
        companyAddress,
        billingAddress,
        shippingAddress,
        rows,
        taxes,
      });
      await newTransaction.save();
    } else {
      const updateTransaction = await CreditModel.findOneAndUpdate(
        { creditNo: values.creditNo },
        {
          ...values,
          pdfurl: fileName,
          companyAddress,
          billingAddress,
          shippingAddress,
          rows,
          taxes,
        },
        { new: true, upsert: true }
      );
    }
  } catch (error) {
    console.error("Error in saving proposal:", error);
    throw error;
  }
};

const getPDF = async (pdf) => {
  try {
    const browser = await browserPromise;
    const page = await browser.newPage();
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
       <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
        <title>Invoice</title>
        <style>
          /* Minimized CSS for Tailwind styling and watermarks */
          body { font-family: 'Outfit', sans-serif; }
          .thead {
            padding:8px 8px;
            font-size: 0.875rem;
            line-height: 1.25rem;
            text-align: left;
            font-weight: 500;
          }
            .hidden-in-pdf { display: none !important; }
            .summary-section {
            padding: 0 !important;
            margin: 0 !important;
            line-height: 1.2 !important; /* Adjust as needed */
          }

          .no-pad {
            padding: 0 !important;
            margin: 0 !important;
          }
          .thead1 {
             font-size: 0.875rem;
            line-height: 1.25rem;
            text-align: left;
            font-weight: 500;
            padding-left: 0.75rem;
          }
          thead {
            display: table-header-group; /* Ensures header repeats */
          }

          tbody {
            display: table-row-group;
          }

         tbody {
          page-break-inside: auto !important;
        }
          tr, td, th {
            page-break-inside: auto !important;
            break-inside: auto !important;
          }
          .total {
          display:flex;
          justify-content: space-between;
          align-items: center;
          width:100%;
          }
          .subtotal {
           display:flex;
           flex-direction: column;
           align-items: flex-end;
           text-align: right;
          }
           .summary-section {
            page-break-inside: auto !important; /* Allow breaking inside this block */
            break-inside: auto !important;
          }
           .gst{
           display:flex;
           align-items:center;
           }
        </style>
      </head>
      <body>${pdf}</body>
    </html>`;
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "10mm", right: "10mm" },
    });

    await page.close();
    return pdfBuffer;
  } catch (error) {
    console.error("Error in saving proposal:", error);
    throw error;
  }
};
