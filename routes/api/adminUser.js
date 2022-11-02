const express = require("express");
const router = express.Router();
const adminController = require("../../controller/users/adminUserController");
const middleware = require("../../middleware/middleware");

//New route
router.post("/login", adminController.login);

router.post(
  "/postjob",
  middleware.authentication,
  middleware.authorizationForAdmin,
  adminController.postJobs
);

router.get(
  "/getalljobs",
  middleware.authentication,
  middleware.authorizationForAdmin,
  adminController.allJobs
);

router.get(
  "/logout",
  middleware.authenticationForLogout,
  middleware.authorizationForAdmin,
  adminController.logout
);

router.post(
  "/searchjobs",
  middleware.authentication,
  middleware.authorizationForAdmin,
  adminController.searchByjobTitle
);

router.get(
  "/jobdetails",
  middleware.authentication,
  middleware.authorizationForAdmin,
  adminController.jobDetails
);

router.get(
  "/allusers",
  middleware.authentication,
  middleware.authorizationForAdmin,
  adminController.allusers
);

router.get(
  "/userdetails",
  middleware.authentication,
  middleware.authorizationForAdmin,
  adminController.userDetails
);

router.post(
  "/searchuser",
  middleware.authentication,
  middleware.authorizationForAdmin,
  adminController.searchUser
);

module.exports = router;
