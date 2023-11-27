mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: Listing.geometry.cordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});

// console.log(cordinates);
const mapMarker = new mapboxgl.Marker({ color: "red" })
  .setLnglat(cordinates) //Listing.geometry.cordinates
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(<h4> $ {Listing.tittle} </h4>)
  )
  .addTo(map);

// const mapMarker2 = new mapboxgl.Marker({ color: "red" })
// .setLnglat(cordinates) //Listing.geometry.cordinates
// .setPopup(
//   new mapboxgl.Popup({ offset: 25 }).setHTML(<h4> $ {Listing.tittle} </h4>
//   )
// )
// .addTo(map);
