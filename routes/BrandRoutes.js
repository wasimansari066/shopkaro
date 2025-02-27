const BrandRouter = require("express").Router()

const { verifyAdmin } = require("../middleware/authentication")
const { brandUploader } = require("../middleware/fileUploader")

const { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord } = require("../controllers/BrandController")

BrandRouter.post("", verifyAdmin, brandUploader.single("pic"), createRecord)
BrandRouter.get("", getRecord)
BrandRouter.get("/:_id", getSingleRecord)
BrandRouter.put("/:_id", verifyAdmin, brandUploader.single("pic"), updateRecord)
BrandRouter.delete("/:_id", verifyAdmin, deleteRecord)

module.exports = BrandRouter