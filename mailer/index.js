const nodemailer = require("nodemailer")

const mailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    tls: true,
    auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_PASSWORD
    }
})
module.exports = mailer