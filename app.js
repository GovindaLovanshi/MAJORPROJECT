if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewRoter = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const userRouter = require("./routes/user.js");

const DBUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(DBUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const MongoStore = require("connect-mongo");

const store = MongoStore.create({
  mongoUrl: DBUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // in second
});

store.on("error", () => {
  console.log("Error in Mongo Session Store", err);
});
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resavae: false,
  saveUnintilized: true,
  cookie: {
    // expiry date cookie ki
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // cross cripting attack  se save krne ke liye httpOnly ko true krtr hai
  },
};

app.use(session(sessionOption));
app.use(flash()); // flash ko route(flsh ko rote ki help se hi krte hai) se pahele implement krna hai

app.use(passport.initialize());
app.use(passport, session());
passport.use(new LocalStrategy(User.authenticate())); // password change sha256 algorithm are use to  algo

passport.serializeUser(User.serializeUser()); // user login krta detail store
passport.deserializeUser(User.deserializeUser()); // user login krne ke badd  unstore / remove

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("Error");
  res.locals.currUser = req.body;
  next();
});

app.use("/listing", listingsRouter);
app.use("/review/:id/reviews", reviewRoter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page is Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "SOMETHING WENT WRONG" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCoderender).render("error2.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
