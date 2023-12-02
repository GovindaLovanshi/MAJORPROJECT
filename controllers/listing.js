const Listing = require("../models/listing");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});

  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("Error", " Listings You requested for does not exist");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocoding({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let fileName = req.file.fileName;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, fileName };

  newListing.geometry = response.body.features[0].geometry; // store in database
  await newListing.save();

  req.flash("sucess", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let fileName = req.file.fileName;
    listing.image = { url, fileName };
    await listing.save();
  }
  req.flash("success", " Listings Updated!");
  return res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", " Listings Deleted!");
  res.redirect("/listings");
};
