const express = require("express");
const router = express.Router();
const userController = require("../../controller/users/frontUserController");
const middleware = require("../../middleware/middleware");

router.post("/register", userController.registerUser);

router.post("/login", userController.login);

// router.get("/getalljobs", middleware.authentication, userController.allJobs);
router.get("/getalljobs", userController.allJobs);

router.post(
  "/upload",
  middleware.upload.single("files"),
  userController.applyForm
);

module.exports = router;
