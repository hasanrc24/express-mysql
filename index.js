const express = require("express");
const bodyParser = require("body-parser")
const userRoutes = require("./routes/userRoutes")
const cors = require("cors")
const dotenv = require("dotenv");
const path = require("path")
// const pool = require("./config/database")

const app = express()
app.use(cors({
  origin: "*"
}))
app.use(express.json());
dotenv.config()

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.use('/api/v1/user', userRoutes)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})