const express = require("express")
const cors = require("cors")
const path = require("path")
require("dotenv").config()


require("./db_connect")

const Router = require("./routes/index")
const app = express()

var whitelist = ['http://localhost:3000', 'http://localhost:8000'] 
var corsOptions = {
    origin: function (origin, callback) {
        // console.log("Origin",origin)
        if (whitelist.includes(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('CORS Error, You Are not authenciated to access this api'))
        }
    }
}
app.use(cors(corsOptions))
app.use(express.json()) //use to parse incomming json data

app.use("/public", express.static("public"))//used to serve public files like uploaded images
app.use(express.static(path.join(__dirname, 'build')))

app.use("/api", Router)
app.use('*', express.static(path.join(__dirname, 'build')))

let port = process.env.PORT || 8000
app.listen(port, console.log(`Server is running at http://localhost:${port}`))


/* 
npm i cors
*/