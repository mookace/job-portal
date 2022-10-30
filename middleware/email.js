const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(
  process.env.Client_ID,
  process.env.Client_secret
);
OAuth2_client.setCredentials({ refresh_token: process.env.refresh_token });

function send_mail(name, admin, recipient) {
  const accessToken = OAuth2_client.getAccessToken();
  let maillist = [admin, recipient];

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
    from: "job portal <${rajbanshimukesh999@gmail.com}>",
    to: maillist,
    subject: "nodemailer test",
    html: get_html_message(name),
  };

  transporter.sendMail(mail_option, function (error) {
    if (error) {
      console.log("Error:", error);
    }
    transporter.close();
  });
}

function get_html_message(name) {
  return `<h3>${name} has apply for job.</h3>`;
}

module.exports = send_mail;
