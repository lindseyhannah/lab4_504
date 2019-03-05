window.onload = function(){
alert("This webpage would like to access your device's location to enhance your interactive experience with the map.  Pressing 'Ok' will access your device's GPS sensors to locate you on the map.");
} // On load, this alert notifies the user that the page will ask to access their location and gives a reason why. You can easily modify this text.

//var map = L.map('map').fitWorld(); //Here we initialize the map in the "map" div defined in the html body. Below, we call in Mapbox tiles and use the options to set the max zoom to 18, include our attribution, specify that the tiles set we want is mapbox.streets, and provide the access token for Mapbox's API


//Light and dark tiles
//help from https://leafletjs.com/examples/layers-control/example.html
var attr =  'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    Url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibG1oYW5uYWgiLCJhIjoiY2pzbWxmdmhqMDJ4MTQ1cDl3c3gxMHdrciJ9._sQF96416CRRTp7xyNxv-Q';

var light   = L.tileLayer(Url, {id: 'mapbox.light', attribution: attr}),
    dark  =  L.tileLayer(Url, {id: 'mapbox.dark',   attribution: attr});

var map = L.map('map', {
  layers: [light]
  }).fitWorld()
;

var baseLayers= {
  "Light": light,
  "Dark": dark
  };

L.control.layers(baseLayers).addTo(map);


//~*~*Buttons*~*~

//Locate Button
function gohome(){
    map.locate({
      setView: true, 
      maxZoom: 16, 
      timeout: 15000, 
      watch: false,
    })
  }  

//Info button
function infoFunc() {
  alert("This webpage is accessing your device's GPS to enhance your interactive experience with the map. This allows for your device's location to be placed on the map")
};

//the below JS code takes advantage of the Geolocate API as it is incorporated in the Leaflet JS API with the locate method
function onLocationFound(e) { //this function does three things if the location is found: it defines a radius variable, adds a popup to the map, and adds a circle to the map.

  var radius = e.accuracy / 2;//this defines a variable radius as the accuracy value returned by the locate method divided by 2. It is divided by 2 because the accuracy value is the sum of the estimated accuracy of the latitude plus the estimated accuracy of the longitude. The unit is meters.
  var r= radius.toFixed(2); //rounds the radius to 2 decimal places 
  var here = e.latlng;


  L.marker(e.latlng).addTo(map)
    .bindPopup("Your location is " + here + " and you are within " + r + " meters of this point.").openPopup();
  //this adds a Leaflet popup to the map at the lat and long returned by the locate function. The text of the popup is defined here as well. Please change this text to specify what unit the radius is reported in.

  L.circle(e.latlng, radius).addTo(map); // this adds a Leaflet circle to the map at the lat and long returned by the locate function. Its radius is set to the var radius defined above.
  //You're original coment said that color should be blue if r< 30.  Code originally said "green" for this condition but I changed it to blue to match comment. 
  if (radius < 30) {
    L.circle(e.latlng, radius, {color: 'blue'}).addTo(map);
  }
  else{
    L.circle(e.latlng, radius, {color: 'red'}).addTo(map);
  }
}


function onLocationError(e) {
  alert(e.message);
}
//this function runs if the location is not found when the locate method is called. It produces an alert window that reports the error

//these are event listeners that call the functions above depending on whether or not the locate method is successful
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

//This specifies that the locate method should run
map.locate({
  setView: true, //this option centers the map on location and zooms
  maxZoom: 16, // this option prevents the map from zooming further than 16, maintaining some spatial context even if the accuracy of the location reading allows for closer zoom
  timeout: 15000, // this option specifies when the browser will stop attempting to get a fix on the device's location. Units are miliseconds. Change this to 5000 and test the change. Before you submit, change this to 15000.
  watch: false, // you can set this option from false to true to track a user's movement over time instead of just once. For our purposes, however, leave this option as is.
});
