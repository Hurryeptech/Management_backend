const express = require("express");
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const router = express.Router();
const {
  addItem,
  getAllItem,
  importItem,
  addCustomer,
  addProposal,
  addInvoice,
  getAllInvoice,
  updateProposal,
  deleteProposal,
  cloneInvoice,
  deleteInvoice,
  declineProposal,
  addPayment,
  editPayment,
  getAllPayment,
  getAllProposal,
  addCredit,
  deleteCredit,
  getAllCredits,
  deleteRefunds,
  addRefund,
  editRefund,
  applyCredits,
  deleteCredits,
  deletePayment,
  getProposalPDF,
  getPaymentByInvoice,
  editCustomer,
  editCustomerAddress,
  deleteCustomer,
  getAllCustomer,
  editActive,
  updateItem,
  deleteItem,
} = require("../controllers/SalesController");

const {
  updateLead,
  createLead,
  getSingleLead,
  getLead,
} = require("../controllers/LeadController");

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Saving file to:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    console.log("Generating unique filename:", uniqueName);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/admin/addItem", addItem);
router.put("/admin/updateItem/:itemId?",updateItem)
router.delete("/admin/deleteItem/:itemId?",deleteItem)
router.post("/admin/importItem", importItem);
router.get("/admin/getAllItem", getAllItem);

router.post("/admin/addproposal", addProposal);

router.post("/admin/addinvoice", addInvoice);
router.post("/admin/cloneinvoice", cloneInvoice);
router.post("/admin/addcredit", addCredit);
router.post("/admin/applycredits", applyCredits);
router.delete("/admin/deletecredits", deleteCredits);
router.delete("/admin/deleterefunds", deleteRefunds);
router.post("/admin/addrefund", addRefund);
router.post("/admin/addpayment", addPayment);
router.put("/admin/editpayment", editPayment);
router.put("/admin/editrefund", editRefund);

router.post("/admin/updateproposal", upload.single('image'), updateProposal);
router.post("/admin/declineproposal", declineProposal);

router.delete("/admin/deleteproposal", deleteProposal);
router.delete("/admin/deleteinvoice", deleteInvoice);
router.delete("/admin/deletecredit", deleteCredit);
router.delete("/admin/deletepayment", deletePayment);
router.post("/admin/getproposalpdf", getProposalPDF);
router.get("/admin/getallproposal", getAllProposal)
router.get("/admin/getallinvoice", getAllInvoice)
router.get("/admin/getpayments", getPaymentByInvoice)
router.get("/admin/getallcredit", getAllCredits)
router.get("/admin/getallpayment", getAllPayment)

router.post("/admin/addCustomer", addCustomer);
router.put("/admin/editCustomer", editCustomer);
router.put("/admin/editaddress", editCustomerAddress);
router.delete("/admin/deleteCustomer", deleteCustomer);

router.put("/admin/editActive", editActive);
router.get("/admin/getAllCustomer", getAllCustomer);

router.get("/admin/updatelead", updateLead);
router.post("/admin/createlead", createLead);
router.get("/admin/getlead", getSingleLead);
router.get("/admin/getalllead", getLead);
module.exports = router;
