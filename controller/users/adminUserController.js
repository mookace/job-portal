const adminController = {};
const { query } = require("express");
const pool = require("../../dbconfig/dbconfig");

adminController.allFrontUserList = async (req, res) => {
  try {
    const allUsers = await pool.query(`select * from users`);
    return res.status(200).send({ status: "success", data: allUsers.rows });
  } catch (error) {
    return res.status(500).send(error);
  }
};

adminController.postJobs = async (req, res) => {
  try {
    console.log("job");
    const jobs = req.body;
    const newJobs = await pool.query(
      "insert into jobs(company_name,job_title,no_of_openings,job_category,job_location,job_level,experience,expiry_date,skills,job_description,salary,created_at) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,current_timestamp) returning *",
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
      ]
    );
    return res.status(200).send({ status: "success", data: newJobs.rows });
  } catch (error) {
    return res.status(500).send(error);
  }
};

adminController.allJobs = async (req, res) => {
  try {
    const allJobsList = await pool.query(
      "select * from jobs ORDER BY created_at DESC"
    );
    // console.log("sdfghjkncbjvsiuch", allJobsList.rows);
    return res.status(200).send({ status: "success", data: allJobsList.rows });
  } catch (error) {
    return res.status(500).send(error);
  }
};

adminController.searchById = async (req, res) => {
  try {
    let id = req.params.id;
    const result = await pool.query(`select * from jobs where id=${id}`);
    return res.status(200).send({ status: "success", data: result.rows });
  } catch (error) {
    return res.status(500).send(error);
  }
};

adminController.searchByjobTitle = async (req, res) => {
  try {
    console.log("hello search by job title");
    let job_title = req.params.jobtitle;
    job_title = "%" + job_title + "%";
    console.log(job_title);
    const result = await pool.query(
      `select * from jobs where job_title LIKE $1 ORDER BY created_at DESC`,
      [job_title]
    );
    return res.status(200).send({ status: "success", data: result.rows });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = adminController;
