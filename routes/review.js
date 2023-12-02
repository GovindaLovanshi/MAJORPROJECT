const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require('../controllers/reviews.js');
// review validation 



// reviews route  POST /listing/:id/reviews

router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReview));

//delete route revivew
// pull perator removes from an existing array all instance of a value or values that match a specified condition
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
