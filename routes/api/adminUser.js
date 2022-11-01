const express = require("express");
const router = express.Router();
const adminController = require("../../controller/users/adminUserController");
const middleware = require("../../middleware/middleware");

//New route
router.post("/login", adminController.login);

router.post("/postjob", middleware.authentication, adminController.postJobs);

router.get("/getalljobs", adminController.allJobs);

router.get("/logout", middleware.authentication, adminController.logout);

router.post("/searchjobs", adminController.searchByjobTitle);

router.get("/jobdetails", adminController.jobDetails);

//old route
router.get("/allusers", adminController.allFrontUserList);

router.get("/searchid/:id", adminController.searchById);

module.exports = router;
