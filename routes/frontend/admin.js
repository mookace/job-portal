const express = require("express");
const router = express.Router();
const axios = require("axios");
const pool = require("../../dbconfig/dbconfig");

router.get("/alljobs", async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    console.log("token", token);

    if (!token) {
      return res.status(400).send({ message: "No Token available" });
    }
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

router.get("/login", async (req, res) => {
  try {
    return res.render("loginAdmin");
  } catch (error) {
    return res.send(error);
  }
});

router.get("/homepage", async (req, res) => {
  try {
    return res.render("homepageAdmin");
  } catch (error) {
    return res.send(error);
  }
});
router.get("/allusers", async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const allusers = await axios.get(
      "http://localhost:8000/api/admin/allusers",
      {
        headers: { Authorization: "Bearer " + token },
        withCredentials: true,
      }
    );
    return res.render("allusers", { allusers: allusers.data.data });
  } catch (error) {
    return res.send(error);
  }
});

router.get("/logout", async (req, res) => {
  try {
    console.log("frontend logout");
    return res.render("loginAdmin");
  } catch (error) {
    return res.send(error);
  }
});

module.exports = router;
