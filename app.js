/** BizTime express application. */

const express = require("express");
const app = express();
const ExpressError = require("./expressError")

// Parse request bodies for JSON
app.use(express.json());

const comp_routes = require("./routes/companies");
const invoice_routes = require("./routes/invoices");
const industry_routes = require("./routes/industries")

app.use("/companies", comp_routes);
app.use("/invoices", invoice_routes);
app.use("/industries", industry_routes);

/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
