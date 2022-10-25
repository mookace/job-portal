const userController = {};
const pool = require("../../dbconfig/dbconfig");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

userController.registerUser = async (req, res) => {
  try {
    const user = req.body;
    user.email = user.email.toLowerCase();
    const enterEmail = await pool.query(
      "select email from users where email=$1",
      [user.email]
    );
    if (enterEmail.rows.length != 0) {
      return res
        .status(400)
        .send({ status: "Bad Request", message: "Email already exist" });
    } else {
      let passwordHashing = CryptoJS.AES.encrypt(
        user.password,
        process.env.SECRET_KEY
      ).toString();
      const newUser = await pool.query(
        "insert into users(fullname,email,password,created_at,phone_no,gender) values($1,$2,$3,current_timestamp,$4,$5) RETURNING *",
        [user.fullname, user.email, passwordHashing, user.phone_no, user.gender]
      );
      return res.render("login");
      // return res.status(200).send({ status: "success", data: newUser.rows });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

// login
userController.login = async (req, res) => {
  try {
    console.log("login");
    let { email, password } = req.body;
    email = email.toLowerCase();
    const findemail = await pool.query("select * from users where email=$1", [
      email,
    ]);
    const data = findemail.rows[0];
    console.log(data);

    if (data) {
      const unhashPassword = CryptoJS.AES.decrypt(
        data.password,
        process.env.SECRET_KEY
      );
      const originalPassword = unhashPassword.toString(CryptoJS.enc.Utf8);
      console.log("original", originalPassword);
      if (password === originalPassword) {
        console.log("true");
        const user = {
          id: data.id,
          fullname: data.fullname,
          email: data.email,
          roles: data.roles,
          phone_no: data.phone_no,
          gender: data.gender,
        };
        const accessToken = jwt.sign(user, process.env.JWT_SEC, {
          expiresIn: "1h",
        });
        res.cookie("accessToken", accessToken, { maxAge: 1000 * 60 * 60 * 12 });
        res.json({ accessToken });
        return res.render("index");
      } else {
        return res.status(400).send("invalid password");
      }
    } else {
      return res.status(400).send({ message: "invalid email" });
    }
  } catch (error) {
    res.send(error);
  }
};

userController.allJobs = async (req, res) => {
  try {
    const allJobsList = await pool.query(
      "select * from jobs ORDER BY created_at DESC"
    );
    return res.status(200).send({ status: "success", data: allJobsList.rows });
  } catch (error) {
    return res.status(500).send(error);
  }
};

userController.applyJob = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).send(error);
  }
};

userController.logout = (req, res) => {
  res.cookie("accessToken", "", { maxAge: 1 });
  res.redirect("login");
};

module.exports = userController;
