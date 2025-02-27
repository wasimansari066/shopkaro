const mongoose = require("mongoose")

const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Brand Name is Mendatory"]
    },
    pic: {
        type: String,
        required: [true, "Brand Pic is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
})

const Brand = new mongoose.model("Brand", BrandSchema)

module.exports = Brand