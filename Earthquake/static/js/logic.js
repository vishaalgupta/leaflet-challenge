var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

d3.json(queryUrl).then(function (data) {
    console.log(data);
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  var depths = [];
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3> Location: ${feature.properties.place}</h3><hr><p> Magnitude: ${feature.properties.mag}</p><hr><p> Depth: ${feature.geometry.coordinates[2]}</p>`);
    //depth.push(feature.geometry.coordinates[2]);
  }
  console.log("Earthquake", earthquakeData);
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData,{
    pointToLayer: function (feature, latlng) {
     return new L.circleMarker(latlng, {
       radius: feature.properties.mag,
       fillColor: getColor(feature.geometry.coordinates[2]),
       weight: 1,
       opacity: 1,
       fillOpacity: 0.8
     });
     },
     onEachFeature: onEachFeature
   });
   
  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      0, 0
    ],
    zoom: 2,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    console.log("Legend", earthquakes);
    var div = L.DomUtil.create("div", "info legend");
    var depth = ["0-20", "20-50", "50-100", "100-300", "300+"];
    var colors = ["#8AF783", "#4CEC40", "#ECEC40", "#EC7A40", "#EC4C40"];
    var labels = [];
    var legendInfo = "<h1>Depth</h1>"

    div.innerHTML = legendInfo;

    colors.forEach(function(limit, index) {
      labels.push("<ul style=\"background-color: " + colors[index]+ "\">" + depth[index] + "</ul>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    console.log("Inner HTML", div.innerHTML);
    return div;
  };
  legend.addTo(myMap);

}

function getColor(depth) {
  if (depth >= 0.00 && depth < 20 ) {
    return '#8AF783';
  }
  else if (depth >= 20.00 && depth < 50) {
    return '#4CEC40';
  }
  else if (depth >= 50.00 && depth < 100) {
    return '#ECEC40';
  }
  else if (depth >= 100.00 && depth < 300) {
    return '#EC7A40';
  }
  else {
    return '#EC4C40';
  }
}


