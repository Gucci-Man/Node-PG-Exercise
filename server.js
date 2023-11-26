/** Server startup for BizTime. */
//console.log(`NODE_ENV is ${process.env.NODE_ENV}`);

const app = require("./app");


app.listen(3000, function () {
  console.log("Listening on 3000");
});