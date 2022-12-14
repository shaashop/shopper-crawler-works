var createError = require("http-errors");
require("express-async-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// pre process
app.use(async function (req, res, next) {
  res.locals.meta = {};
  res.locals.meta.BOARD_LINE_LIMIT = 10;
  next();
});

const RoutesSetter = require("./routes/routes_setter");
RoutesSetter.setRoutes(app);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ status: "error", message: err.message, stack: err.stack });
  // res.render('error');
});

console.log("server started");
module.exports = app;
