require("mongoose")
    .connect(process.env.DB_KEY)
    .then(() => {
        console.log("Database is Connected")
    })
    .catch((error) => {
        console.log(error)
    })