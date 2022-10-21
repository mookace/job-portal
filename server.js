const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const logger = require("morgan");

const pool = require("./dbconfig/dbconfig");
const routes = require("./routes/index");

const PORT = 8000 || process.env.PORT;

//morgan
app.use(logger("dev"));

//bodyParser
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.set("view engine", "ejs");

//Database Connection
pool
  .connect()
  .then(() => {
    console.log("Database Connected Successfull");
  })
  .catch((err) => console.log("Database Connected Failed", err));

// Use Routes
app.use("/api", routes);
// app.use("/public", express.static(path.join(__dirname, "public")));

app.listen(PORT, (res, err) => {
  if (!err) {
    console.log(`Server is running on port=${PORT}`);
  } else {
    console.log("Failed to connect server");
  }
});
