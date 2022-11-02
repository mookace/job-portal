const { check, validationResult } = require("express-validator");

exports.SanitizeRegister = [
  check("email").trim(),
  check("password").trim(),
  (req, res, next) => {
    console.log("enter sanitize");
    next();
  },
];

exports.Registervalidate = [
  check("email", "Invalid Email").isEmail(),
  check("password", "Password must be 8 Character or longer").isLength({
    min: 8,
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("fail");
      req.flash("Errmsg", errors.array()[0].msg);
      res.render("register", { Errmsg: req.flash("Errmsg") });
    } else {
      console.log("success");
      next();
    }
  },
];
