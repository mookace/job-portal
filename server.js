const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const logger = require("morgan");

const pool = require("./dbconfig/dbconfig");
const routes = require("./routes/index");
const front = require("./routes/frontend/frontend");
const admin = require("./routes/frontend/admin");

const PORT = 8000 || process.env.PORT;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Database Connection
pool
  .connect()
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => console.log("Database Connected Failed", err));

// Use API Routes
app.use("/api", routes); //api routes
// app.use("/public", express.static(path.join(__dirname, "public")));

// Frontend Routes
app.use("/front", front); //client route
app.use("/admin", admin); //admin route

app.listen(PORT, (res, err) => {
  if (!err) {
    console.log(`Server is running on port=${PORT}`);
  } else {
    console.log("Failed to connect server");
  }
});
