const adminController = {};
const pool = require("../../dbconfig/dbconfig");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const send_mail = require("../../middleware/email");

// login
adminController.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    const findemail = await pool.query(
      "select * from users where email=$1 and role='admin' and is_deleted='false'",
      [email]
    );
    const data = findemail.rows[0];
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

        res.cookie("accessToken", accessToken, {
          maxAge: 1000 * 60 * 60 * 12,
          httpOnly: true,
        });
        req.flash("message", "Successfully Login");
        return res.status(200).redirect("/admin/homepage");
      } else {
        req.flash("Errmsg", "invalid password");
        return res.status(400).redirect("/admin/login");
      }
    } else {
      req.flash("Errmsg", "invalid email");
      return res.status(400).redirect("/admin/login");
    }
  } catch (error) {
    return res.status(500).send({ message: "Internal server error", error });
  }
};

adminController.allusers = async (req, res) => {
  try {
    let searchEmail = req.query.email;

    if (searchEmail) {
      searchEmail = "%" + searchEmail + "%";

      const result = await pool.query(
        `select * from users where email LIKE $1 AND is_deleted='false'`,
        [searchEmail]
      );

      return res.status(200).send({ status: "success", data: result.rows });
    }
    const allUsers = await pool.query(
      `select * from users where is_deleted='false' ORDER BY created_at DESC`
    );

    return res.status(200).send({ status: "success", data: allUsers.rows });
  } catch (error) {
    return res.status(500).send(error);
  }
};

adminController.postJobs = async (req, res) => {
  try {
    const user = req.user;
    let jobs = req.body;
    jobs.job_title = jobs.job_title.toLowerCase();
    const newJobs = await pool.query(
      "insert into jobs(company_name,job_title,no_of_openings,job_category,job_location,job_level,experience,expiry_date,skills,job_description,salary,created_at,posted_by) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,current_timestamp,$12) returning *",
      [
        jobs.company_name,
        jobs.job_title,
        jobs.no_of_openings,
        jobs.job_category,
        jobs.job_location,
        jobs.job_level,
        jobs.experience,
        jobs.expiry_date,
        jobs.skills,
        jobs.job_description,
        jobs.salary,
        user.email,
      ]
    );
    if (!newJobs.rows[0]) {
      req.flash("Errmsg", "Failed To Post Job");
      return res.status(201).redirect("/admin/homepage");
    }
    req.flash("message", "Job Post Successfully");
    return res.status(201).redirect("/admin/alljobs");
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server error", error: "Cannot Post Job" });
  }
};

adminController.allJobs = async (req, res) => {
  try {
    const querySearch = req.query.job_title;

    if (querySearch) {
      const allJobsList = await pool.query(
        `select * from jobs where job_title LIKE $1 AND is_deleted='false' ORDER BY created_at DESC`,
        [querySearch]
      );
      return res
        .status(200)
        .send({ status: "success", data: allJobsList.rows });
    } else {
      const allJobsList = await pool.query(
        "select * from jobs where is_deleted='false' ORDER BY created_at DESC"
      );
      return res
        .status(200)
        .send({ status: "success", data: allJobsList.rows });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
};

adminController.jobDetails = async (req, res) => {
  try {
    const jobId = req.query.id;

    const jobidjob = req.query.jobidjob;

    if (jobId) {
      return res.status(200).redirect("/admin/jobdetails?jobId=" + jobId);
    }
    if (jobidjob) {
      const allUserWithJobId = await pool.query(
        "select * from users inner join jobapplied on users.id=jobapplied.user_id where jobapplied.job_id=$1",
        [jobidjob]
      );

      const allJobsList = await pool.query(
        "select * from jobs where is_deleted='false' and id=$1 ORDER BY created_at DESC",
        [jobidjob]
      );

      return res.status(200).send({
        status: "success",
        data: allUserWithJobId.rows,
        alljobs: allJobsList.rows,
      });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

adminController.userDetails = async (req, res) => {
  try {
    const userid = req.query.id;
    const idid = req.query.idid;
    if (idid) {
      const joinAllTable = await pool.query(
        "select * from users inner join jobapplied on users.id=jobapplied.user_id inner join jobs on jobapplied.job_id=jobs.id where users.id=$1",
        [idid]
      );
      return res
        .status(200)
        .send({ status: "success", data: joinAllTable.rows });
    }

    return res.status(200).redirect("/admin/userdetails?userid=" + userid);
  } catch (error) {
    return res.status(500).send(error);
  }
};

adminController.searchByjobTitle = async (req, res) => {
  try {
    let job_title = req.body.search;

    job_title = job_title.trim("trim", job_title);

    job_title = "%" + job_title.toLowerCase() + "%";

    const result = await pool.query(
      `select * from jobs where job_title LIKE $1 AND is_deleted='false' ORDER BY created_at DESC`,
      [job_title]
    );
    return res.status(200).redirect("/admin/searchjobs?job_title=" + job_title);
    // return res.render("allJobs", {
    //   alljobs: result.rows,
    // });
  } catch (error) {
    return res.status(500).send(error);
  }
};

adminController.searchUser = async (req, res) => {
  try {
    let userEmail = req.body.search;
    userEmail = userEmail.toLowerCase();

    return res.status(200).redirect("/admin/allusers?email=" + userEmail);
    // return res.render("allusers", { allusers: result.rows });
  } catch (error) {
    return res.status(500).send(error);
  }
};

adminController.updateProfile = async (req, res) => {
  try {
    const userId = req.query.id;

    const userData = req.body;

    if (userData.fullname || userData.role) {
      const updateid = req.query.updateid;

      const updateUser = await pool.query(
        "update users set fullname=$1,role=$2 where id=$3 returning *",
        [userData.fullname, userData.role, updateid]
      );
      req.flash("message", "Profile Successfully Updated");

      return res.render("adminUpdateUserProfile", {
        userData: updateUser.rows[0],
        Errmsg: req.flash("Errmsg"),
        message: req.flash("message"),
      });
    }

    const userData1 = await pool.query("select * from users where id=$1", [
      userId,
    ]);

    return res.render("adminUpdateUserProfile", {
      userData: userData1.rows[0],
      Errmsg: req.flash("Errmsg"),
      message: req.flash("message"),
    });
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

adminController.deleteProfile = async (req, res) => {
  try {
    const deleteId = req.query.id;

    const toDelete = req.query.deleteId;

    if (toDelete) {
      const deleteUser = await pool.query(
        "update users set is_deleted='true',deleted_at=current_timestamp,is_active='false' where id=$1 returning *",
        [toDelete]
      );
      return res
        .status(200)
        .send({ status: "success", data: deleteUser.rows[0] });
    }

    return res.redirect("/admin/deleteprofile?deleteId=" + deleteId);
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

adminController.logout = async (req, res) => {
  try {
    const user = req.user;
    await pool.query("update users set is_active='false' where id=$1", [
      user.id,
    ]);
    res.cookie("accessToken", "", { maxAge: 1 });
    req.flash("message", "Successfully Logout");
    return res.status(200).redirect("/admin/logout");
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = adminController;
