const User = require("../models/User")
const fs = require("fs")

const mailer = require("../mailer/index")
const passwordValidator = require('password-validator')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const schema = new passwordValidator();

// Add properties to it
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                             // Must have at least 1 uppercase letter
    .has().lowercase(1)                             // Must have at least 1 lowercase letter
    .has().digits(1)                                // Must have at least 1 digit
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

async function createRecord(req, res) {
    if (schema.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 12, async (error, hash) => {
            if (error) {
                res.status(500).send({
                    result: "Fail",
                    reason: "Internal Server Error"
                })
            }
            else {
                try {
                    let data = new User(req.body)
                    if (req.headers.authorization) {
                        data.role = req.body.role
                        data.active = req.body.active
                    }
                    else
                        data.role = "Buyer"

                    data.password = hash
                    await data.save()
                    res.send({
                        result: "Done",
                        data: data
                    })
                } catch (error) {

                    try {
                        fs.unlinkSync(req.file.path)
                    } catch (error) { }

                    let errorMessage = {}
                    error.keyValue?.username ? errorMessage.username = "User With This User Name Already Exist" : null
                    error.keyValue?.email ? errorMessage.email = "User With This Email Address Already Exist" : null
                    error.errors?.name ? errorMessage.name = error.errors.name.message : null
                    error.errors?.username ? errorMessage.username = error.errors.username.message : null
                    error.errors?.email ? errorMessage.email = error.errors.email.message : null
                    error.errors?.phone ? errorMessage.phone = error.errors.phone.message : null
                    error.errors?.password ? errorMessage.password = error.errors.password.message : null

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
        })
    }
    else
        res.status(400).send({
            result: "Fail",
            reason: "Invalid Password. It Must Container at least 1 upper case and 1 lower case alphabet, 1 digit, should not contain any space and length must be 8-100"
        })
}

async function getRecord(req, res) {
    try {
        let data = await User.find().sort({ _id: -1 })
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
        let data = await User.findOne({ _id: req.params._id })
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
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.username = req.body.username ?? data.username
            data.email = req.body.email ?? data.email
            data.phone = req.body.phone ?? data.phone
            data.address = req.body.address ?? data.address
            data.pin = req.body.pin ?? data.pin
            data.city = req.body.city ?? data.city
            data.state = req.body.state ?? data.state
            data.active = req.body.active ?? data.active

            if (req.headers.authorization)
                data.role = req.body.role
            
            if (await data.save() && req.file) {
                try {
                    fs.unlinkSync(data.pic)
                } catch (error) { }
                data.pic = req.file.path
                await data.save()
            }
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
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }
        let errorMessage = {}
        error.keyValue?.username ? errorMessage.username = "User With This User Name Already Exist" : null
        error.keyValue?.email ? errorMessage.email = "User With This Email Already Exist" : null
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

async function deleteRecord(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.pic)
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

async function login(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            if (await bcrypt.compare(req.body.password, data.password)) {
                let key = data.role === "Buyer" ? process.env.JWT_SECRET_KEY_BUYER : process.env.JWT_SECRET_KEY_ADMIN
                jwt.sign({ data }, key, { expiresIn: "15 Days" }, (error, token) => {
                    if (error)
                        res.status(500).send({
                            result: "Fail",
                            reason: "Internal Server Error"
                        })
                    else
                        res.send({
                            result: "Done",
                            data: data,
                            token: token
                        })
                })
            }
            else
                res.status(401).send({
                    result: "Fail",
                    reason: "Invalid Username or Password"
                })
        }
        else {
            res.status(401).send({
                result: "Fail",
                reason: "Invalid Username or Password"
            })
        }
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword1(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.body.username },
                { "email": req.body.username }
            ]
        })
        if (data) {
            let otp = Number(Number(Math.random().toString().slice(2, 8)).toString().padEnd(6, 1))
            data.otp = otp
            await data.save()

            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: `OTP for Password Reset : Team ${process.env.SITE_NAME}`,
                text: `
                        Hello ${data.name}
                        OTP for Password is ${otp}
                        Please Never Share OTP with anyone
                        Team : ${process.env.SITE_NAME}
                    `
            }, (error) => {
                if (error)
                    console.log(error)
            })
            res.send({
                result: "Done",
                message: "OTP Has Been Sent On Your Registered Email Address"
            })
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "User Not Found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword2(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.body.username },
                { "email": req.body.username }
            ]
        })
        if (data) {
            if (data.otp == req.body.otp)
                res.send({
                    result: "Done"
                })
            else
                res.status(400).send({
                    result: "Fail",
                    reason: "Invalid OTP"
                })
        }
        else {
            res.status(401).send({
                result: "Fail",
                reason: "UnAuthorized Activity"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword3(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.body.username },
                { "email": req.body.username }
            ]
        })
        if (data) {
            if (schema.validate(req.body.password)) {
                bcrypt.hash(req.body.password, 12, async (error, hash) => {
                    if (error) {
                        console.log(error)
                        res.status(500).send({
                            result: "Fail",
                            reason: "Internal Server Error"
                        })
                    }
                    else {
                        data.password = hash
                        await data.save()
                        res.send({
                            result: "Done",
                            reason: "Password Has Been Reset"
                        })
                    }
                })
            }
            else
                res.status(400).send({
                    result: "Fail",
                    reason: "Invalid Password. It Must Container at least 1 upper case and 1 lower case alphabet, 1 digit, should not contain any space and length must be 8-100"
                })
        }
        else {
            res.status(401).send({
                result: "Fail",
                reason: "UnAuthorized Activity"
            })
        }
    } catch (error) {
        console.log(error)
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
    deleteRecord: deleteRecord,
    login: login,
    forgetPassword1: forgetPassword1,
    forgetPassword2: forgetPassword2,
    forgetPassword3: forgetPassword3
}