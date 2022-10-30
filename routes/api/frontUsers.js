const express = require("express");
const router = express.Router();
const userController = require("../../controller/users/frontUserController");
const middleware = require("../../middleware/middleware");

router.post("/register", userController.registerUser);

router.post("/login", userController.login);

router.get("/logout", middleware.authentication, userController.logout);

router.get("/getalljobs", middleware.authentication, userController.allJobs);

router.post("/searchjobs", middleware.authentication, userController.searchJob);

router.post(
  "/profile",
  middleware.authentication,
  middleware.upload,
  userController.profileUpdate
);

router.post("/sendemail", middleware.authentication, userController.applyJob);

router.get("/singlejob/:id", userController.singleJob);

module.exports = router;
