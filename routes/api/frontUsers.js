const express = require("express");
const router = express.Router();
const userController = require("../../controller/users/frontUserController");
const middleware = require("../../middleware/middleware");
const validation = require("../../controller/users/frontUserValidate");
const { check, validationResult } = require("express-validator");

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

router.post(
  "/profile",
  middleware.authentication,
  middleware.authorizationForUser,
  middleware.upload,
  userController.profileUpdate
);

router.get(
  "/sendemail",
  middleware.authentication,
  middleware.authorizationForUser,
  userController.applyJob
);

router.get(
  "/singlejob/:id",
  middleware.authentication,
  middleware.authorizationForUser,
  userController.singleJob
);

module.exports = router;
