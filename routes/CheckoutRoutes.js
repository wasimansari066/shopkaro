const CheckoutRouter = require("express").Router()

const { verifyAdmin, verifyBoth } = require("../middleware/authentication")
const { } = require("../middleware/fileUploader")

const { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord, getUserRecord, order, verifyOrder } = require("../controllers/CheckoutController")

CheckoutRouter.post("", verifyBoth, createRecord)
CheckoutRouter.get("", verifyAdmin, getRecord)
CheckoutRouter.get("/user/:userid", verifyBoth, getUserRecord)
CheckoutRouter.get("/single/:_id", verifyBoth, getSingleRecord)
CheckoutRouter.put("/:_id", verifyBoth, updateRecord)
CheckoutRouter.delete("/:_id", verifyBoth, deleteRecord)
CheckoutRouter.post("/order", verifyBoth, order)
CheckoutRouter.post("/verify", verifyBoth, verifyOrder)

module.exports = CheckoutRouter