"use strict";

const express = require("express");

const cors = require('cors');

const bodyParser = require("body-parser"); // eslint-disable-next-line no-unused-vars


const passportConfig = require("./src/helpers/passport");

const passport = require("passport");

const mongoose = require("mongoose");

const cookieSession = require("cookie-session");

mongoose.connect("mongodb://localhost:27017/wsns", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieSession({
  maxAge: 1000 * 60 * 3,
  // 3 minutes
  keys: ["somesecretkey"]
}));
app.use(passport.initialize());
app.use(passport.session());

const UserRouter = require("./src/routes/user");

app.use("/user/", UserRouter);

const SimulationRouter = require("./src/routes/simulation");

app.use("/sim", SimulationRouter);
app.listen(8888, () => {
  console.log("server is listening on 8888");
});