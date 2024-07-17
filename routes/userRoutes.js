const express = require("express");
const { getusers, createUser } = require("../controllers/userController");
const router = express.Router()

router.get("/list", getusers)
router.post('/create', createUser)

module.exports = router;