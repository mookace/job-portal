const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/homepage", async (req, res) => {
  try {
    console.log("hello");
    const token = req.cookies.accessToken;
    console.log("token", token);
    // console.log("accesstoken", accessToken);
    const alljobs = await axios.get(
      "http://localhost:8000/api/user/getalljobs",
      {
        headers: { Authorization: token },
        withCredentials: true,
      }
    );

    console.log("alljobs", alljobs);
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

router.delete("/logout", (req, res) => {
  try {
    req.logOut();
    return res.render("login");
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
