const userController = {};
const pool = require("../../dbconfig/dbconfig");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

userController.registerUser = async (req, res) => {
  try {
    const user = req.body;
    user.email = user.email.toLowerCase();
    let passwordHashing = CryptoJS.AES.encrypt(
      user.password,
      process.env.SECRET_KEY
    ).toString();
    const newUser = await pool.query(
      "insert into users(fullname,email,password,created_at,phone_no,gender) values($1,$2,$3,current_timestamp,$4,$5) RETURNING *",
      [user.fullname, user.email, passwordHashing, user.phone_no, user.gender]
    );
    return res.status(200).send({ status: "success", data: newUser.rows });
  } catch (error) {
    return res.status(500).send(error);
  }
};

// login
userController.login = async (req, res) => {
  try {
    console.log("login");
    const { email, password } = req.body;
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
      if (password == originalPassword) {
        const user = {
          id: data.id,
          fullname: data.fullname,
          role: data.role,
          email: data.email,
          phone_no: data.phone_no,
        };
        const accessToken = jwt.sign(user, process.env.JWT_SEC, {
          expiresIn: "12h",
        });

        return res.json({ accessToken });
      } else {
        return res.status(400).send("invalid password");
      }
    } else {
      return res.status(400).send("invalid email");
    }
    // return res.redirect(302, "http://localhost:5830?verify=true");
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

module.exports = userController;
