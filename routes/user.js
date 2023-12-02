const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsnc = require("../utils/wrapAsync.js");
const passport = require("passport");
const { reviewsSchema } = require("../schema");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user.js");


router.route("/signup")
    .get(userController.rederSignUpForm)
    .post(wrapAsnc(userController.signUp))

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, }), userController.login);


router.get("/logout", userController.logout);

module.exports = router;
