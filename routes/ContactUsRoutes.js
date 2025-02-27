const ContactUsRouter = require("express").Router()

const { verifyAdmin } = require("../middleware/authentication")
const { } = require("../middleware/fileUploader")

const { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord } = require("../controllers/ContactUsController")

ContactUsRouter.post("", createRecord)
ContactUsRouter.get("", verifyAdmin, getRecord)
ContactUsRouter.get("/:_id", verifyAdmin, getSingleRecord)
ContactUsRouter.put("/:_id", verifyAdmin, updateRecord)
ContactUsRouter.delete("/:_id", verifyAdmin, deleteRecord)

module.exports = ContactUsRouter