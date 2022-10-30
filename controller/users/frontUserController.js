const userController = {};
const pool = require("../../dbconfig/dbconfig");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const send_mail = require("../../middleware/email");

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
    console.log("login");
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
          maxAge: 1000 * 60 * 60 * 12,
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
    console.log("no query");
    const allJobsList = await pool.query(
      "select * from jobs where is_deleted='false' ORDER BY created_at DESC"
    );
    return res.status(200).send({ status: "success", data: allJobsList.rows });
  } catch (error) {
    return res.status(500).send(error);
  }
};

userController.searchJob = async (req, res) => {
  try {
    console.log("search job");
    let job_title = req.body.search;
    console.log("job", job_title);
    job_title = "%" + job_title + "%";
    console.log(job_title);
    const result = await pool.query(
      `select * from jobs where job_title LIKE $1 AND is_deleted='false' ORDER BY created_at DESC`,
      [job_title]
    );
    return res.render("search", { alljobs: result.rows });
  } catch (error) {
    return res.status(500).send(error);
  }
};

userController.profileUpdate = async (req, res) => {
  try {
    const userId = req.user;
    console.log("userid", userId.id);
    const profile = req.body.fullname;
    let cvName = req.filename;
    console.log("body", profile);
    const profileData = await pool.query(
      "update users set fullname=$1,cv=$2,updated_at=current_timestamp where id=$3 RETURNING *",
      [profile, cvName, userId.id]
    );
    return res.status(201).redirect("/front/homepage");
    // return res.status(201).send({ status: "success", data: profileData.rows });
  } catch (error) {
    return res.status(500).send(error);
  }
};

userController.singleJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    console.log(jobId);
    const allJobsList = await pool.query(
      "select * from jobs where is_deleted='false' AND id=$1",
      [jobId]
    );
    return res.status(200).send({ status: "success", data: allJobsList.rows });
  } catch (error) {
    return res.status(500).send(error);
  }
};

userController.applyJob = async (req, res) => {
  try {
    const userData = req.user;
    console.log("useemail", userData.email);
    await send_mail(
      userData.email,
      "rajbanshimukesh999@gmail.com",
      userData.email
    );
    return res
      .status(200)
      .send({ status: "success", message: "Mail send success" });
  } catch (error) {
    return res.status(500).send(error);
  }
};

userController.logout = (req, res) => {
  res.cookie("accessToken", "", { maxAge: 1 });
  return res.status(200).redirect("/front/login");
};

module.exports = userController;
