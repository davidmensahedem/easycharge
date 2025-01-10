// Document ready function
$(document).ready(function () {
  // Set the current date
  document.getElementById("currentDate").innerHTML = new Date().toUTCString();

  let userLat = 0;
  let userLon = 0;

  const selectedChargingStations = L.markerClusterGroup();
  let selectedChargingStationsIsInView = false;

  //
  // Leaflet Js Implementations
  //
  var map = L.map("map").setView([43.698327247001203, -79.436683017408996], 13);

  // Add the tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

  // Add a scale to the map
  L.control.scale({ position: "bottomleft" }).addTo(map);

  // Add a blue bootstrap badge
  var badge = L.control({ position: "topright" });

  badge.onAdd = function (map) {
    var div = L.DomUtil.create("div", "badge badge-primary p-2");
    div.innerHTML = "Engineered By: David Edem Mensah";
    return div;
  };

  setTimeout(function () {
    badge.addTo(map);
  }, 5000);

  // Add a blue bootstrap badge
  var refreshBadge = L.control({ position: "bottomright" });

  refreshBadge.onAdd = function (map) {
    var refresher = L.DomUtil.create(
      "div",
      "badge badge-danger p-2 refresh-badge"
    );
    refresher.innerHTML = "Refresh to view all map features";
    refresher.addEventListener("click", function () {
      map.eachLayer(function (layer) {
        if (
          layer instanceof L.Marker ||
          layer instanceof L.MarkerClusterGroup
        ) {
          map.removeLayer(layer);
        }
      });

      policeStationLayer.addTo(map);
      vehicleChargingStationLayer.addTo(map);
      cafeToLayer.addTo(map);
      coolPlacesStationLayer.addTo(map);
    });
    return refresher;
  };

  setTimeout(function () {
    refreshBadge.addTo(map);
  }, 5000);

  //

  let policeStationCount = 0;
  let vehicleChargingStationCount = 0;
  let coolPlacesCount = 0;
  let cafeToCount = 0;

  /*
    Add the police stations layer
  */

  let baseUrl = "http://127.0.0.1:5000";

  const policeStationLayer = L.markerClusterGroup();

  L.geoJSON.ajax(`${baseUrl}/api/police-stations`, {
    onEachFeature: function (feature) {
      policeStationCount++;
    },
    pointToLayer: function (feature, latlng) {
      let marker = L.circleMarker(latlng, {
        radius: 5,
        fillColor: "blue",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      });
      let policeStationPopupContent = `<span>Organization:</span> <strong>${feature.properties.ORGANIZATION}</strong></br>
      <span>Facility:</span> <strong>${feature.properties.FACILITY}</strong></br>
      <span>Postal Code:</span> <strong>${feature.properties.POSTAL_CODE}</strong></br>
      <span>Address:</span> <strong>${feature.properties.ADDRESS}</strong></br>`;
      marker.bindPopup(policeStationPopupContent);
      policeStationLayer.addLayer(marker);
      return marker;
    },
  });

  /*
    End of adding the police stations layer
  */

  /*
    Add the City vehicle charging stations layer
  */
  const vehicleChargingStationLayer = L.markerClusterGroup();

  L.geoJSON.ajax(`${baseUrl}/api/vehicle-charging-stations`, {
    pointToLayer: function (feature, latlng) {
      let marker = L.marker(latlng, {
        icon: L.icon({
          iconUrl: "static/image/thnb.webp",
          iconSize: [20, 24],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      });

      let vehicleChargingStationPopupContent = `<span>Address:</span> <strong>${feature.properties.Address}</strong></br>
      <span>Location:</span> <strong>${feature.properties.Location}</strong></br>
      <span>Type:</span> <strong>${feature.properties.Type}</strong></br>
      <span>Level 2 Charging Ports:</span> <strong>${feature.properties["Level3_Charging_Ports"]}</strong></br>
      <span>Level 3 Charging Ports:</span> <strong>${feature.properties["Level2_Charging_Ports"]}</strong></br>`;

      marker.bindPopup(vehicleChargingStationPopupContent);

      vehicleChargingStationLayer.addLayer(marker);

      return marker;
    },
    onEachFeature: function (feature, layer) {
      vehicleChargingStationCount++;
    },
  });

  /*
    End of the City vehicle charging stations layer
  */

  /*
    Add Cafeto locations
  */

  const cafeToLayer = L.markerClusterGroup();

  L.geoJSON.ajax(`${baseUrl}/api/cafeto-data`, {
    pointToLayer: function (feature, latlng) {
      let marker = L.circleMarker(latlng, {
        radius: 5,
        fillColor: "green",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      });

      cafeToLayer.addLayer(marker);

      return marker;
    },
    onEachFeature: function (feature, layer) {
      cafeToCount++;
    },
  });

  /*
    End of add Cafeto locations
  */

  /*
    Add the air conditioned and cool places stations layer
  */
  const coolPlacesStationLayer = L.markerClusterGroup();

  L.geoJSON.ajax(`${baseUrl}/api/air-conditioned-places`, {
    pointToLayer: function (feature, latlng) {
      let marker = L.circleMarker(latlng, {
        radius: 5,
        fillColor: "#f72b26",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      });

      let coolPlacesStationPopupContent = `<span>Address:</span> <strong>${feature.properties.address}</strong></br>
        <span>Location:</span> <strong>${feature.properties.locationName}</strong></br>
        <span>Description:</span> <strong>${feature.properties.locationTypeCode}</strong></br>
        <span>Phone:</span> <strong>${feature.properties.phone}</strong></br>
        <span>Eligibility:</span> <strong>${feature.properties.eligibility}</strong></br>`;

      marker.bindPopup(coolPlacesStationPopupContent);

      coolPlacesStationLayer.addLayer(marker);

      return marker;
    },
    onEachFeature: function (feature, layer) {
      coolPlacesCount++;
    },
  });

  /*
    End of adding the air conditioned and cool places stations layer
    */

  /*
  Get the current location of the user
  */

  // Function to get user's location coordinates

  let showShareLocCordinates = document.getElementById(
    "showShareLocCordinates"
  );

  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        userLat = position.coords.latitude;
        userLon = position.coords.longitude;
        var coordinates = "Latitude: " + userLat + ", Longitude: " + userLon;
        showShareLocCordinates.innerHTML = coordinates;

        map.flyTo([userLat, userLon], 13, {
          duration: 2,
          easeLinearity: 0.25,
        }); // Center the map to user's location

        L.marker([position.coords.latitude, position.coords.longitude])
          .addTo(map)
          .bindPopup("You are here!")
          .openPopup();
      });

      isLocationShared = true;

      shareLocBtn.disabled = true;
    } else {
      showShareLocCordinates.innerHTML =
        "Geolocation is not supported by this browser.";
    }
  }

  let shareLocBtn = document.getElementById("shareLocBtn");
  shareLocBtn.addEventListener("click", getUserLocation);

  /*
  End of getting the current location of the user
  */

  // add base map layers
  const baseLayers = {
    "Police Stations": policeStationLayer,
    "Cafeto Locations": cafeToLayer,
    "Cool Places": coolPlacesStationLayer,
  };

  // add layer control to the map
  setTimeout(function () {
    L.control.layers(baseLayers).addTo(map);
  }, 6000);

  // Add a map Legend
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");

    div.innerHTML = `<div class="mapLegend"><h5>Legend</h5>
                <i style="background: #2d2ef3"></i> Police Stations <small class="badge badge-police"><span id="">*</span></small><br>
                <i style="background: #ffa500"></i> Vehicle Charging Stations <small class="badge badge-vehicle-charge"><span id="">*</span></small><br> 
                <i style="background: #f72b26"></i> Cool Places <small class="badge badge-cool-places"><span id="">*</span></small><br>
                <i style="background: #197f19"></i> CafeTo Restaurants <small class="badge badge-cafeto"><span id="">*</span></small></div><br>`;

    return div;
  };

  setTimeout(function () {
    legend.addTo(map);
  }, 4000);

  /*
  Toggle map layers
  */
  let showAllLayers = true;

  let viewForLayers = document.getElementById("viewForLayers");

  function ToggleMapLayers() {
    if (showAllLayers) {
      policeStationLayer.addTo(map);
      if (!selectedChargingStationsIsInView) {
        vehicleChargingStationLayer.addTo(map);
      }
      cafeToLayer.addTo(map);
      coolPlacesStationLayer.addTo(map);

      viewForLayers.style.display = "block";
      showAllLayers = false;
    } else {
      map.removeLayer(policeStationLayer);
      map.removeLayer(vehicleChargingStationLayer);
      map.removeLayer(cafeToLayer);
      map.removeLayer(coolPlacesStationLayer);

      showAllLayers = true;
      viewForLayers.style.display = "none";
    }
  }

  let viewAllLayersId = document.getElementById("viewAllLayersId");
  if (viewAllLayersId?.length && viewForLayers?.length) {
    viewAllLayersId?.addEventListener("click", ToggleMapLayers);

    setTimeout(function () {
      document.getElementById(
        "police-station-count"
      ).innerHTML = `Police Stations: ${policeStationCount}`;
      document.getElementById(
        "vehicle-charge-count"
      ).innerHTML = `Vehicle Charging Station: ${vehicleChargingStationCount}`;
      document.getElementById(
        "cools-places-count"
      ).innerHTML = `Cool Places: ${coolPlacesCount}`;
      document.getElementById(
        "cafeto-count"
      ).innerHTML = `CafeTo Locations: ${cafeToCount}`;
      viewForLayers.style.display = "block";
      ToggleMapLayers();
    }, 4000);
  }

  /*
  End of toggle map layers
  */

  /*
  Get the nearest vehicle charging station
  */

  let getNearestShortTermRentalsBtn = document.getElementById(
    "getNearestShortTermRentalsBtn"
  );

  let numberOfLocations = document.getElementById("numberOfLocations");

  let maximumVehicleChargingStationNumber = 0;

  numberOfLocations.value = 1;

  getNearestShortTermRentalsBtn.addEventListener("click", function (e) {
    e.preventDefault();

    maximumVehicleChargingStationNumber = parseInt(numberOfLocations.value);

    if (userLat == 0 && userLon == 0) {
      alert("Please share your location first");
      return;
    }

    if (
      maximumVehicleChargingStationNumber <= 0 ||
      maximumVehicleChargingStationNumber > 100
    ) {
      alert("Please enter a valid number from 1 to 100");
      return;
    }

    getNearestVehicleChargingStation(map, selectedChargingStations);
  });

  function getNearestVehicleChargingStation(map, selectedChargingStations) {
    // Clear existing layers
    map.eachLayer(function (layer) {
      if (layer instanceof L.Marker || layer instanceof L.MarkerClusterGroup) {
        map.removeLayer(layer);
      }
    });

    if (selectedChargingStationsIsInView) {
      map.removeLayer(selectedChargingStations);
    }

    // Fetch GeoJSON data and process
    fetch(`${baseUrl}/api/vehicle-charging-stations`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((geojson) => {
        console.log("GeoJSON data fetched:", geojson);

        // Calculate distances and add to features
        const userLocation = [userLon, userLat];
        geojson.features.forEach((feature) => {
          const distance = turf.distance(
            turf.point(userLocation),
            turf.point(feature.geometry.coordinates[0]),
            { units: "kilometers" }
          );
          feature.properties.distance = distance;
        });

        // Sort and filter the nearest stations
        const sortedStations = geojson.features
          .sort((a, b) => a.properties.distance - b.properties.distance)
          .slice(0, maximumVehicleChargingStationNumber);

        console.log(
          `Displaying ${sortedStations.length} nearest vehicle charging stations`
        );

        // Add only the sorted and filtered stations to the cluster group
        sortedStations.forEach((station) => {
          const latlng = [
            station.geometry.coordinates[0][1], // Latitude
            station.geometry.coordinates[0][0], // Longitude
          ];

          const marker = L.marker(latlng, {
            icon: L.icon({
              iconUrl: "static/image/thnb2.png",
              iconSize: [20, 24],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            }),
          });

          const popupContent = `
            <span>Address:</span> <strong>${
              station.properties.Address
            }</strong><br>
            <span>Location:</span> <strong>${
              station.properties.Location
            }</strong><br>
            <span>Type:</span> <strong>${station.properties.Type}</strong><br>
            <span>Level 2 Charging Ports:</span> <strong>${
              station.properties["Level2_Charging_Ports"]
            }</strong><br>
            <span>Level 3 Charging Ports:</span> <strong>${
              station.properties["Level3_Charging_Ports"]
            }</strong><br>
            <span>Distance:</span> <strong>${station.properties.distance.toFixed(
              2
            )} km</strong><br>
          `;

          marker.bindPopup(popupContent);
          selectedChargingStations.addLayer(marker);
        });

        // Add the filtered cluster group to the map
        map.addLayer(selectedChargingStations);

        const bounds = selectedChargingStations.getBounds();
        map.flyToBounds(bounds, {
          maxZoom: 16,
          padding: [50, 50],
          duration: 2,
          easeLinearity: 0.25,
        });

        selectedChargingStationsIsInView = true;

        setTimeout(function () {
          policeStationLayer.addTo(map);
          cafeToLayer.addTo(map);
          coolPlacesStationLayer.addTo(map);
        }, 5000);

        // Debug: Final cluster group layer count
        console.log(
          "Total markers added to cluster group:",
          selectedChargingStations.getLayers().length
        );
      })
      .catch((error) => {
        console.error("Error fetching or processing GeoJSON data:", error);
      });
  }

  /*
  End of get the nearest vehicle charging station
  */

  //
  // End of map features
  //
});
