const User = require('../models/user');

module.exports.rederSignUpForm = (req, res) => {
    res.send("users/signup.ejs");
};
module.exports.signUp = async(req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        })

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }

};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
    res.flash("success", "Welcome To Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    req.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    res.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You Are Logged Out");
        res.redirect("/listings")
    });
};