const express = require("express");
const router = express.Router();
const userController = require("../../controller/users/frontUserController");

router.post("/register", userController.registerUser);

router.post("/login", userController.login);

router.get("/getalljobs", userController.allJobs);

module.exports = router;
