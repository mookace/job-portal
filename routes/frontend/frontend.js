const express = require("express");
const router = express.Router();

router.get("/homepage", (req, res) => {
  try {
    return res.render("index");
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
