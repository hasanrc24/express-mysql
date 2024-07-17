const express = require("express");
const bodyParser = require("body-parser")
const userRoutes = require("./routes/userRoutes")
const pool = require("./config/database")

const app = express()
app.use(bodyParser.json());
const dotenv = require("dotenv");
dotenv.config()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.use('/api/v1/user', userRoutes)

const PORT = process.env.PORT || 8000

// pool.query("SELECT 1")
// .then(() => {
  app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`)
  })
// })
// .catch((error) => {
//   console.log(error)
// })