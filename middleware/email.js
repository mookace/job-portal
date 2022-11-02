const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(
  process.env.Client_ID,
  process.env.Client_secret
);
OAuth2_client.setCredentials({ refresh_token: process.env.refresh_token });

function send_mail(name, adminEmail, job_title, company_name) {
  const accessToken = OAuth2_client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "rajbanshimukesh999@gmail.com",
      clientId: process.env.Client_ID,
      clientSecret: process.env.Client_secret,
      refreshToken: process.env.refresh_token,
      accessToken: accessToken,
    },
  });

  const mail_option = {
    from: "Job Portal <${rajbanshimukesh999@gmail.com}>",
    to: adminEmail,
    subject: "Job Apply",
    html: get_html_message(name, job_title, company_name),
  };

  transporter.sendMail(mail_option, function (error) {
    if (error) {
      console.log("Error:", error);
    }
    transporter.close();
  });
}

function get_html_message(name, job_title, company_name) {
  return `<h3>${name} has apply for ${job_title} , Company Name : ${company_name}.</h3>`;
}

module.exports = send_mail;
