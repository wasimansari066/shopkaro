const Product = require("../models/Product")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const fs = require("fs")

async function createRecord(req, res) {
    try {
        let data = new Product(req.body)
        if (req.files) {
            data.pic = Array.from(req.files).map((x) => x.path)
        }
        await data.save()
        let finalData = await Product.findOne({ _id: data._id })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
        res.send({
            result: "Done",
            data: finalData
        })
    } catch (error) {

        try {
            Array.from(req.files).forEach((x) => fs.unlinkSync(x.path))
        } catch (error) { }

        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.maincategory ? errorMessage.maincategory = error.errors.maincategory.message : null
        error.errors?.subcategory ? errorMessage.subcategory = error.errors.subcategory.message : null
        error.errors?.brand ? errorMessage.brand = error.errors.brand.message : null
        error.errors?.color ? errorMessage.color = error.errors.color.message : null
        error.errors?.size ? errorMessage.size = error.errors.size.message : null
        error.errors?.basePrice ? errorMessage.basePrice = error.errors.basePrice.message : null
        error.errors?.discount ? errorMessage.discount = error.errors.discount.message : null
        error.errors?.finalPrice ? errorMessage.finalPrice = error.errors.finalPrice.message : null
        error.errors?.stockQuantity ? errorMessage.stockQuantity = error.errors.stockQuantity.message : null
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : null

        if (Object.values(errorMessage).length === 0) {
            res.status(500).send({
                result: "Fail",
                reason: "Internal Server Error"
            })
        }
        else {
            res.status(400).send({
                result: "Fail",
                reason: errorMessage
            })
        }
    }
}

async function getRecord(req, res) {
    try {
        let data = await Product.find().sort({ _id: -1 })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
        res.send({
            result: "Done",
            length: data.length,
            data: data
        })
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await Product.findOne({ _id: req.params._id })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
        if (data) {
            res.send({
                result: "Done",
                data: data
            })
        } else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function updateRecord(req, res) {
    try {
        let data = await Product.findOne({ _id: req.params._id })
        if (data) {
            if (jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY_ADMIN)) {
                data.name = req.body.name ?? data.name
                data.maincategory = req.body.maincategory ?? data.maincategory
                data.subcategory = req.body.subcategory ?? data.subcategory
                data.brand = req.body.brand ?? data.brand
                data.color = req.body.color ?? data.color
                data.size = req.body.size ?? data.size
                data.basePrice = req.body.basePrice ?? data.basePrice
                data.discount = req.body.discount ?? data.discount
                data.finalPrice = req.body.finalPrice ?? data.finalPrice
                data.stock = req.body.stock ?? data.stock
                data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity
                data.description = req.body.description ?? data.description
                data.active = req.body.active ?? data.active

                data.pic.forEach((x, index) => {
                    if (!req.body.oldPics.includes(x)) {
                        try {
                            fs.unlink(x, error => {
                                error ? console.log(error) : data.pic.splice(index, 1)
                            })
                        } catch (error) {
                            console.log("error", error)
                        }
                    }
                })

                if (req.files) {
                    data.pic = req.body.oldPics ? (req.body.oldPics?.split(",").filter(x => x !== "").concat(Array.from(req.files).map(x => x.path))) : Array.from(req.files)
                    await data.save()
                }
            }

            else {
                data.stock = req.body.stock ?? data.stock
                data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity
            }
            let finalData = await Product.findOne({ _id: data._id })
                .populate("maincategory", ["name"])
                .populate("subcategory", ["name"])
                .populate("brand", ["name"])

            res.send({
                result: "Done",
                data: finalData
            })
        } else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        try {
            Array.from(req.files).forEach((x) => fs.unlinkSync(x.path))
        } catch (error) { }

        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Product.findOne({ _id: req.params._id })
        if (data) {
            try {
                data.pic.forEach((x) => fs.unlinkSync(x))
            } catch (error) { }
            await data.deleteOne()
            res.send({
                result: "Done",
                data: data
            })
        } else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

module.exports = {
    createRecord: createRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord
}