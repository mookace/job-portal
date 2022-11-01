const express = require("express");
const router = express.Router();
const axios = require("axios");
const pool = require("../../dbconfig/dbconfig");

router.get("/alljobs", async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const alljobs = await axios.get(
      "http://localhost:8000/api/admin/getalljobs",
      {
        headers: { Authorization: "Bearer " + token },
        withCredentials: true,
      }
    );
    return res.render("alljobs", { alljobs: alljobs.data.data });
  } catch (error) {
    res.send(error);
  }
});

router.get("/login", (req, res) => {
  try {
    return res.render("loginAdmin");
  } catch (error) {
    return res.send(error);
  }
});

router.get("/homepage", (req, res) => {
  try {
    return res.render("homepageAdmin");
  } catch (error) {
    return res.send(error);
  }
});
router.get("/allusers", (req, res) => {
  try {
    return res.render("allusers");
  } catch (error) {
    return res.send(error);
  }
});

router.get("/logout", (req, res) => {
  try {
    return res.render("loginAdmin");
  } catch (error) {
    return res.send(error);
  }
});

module.exports = router;
