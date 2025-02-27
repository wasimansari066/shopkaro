const TestimonialRouter = require("express").Router()

const { verifyAdmin } = require("../middleware/authentication")
const { testimonialUploader } = require("../middleware/fileUploader")

const { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord } = require("../controllers/TestimonialController")

TestimonialRouter.post("", verifyAdmin, testimonialUploader.single("pic"), createRecord)
TestimonialRouter.get("", getRecord)
TestimonialRouter.get("/:_id", getSingleRecord)
TestimonialRouter.put("/:_id", verifyAdmin, testimonialUploader.single("pic"), updateRecord)
TestimonialRouter.delete("/:_id", verifyAdmin, deleteRecord)

module.exports = TestimonialRouter