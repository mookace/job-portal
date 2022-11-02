const adminController = {};
const pool = require("../../dbconfig/dbconfig");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const send_mail = require("../../middleware/email");

// login
adminController.login = async (req, res) => {
  try {
    console.log("enter in login");
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
      console.log("originalPassword", originalPassword);
      if (password === originalPassword) {
        console.log("dd12", data);

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
        return res.status(200).redirect("/admin/homepage");
      } else {
        return res.status(400).send("invalid password");
      }
    } else {
      return res.status(400).send({ message: "invalid email" });
    }
  } catch (error) {
    res.status(500).send({ error });
  }
};

adminController.allusers = async (req, res) => {
  try {
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
    console.log("job");
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
    return res.status(200).redirect("/admin/alljobs");
  } catch (error) {
    return res.status(500).send(error);
  }
};

adminController.allJobs = async (req, res) => {
  try {
    console.log("alljobbbs");
    const allJobsList = await pool.query(
      "select * from jobs where is_deleted='false' ORDER BY created_at DESC"
    );
    return res.status(200).send({ status: "success", data: allJobsList.rows });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

adminController.jobDetails = async (req, res) => {
  try {
    console.log("jobdetails");
    const jobId = req.query.id;
    const allUserWithJobId = await pool.query(
      "select * from users inner join jobapplied on users.id=jobapplied.user_id where jobapplied.job_id=$1",
      [jobId]
    );
    const allJobsList = await pool.query(
      "select * from jobs where is_deleted='false' and id=$1 ORDER BY created_at DESC",
      [jobId]
    );
    console.log("email", allUserWithJobId.rows);
    console.log("alljobs=", allJobsList.rows);
    return res.render("jobDetails", {
      data: allUserWithJobId.rows,
      alljobs: allJobsList.rows,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

adminController.userDetails = async (req, res) => {
  try {
    const userid = req.query.id;
    console.log("userid", userid);
    const joinAllTable = await pool.query(
      "select * from users inner join jobapplied on users.id=jobapplied.user_id inner join jobs on jobapplied.job_id=jobs.id where users.id=$1",
      [userid]
    );
    return res.render("singleUserDetails", {
      status: "success",
      data: joinAllTable.rows,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

adminController.searchByjobTitle = async (req, res) => {
  try {
    console.log("search job");
    let job_title = req.body.search;
    console.log("job", job_title);
    job_title = "%" + job_title.toLowerCase() + "%";
    console.log(job_title);

    const result = await pool.query(
      `select * from jobs where job_title LIKE $1 AND is_deleted='false' ORDER BY created_at DESC`,
      [job_title]
    );

    return res.render("allJobs", { alljobs: result.rows });
  } catch (error) {
    return res.status(500).send(error);
  }
};

adminController.searchUser = async (req, res) => {
  try {
    console.log("search user");
    let userEmail = req.body.search;
    console.log("user", userEmail);
    userEmail = "%" + userEmail.toLowerCase() + "%";
    console.log(userEmail);

    const result = await pool.query(
      `select * from users where email LIKE $1 AND is_deleted='false'`,
      [userEmail]
    );

    return res.render("allusers", { allusers: result.rows });
  } catch (error) {
    return res.status(500).send(error);
  }
};

adminController.logout = async (req, res) => {
  try {
    console.log("backend logout");
    const user = req.user;
    await pool.query("update users set is_active='false' where id=$1", [
      user.id,
    ]);
    res.cookie("accessToken", "", { maxAge: 1 });
    return res.status(200).render("loginAdmin");
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = adminController;
