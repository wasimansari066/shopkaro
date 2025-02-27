const Wishlist = require("../models/Wishlist")

async function createRecord(req, res) {
    try {
        let data = new Wishlist(req.body)
        await data.save()
        let finalData = await Wishlist.findOne({ _id: data._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "product",
                select: "name brand color size finalPrice stockQuantity pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
        res.send({
            result: "Done",
            data: finalData
        })
    } catch (error) {


        let errorMessage = {}
        error.errors?.user ? errorMessage.user = error.errors.user.message : null
        error.errors?.product ? errorMessage.product = error.errors.product.message : null
        

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
        let data = await Wishlist.find({ user: req.params.userid }).sort({ _id: -1 })
            .populate("user", ["name", "username"])
            .populate({
                path: "product",
                select: "name brand color size finalPrice stockQuantity pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
        res.send({
            result: "Done",
            count: data.length,
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}


async function getSingleRecord(req, res) {
    try {
        let data = await Wishlist.findOne({ _id: req.params._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "product",
                select: "name brand color size finalPrice stockQuantity pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
        if (data)
            res.send({
                result: "Done",
                data: data
            })
        else
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}


async function deleteRecord(req, res) {
    try {
        let data = await Wishlist.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
            res.send({
                result: "Done",
                data: data
            })
        }
        else
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
    } catch (error) {
        // console.log(error)
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
    deleteRecord: deleteRecord
}