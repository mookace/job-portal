const express = require("express");
const router = express.Router();
const userController = require("../../controller/users/frontUserController");
const middleware = require("../../middleware/middleware");

router.post("/register", userController.registerUser);

router.post("/login", userController.login);

router.get("/getalljobs", middleware.authentication, userController.allJobs);

module.exports = router;
