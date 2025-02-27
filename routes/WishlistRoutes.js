const WishlistRouter = require("express").Router()

const { verifyBoth } = require("../middleware/authentication")
const { } = require("../middleware/fileUploader")

const { createRecord, getRecord, getSingleRecord, deleteRecord } = require("../controllers/WishlistController")

WishlistRouter.post("", verifyBoth, createRecord)
WishlistRouter.get("/:userid", verifyBoth, getRecord)
WishlistRouter.get("/single/:_id", verifyBoth, getSingleRecord)
WishlistRouter.delete("/:_id", verifyBoth, deleteRecord)

module.exports = WishlistRouter