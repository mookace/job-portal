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
    console.log("enterEmail", enterEmail.rows);
    if (enterEmail.rows.length != 0) {
      return res
        .status(400)
        .send({ status: "Bad Request", message: "Email already exist" });
    } else {
      let passwordHashing = CryptoJS.AES.encrypt(
        user.password,
        process.env.SECRET_KEY
      ).toString();
      await pool.query(
        "insert into users(email,password,created_at) values($1,$2,current_timestamp) RETURNING *",
        [user.email, passwordHashing]
      );

      return res.status(201).redirect("/front/login");
      // return res.status(200).send({ status: "success", data: newUser.rows });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

// login
userController.login = async (req, res) => {
  try {
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

      if (password === originalPassword) {
        const user = {
          id: data.id,
          email: data.email,
          role: data.role,
        };
        const accessToken = jwt.sign(user, process.env.JWT_SEC, {
          expiresIn: "12h",
        });
        console.log("hello");

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
        });

        // res.json({ accessToken });
        return res.status(200).redirect("/front/homepage");
      } else {
        return res.status(400).send("invalid password");
      }
    } else {
      return res.status(400).send({ message: "invalid email" });
    }
  } catch (error) {
    res.status(500).send(error);
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

userController.applyForm = async (req, res) => {
  try {
    let data = req.filename;
    console.log("data", data);
    await pool.query("UPDATE users SET cv =$1 WHERE id=$2", [data, 17]);

    res.send(savedData);
    res.send("file saved success");
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
