const mongoose = require("mongoose")

const MaincategorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Maincategory Name is Mendatory"]
    },
    pic: {
        type: String,
        required: [true, "Maincategory Pic is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
})

const Maincategory = new mongoose.model("Maincategory", MaincategorySchema)

module.exports = Maincategory