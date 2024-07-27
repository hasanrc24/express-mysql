const express = require("express");
const { getusers, createUser, getuser } = require("../controllers/userController");
const router = express.Router()

router.post('/create', createUser)
router.get("/list", getusers)
router.get("/:id", getuser)

module.exports = router;