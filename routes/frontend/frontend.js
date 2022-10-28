const express = require("express");
const router = express.Router();
const axios = require("axios");

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

    return res.render("index", { alljobs: alljobs.data.data });
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
