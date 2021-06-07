const Users = require("../models/User");

module.exports = {
  // eslint-disable-next-line no-unused-vars
  signUp: async (req, res, next) => {
    console.log("gel gel hele ")
    const body = req.body;
    const user = new Users({
      username: body.username,
      password: body.password,
      role: "user",
      privilages: ["addSim", "viewSim", "editOwnData"],
    });
    const regUser = await user.save();
    res.json(regUser);
  },
  // eslint-disable-next-line no-unused-vars
  login: async (req, res, next) => {
    console.log(req.body);
    console.log(req.user);
    res.json(req.body);
  },
};
