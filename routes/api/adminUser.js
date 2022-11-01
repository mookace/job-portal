const express = require("express");
const router = express.Router();
const adminController = require("../../controller/users/adminUserController");
const middleware = require("../../middleware/middleware");

//New route
router.post("/login", adminController.login);

router.post("/postjob", middleware.authentication, adminController.postJobs);

router.get("/getalljobs", middleware.authentication, adminController.allJobs);

router.get("/logout", middleware.authentication, adminController.logout);

router.post(
  "/searchjobs",
  middleware.authentication,
  adminController.searchByjobTitle
);

router.get(
  "/jobdetails",
  middleware.authentication,
  adminController.jobDetails
);

router.get("/allusers", middleware.authentication, adminController.allusers);

router.get(
  "/userdetails",
  middleware.authentication,
  adminController.userDetails
);

router.post(
  "/searchuser",
  middleware.authentication,
  adminController.searchUser
);

module.exports = router;
