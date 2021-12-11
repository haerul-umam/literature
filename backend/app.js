const express = require("express")
const cors = require("cors")
const path = require("path")
require("dotenv").config()


const app = express()

app.use(express.json())
app.use(cors())
app.use("/static", express.static(path.join(__dirname,"public")))

const router = require("./src/route")
app.use("/api/v1", router)


app.listen(3333, () => {
    console.log("server runnint at port 3333")
})