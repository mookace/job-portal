const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const logger = require("morgan");

const pool = require("./dbconfig/dbconfig");
const routes = require("./routes/index");

const PORT = 8000 || process.env.PORT;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//Database Connection
pool
  .connect()
  .then(() => {
    console.log("Database Connected Successfully");
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
