const express = require("express");
const router = express.Router();
const axios = require("axios");
const pool = require("../../dbconfig/dbconfig");

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
      userid: alljobs.data.userid,
      alljobs: alljobs.data.data,
      onlyjobid: onlyjobid,
      message: req.flash("message"),
      Errmsg: req.flash("Errmsg"),
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
});

router.get("/login", async (req, res) => {
  try {
    return res.render("login", {
      message: req.flash("message"),
      Errmsg: req.flash("Errmsg"),
    });
  } catch (error) {
    return res.status(500).send({ message: "internal server error", error });
  }
});

router.get("/register", async (req, res) => {
  try {
    return res.render("register", { Errmsg: req.flash("Errmsg") });
  } catch (error) {
    return res.status(500).send({ message: "internal server error", error });
  }
});

router.get("/profile", async (req, res) => {
  try {
    return res.render("profile");
  } catch (error) {
    return res.status(500).send({ message: "internal server error", error });
  }
});

router.get("/searchjobs", async (req, res) => {
  try {
    const job_title = req.query.job_title;
    const userid = req.query.userid;
    console.log("query", req.query.job_title);
    console.log("userid", req.query.userid);

    // const token = req.cookies.accessToken;
    const result = await pool.query(
      `select * from jobs where job_title LIKE $1 AND is_deleted='false' ORDER BY created_at DESC`,
      [job_title]
    );
    console.log("alljobs", result.rows);
    const apply = await pool.query(
      "select job_id from jobapplied where user_id=$1",
      [userid]
    );
    console.log("apply", apply.rows);
    const alljobid = apply.rows;
    const onlyjobid = alljobid.map((e) => e.job_id);
    console.log("onlyjobid", onlyjobid);
    return res.render("search", {
      userid: userid,
      alljobs: result.rows,
      onlyjobid: onlyjobid,
      message: req.flash("message"),
      Errmsg: req.flash("Errmsg"),
    });
  } catch (error) {
    return res.status(500).send({ message: "internal server error", error });
  }
});

module.exports = router;
