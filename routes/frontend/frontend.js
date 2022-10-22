const express = require("express");
const router = express.Router();

router.use("/homepage", (req, res) => {
  try {
    return res.render("index");
  } catch (error) {
    res.send(error);
  }
});
router.use("/login", (req, res) => {
  try {
    return res.render("login");
  } catch (error) {
    res.send(error);
  }
});
router.use("/register", (req, res) => {
  try {
    return res.render("register");
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
