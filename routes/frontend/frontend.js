const express = require("express");
const router = express.Router();
const axios = require("axios");
const pool = require("../../dbconfig/dbconfig");
const base64 = require("base-64");
// const { allJobs } = require("../../controller/users/frontUserController");

router.get("/homepage", async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const alljobs = await axios.get(
      "http://localhost:8000/api/user/getalljobs",
      {
        headers: { Authorization: "Bearer " + token },
        withCredentials: true,
      }
    );
    const apply = await pool.query(
      "select job_id from jobapplied where user_id=$1",
      [alljobs.data.userid]
    );
    const alljobid = apply.rows;
    const onlyjobid = alljobid.map((e) => e.job_id);

    return res.render("index", {
      alljobs: alljobs.data.data,
      onlyjobid: onlyjobid,
      message: req.flash("message"),
    });
  } catch (error) {
    res.send(error);
  }
});

router.get("/login", (req, res) => {
  try {
    return res.render("login");
  } catch (error) {
    res.send(error);
  }
});
router.get("/register", (req, res) => {
  try {
    return res.render("register", { Errmsg: req.flash("Errmsg") });
  } catch (error) {
    res.send(error);
  }
});
router.get("/profile", (req, res) => {
  try {
    return res.render("profile");
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
