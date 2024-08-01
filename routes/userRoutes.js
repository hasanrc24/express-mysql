const express = require("express");
const { getusers, createUser, getuser, userLogin } = require("../controllers/userController");
const { verifyJwt } = require("../middlewares/authMiddleware");
const router = express.Router()

router.post('/create', createUser)
router.get("/list", getusers)
router.get("/:id", verifyJwt, getuser)
router.post("/login", userLogin)

module.exports = router;