const express = require("express");
const router = express.Router();
const userController = require("../../controller/users/frontUserController");
const middleware = require("../../middleware/middleware");
const validation = require("../../controller/users/frontUserValidate");

router.post(
  "/register",
  validation.SanitizeRegister,
  validation.Registervalidate,
  userController.registerUser
);

router.post("/login", userController.login);

router.get(
  "/logout",
  middleware.authenticationForLogout,
  middleware.authorizationForUser,
  userController.logout
);

router.get(
  "/getalljobs",
  middleware.authentication,
  middleware.authorizationForUser,
  userController.allJobs
);

router.post(
  "/searchjobs",
  middleware.authentication,
  middleware.authorizationForUser,
  userController.searchJob
);

router.get(
  "/searchjobs",
  middleware.authentication,
  middleware.authorizationForUser,
  userController.searchJob
);

router.post(
  "/profile",
  middleware.authentication,
  middleware.authorizationForUser,
  middleware.upload,
  validation.UpdateProfileSanitizer,
  userController.profileUpdate
);

router.get(
  "/singleuser",
  middleware.authentication,
  middleware.authorizationForUser,
  userController.singleUser
);

router.get(
  "/sendemail",
  middleware.authentication,
  middleware.authorizationForUser,
  userController.applyJob
);

router.get(
  "/searchapplyjob",
  middleware.authentication,
  middleware.authorizationForUser,
  userController.searchApplyJob
);

router.get(
  "/jobid",
  middleware.authentication,
  middleware.authorizationForUser,
  userController.getJobIdFromJobapplied
);

router.get(
  "/searchresult",
  middleware.authentication,
  middleware.authorizationForUser,
  userController.searchResult
);

module.exports = router;
