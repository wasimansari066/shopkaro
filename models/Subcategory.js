const mongoose = require("mongoose")

const SubcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Subcategory Name is Mendatory"]
    },
    pic: {
        type: String,
        required: [true, "Subcategory Pic is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
})

const Subcategory = new mongoose.model("Subcategory", SubcategorySchema)

module.exports = Subcategory