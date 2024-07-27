const express = require("express");
const bodyParser = require("body-parser")
const userRoutes = require("./routes/userRoutes")
// const pool = require("./config/database")

const app = express()
app.use(express.json());
const dotenv = require("dotenv");
dotenv.config()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.use('/api/v1/user', userRoutes)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})