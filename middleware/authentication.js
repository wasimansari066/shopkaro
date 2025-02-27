const jwt = require("jsonwebtoken")

function verifyAdmin(req, res, next) {
    let token = req.headers.authorization
    if (token) {
        try {
            if (jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN))
                next()
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                res.status(498).send({
                    result: "Fail",
                    reason: "Token Expired. Please Login Again to Access this API"
                })
            }
            else {
                res.status(401).send({
                    result: "Fail",
                    reason: "You Are Not An Authorized Person to Access this API"
                })
            }
        }
    }
    else
        res.status(401).send({
            result: "Fail",
            reason: "You Are Not An Authorized Person to Access this API"
        })
}

function verifyBoth(req, res, next) {
    let token = req.headers.authorization
    if (token) {
        try {
            if (jwt.verify(token, process.env.JWT_SECRET_KEY_BUYER))
                next()
        } catch (error) {
            try {
                if (jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN))
                    next()
            } catch (error) {
                if (error.name === "TokenExpiredError") {
                    res.status(498).send({
                        result: "Fail",
                        reason: "Token Expired. Please Login Again to Access this API"
                    })
                }
                else {
                    res.status(401).send({
                        result: "Fail",
                        reason: "You Are Not An Authorized Person to Access this API"
                    })
                }
            }
        }
    }
    else
        res.status(401).send({
            result: "Fail",
            reason: "You Are Not An Authorized Person to Access this API"
        })
}
module.exports = {
    verifyAdmin: verifyAdmin,
    verifyBoth: verifyBoth
}

/* 
A JSON Web Token (JWT) has three parts: a header, payload, and signature. 
Header :
   The type of token, which is JWT
   The algorithm used, such as HMAC SHA256 or RSA SHA256
Payload :
   Contains claims, which are verifiable security statements
   Claims can include the user's identity, permissions, and other attributes
Signature :
   Validates that the token is trustworthy and has not been tampered with


Note: default algorithm is used  HS256	HMAC using SHA-256 hash algorithm
*/