const express = require("express");
const router = express.Router();
const axios = require("axios");
const base64 = require("base-64");
const { allJobs } = require("../../controller/users/frontUserController");

router.get("/homepage", async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    // const jobtitle = document.getElementById("form1");
    const alljobs = await axios.get(
      "http://localhost:8000/api/user/getalljobs",
      {
        // params: { jobtitle: "php" },
        headers: { Authorization: "Bearer " + token },
        withCredentials: true,
      }
    );

    return res.render("index", { alljobs: alljobs.data.data });
  } catch (error) {
    res.send(error);
  }
});

router.get("/search", async (req, res) => {
  try {
    // console.log("asjdhasjkhdjk", req.alljobs);
    const token = req.cookies.accessToken;
    const alljobs = await axios.get(
      "http://localhost:8000/api/user/searchjobs?",
      {
        headers: { Authorization: "Bearer " + token },
        withCredentials: true,
      }
    );

    return res.render("search", { alljobs: alljobs.data.data });
  } catch (error) {
    console.log(error);
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
    return res.render("register");
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
