const userController = {};
const pool = require("../../dbconfig/dbconfig");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const send_mail = require("../../middleware/email");

userController.registerUser = async (req, res) => {
  try {
    console.log("enter in register");
    const user = req.body;
    console.log("sanitize", user);
    user.email = user.email.toLowerCase();
    const enterEmail = await pool.query(
      "select email from users where email=$1",
      [user.email]
    );
    console.log("enterEmail", enterEmail.rows);
    if (enterEmail.rows.length != 0) {
      req.flash("Errmsg", "Email already exist");
      return res.status(400).redirect("/front/register");
    } else {
      let passwordHashing = CryptoJS.AES.encrypt(
        user.password,
        process.env.SECRET_KEY
      ).toString();
      await pool.query(
        "insert into users(email,password,created_at) values($1,$2,current_timestamp) RETURNING *",
        [user.email, passwordHashing]
      );
      req.flash("message", "Successfully Register");
      return res.status(201).redirect("/front/login");
    }
  } catch (error) {
    return res.status(500).send({ message: "internal server error", error });
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

        req.flash("message", "Successfully Login");
        return res.status(200).redirect("/front/homepage");
      } else {
        req.flash("Errmsg", "invalid password");
        return res.status(400).redirect("/front/login");
      }
    } else {
      req.flash("Errmsg", "invalid email");
      return res.status(400).redirect("/front/login");
    }
  } catch (error) {
    return res.status(500).send({ message: "internal server error", error });
  }
};

userController.allJobs = async (req, res) => {
  try {
    const userid = req.user.id;
    const allJobsList = await pool.query(
      "select * from jobs where is_deleted='false' ORDER BY created_at DESC"
    );
    return res
      .status(200)
      .send({ status: "success", data: allJobsList.rows, userid: userid });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
};

userController.searchJob = async (req, res) => {
  try {
    const user = req.user;
    console.log("lets see", user.id);
    let job_title = req.body.search || req.query.job_title;
    job_title = "%" + job_title.toLowerCase() + "%";

    return res
      .status(200)
      .redirect(
        "/front/searchjobs?job_title=" + job_title + "&userid=" + user.id
      );
    // return res.render("search", {
    //   userid: user.id,
    //   alljobs: result.rows,
    //   onlyjobid: onlyjobid,
    // });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
};

userController.profileUpdate = async (req, res) => {
  try {
    const userId = req.user;
    console.log("userid", userId.id);
    const profile = req.body.fullname;
    let cvName = req.filename;
    console.log("body", profile);
    await pool.query(
      "update users set fullname=$1,cv=$2,updated_at=current_timestamp where id=$3 RETURNING *",
      [profile, cvName, userId.id]
    );
    req.flash("message", "Profile Updated Successfully");
    return res.status(201).redirect("/front/homepage");
  } catch (error) {
    return res.status(500).send({ message: "internal server error", error });
  }
};

userController.singleUser = async (req, res) => {
  try {
    const userid = req.query.id;
    console.log("query user id", userid);

    const userDetails = await pool.query("select * from users where id=$1", [
      userid,
    ]);
    console.log("userdetail", userDetails.rows[0]);
    return res.status(200).render("profile", { userData: userDetails.rows[0] });
    // req.flash("message", "Profile Updated Successfully");
    // return res.status(201).redirect("/front/homepage");
  } catch (error) {
    return res.status(500).send({ message: "internal server error", error });
  }
};

// userController.singleJob = async (req, res) => {
//   try {
//     const jobId = req.params.id;
//     console.log(jobId);
//     const allJobsList = await pool.query(
//       "select * from jobs where is_deleted='false' AND id=$1",
//       [jobId]
//     );
//     return res.status(200).send({ status: "success", data: allJobsList.rows });
//   } catch (error) {
//     return res.status(500).send({ message: "internal server error", error });
//   }
// };

userController.applyJob = async (req, res) => {
  try {
    const userData = req.user;
    const jobId = req.query.id;
    let checkCV = await pool.query("select cv from users where email=$1", [
      userData.email,
    ]);
    const data = checkCV.rows;
    const newData = data.map((e) => e.cv);
    console.log("checkcv", newData);
    if (newData[0] == null) {
      req.flash("Errmsg", "Please update your profile");
      return res.status(400).redirect("/front/homepage");
    } else {
      const alladmin = await pool.query(
        "select * from users where role='admin' and is_deleted='false'"
      );
      console.log("alladmin", alladmin.rows);
      const allAdminEmail = alladmin.rows.map((e) => e.email);
      console.log("admin email only", allAdminEmail);

      await pool.query(
        "insert into jobapplied(job_id,user_id,applied_at) values($1,$2,current_timestamp) returning *",
        [jobId, userData.id]
      );
      const jobDetails = await pool.query("select * from jobs where id=$1", [
        jobId,
      ]);

      await allAdminEmail.forEach((email) =>
        send_mail(
          userData.email,
          email,
          jobDetails.rows[0].job_title,
          jobDetails.rows[0].company_name
        )
      );
      req.flash("message", "Job applied successfully");
      return res.status(200).redirect("/front/homepage");
    }
  } catch (error) {
    return res.status(500).send({ message: "internal server error", error });
  }
};

userController.searchApplyJob = async (req, res) => {
  try {
    const userData = req.user;
    const jobId = req.query.id;
    let checkCV = await pool.query("select cv from users where email=$1", [
      userData.email,
    ]);
    const data = checkCV.rows;
    const newData = data.map((e) => e.cv);
    console.log("checkcv", newData);
    if (newData[0] == null) {
      req.flash("Errmsg", "Please update your profile");
      return res.status(400).redirect("/front/homepage");
    } else {
      const alladmin = await pool.query(
        "select * from users where role='admin' and is_deleted='false'"
      );
      console.log("alladmin", alladmin.rows);
      const allAdminEmail = alladmin.rows.map((e) => e.email);
      console.log("admin email only", allAdminEmail);

      await pool.query(
        "insert into jobapplied(job_id,user_id,applied_at) values($1,$2,current_timestamp) returning *",
        [jobId, userData.id]
      );
      const jobDetails = await pool.query("select * from jobs where id=$1", [
        jobId,
      ]);

      await allAdminEmail.forEach((email) =>
        send_mail(
          userData.email,
          email,
          jobDetails.rows[0].job_title,
          jobDetails.rows[0].company_name
        )
      );
      req.flash("message", "Job applied successfully");
      return res
        .status(200)
        .redirect(
          "/api/user/searchjobs?job_title=" + jobDetails.rows[0].job_title
        );
    }
  } catch (error) {
    return res.status(500).send({ message: "internal server error", error });
  }
};

userController.logout = async (req, res) => {
  try {
    const user = req.user;
    await pool.query(`update users set is_active='false' where id=${user.id}`);
    res.cookie("accessToken", "", { maxAge: 1 });
    req.flash("message", "Successfully Logout");
    return res.status(200).redirect("/front/login");
  } catch (error) {
    return res.status(500).send({ message: "internal server error", error });
  }
};

module.exports = userController;
