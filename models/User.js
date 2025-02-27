const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Full Name is Mendatory"]
    },
    username: {
        type: String,
        unique: true,
        required: [true, "User Name is Mendatory"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email Address is Mendatory"]
    },
    phone: {
        type: String,
        required: [true, "Phone Number is Mendatory"]
    },
    password: {
        type: String,
        required: [true, "Password is Mendatory"]
    },
    role: {
        type: String,
        default: "Buyer"
    },
    address: {
        type: String,
        default: ""
    },
    pin: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
        default: "-234567"
    },
    pic: {
        type: String,
        default: ""
    },
    active: {
        type: Boolean,
        default: true
    }
})
const User = new mongoose.model("User", UserSchema)

module.exports = User