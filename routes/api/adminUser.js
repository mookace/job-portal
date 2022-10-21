const express = require("express");
const router = express.Router();
const adminController = require("../../controller/users/adminUserController");

router.get("/allusers", adminController.allFrontUserList);

router.post("/postjob", adminController.postJobs);

router.get("/getalljobs", adminController.allJobs);

router.get("/searchid/:id", adminController.searchById);

router.get("/searchjob/:jobtitle", adminController.searchByjobTitle);

module.exports = router;
