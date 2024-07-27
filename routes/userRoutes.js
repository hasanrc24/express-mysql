const express = require("express");
const { getusers, createUser, getuser, userLogin } = require("../controllers/userController");
const router = express.Router()

router.post('/create', createUser)
router.get("/list", getusers)
router.get("/:id", getuser)
router.post("/login", userLogin)

module.exports = router;