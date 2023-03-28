var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var indexRouter = require("./routes/index");
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

var app = express();

// convert json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// make route
app.use("/", indexRouter);

// swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(require(swaggerDocument))
);

// morgan
app.use(logger("dev"));

// Passport
require("./configs/passport");

//limiter
app.use(require("./configs/rateLimit"));

// metric
app.use(require("./configs/metric"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
