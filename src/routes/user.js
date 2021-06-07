const router = require("express").Router();
const UserController = require("../controller/User");
const passport = require("passport");

router.route("/signup").post(UserController.signUp);
router  
  .route("/login")
  .post(
    passport.authenticate("local", { session: true }),
    UserController.login
  );
module.exports = router;
