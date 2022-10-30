const express = require("express");
const router = express.Router();
const userController = require("../../controller/users/frontUserController");
const middleware = require("../../middleware/middleware");

router.post("/register", userController.registerUser);

router.post("/login", userController.login);

router.get("/logout", middleware.authentication, userController.logout);

router.get("/getalljobs", middleware.authentication, userController.allJobs);

router.post("/searchjobs", middleware.authentication, userController.searchJob);

router.get("/singlejob/:id", userController.singleJob);

router.post(
  "/upload",
  middleware.upload.single("files"),
  userController.applyForm
);

module.exports = router;
