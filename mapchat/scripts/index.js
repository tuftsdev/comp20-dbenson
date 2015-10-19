// Generated by CoffeeScript 1.7.1
(function() {
  var error, haversine, makeMarker, options, success;

  console.log("Hello world");

  options = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0
  };


  /*
  Courtesy of http://stackoverflow.com/questions/5260423/torad-javascript-function-throwing-error
   */

  haversine = function(lat1, lon1, lat2, lon2) {
    var R, a, dLat, dLon;
    R = 6371;
    dLat = (lat2 - lat1) * Math.PI / 180;
    dLon = (lon2 - lon1) * Math.PI / 180;
    a = 0.5 - Math.cos(dLat) / 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * (1 - Math.cos(dLon)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
  };

  success = function(pos) {
    var crd, http, map, myOptions, params, url, yourLocation;
    crd = pos.coords;
    console.log('Your current position is:');
    console.log('Latitude : ' + crd.latitude);
    console.log('Longitude: ' + crd.longitude);
    console.log('More or less ' + crd.accuracy + ' meters.');
    http = new XMLHttpRequest();
    url = "https://secret-about-box.herokuapp.com/sendLocation";
    params = "login=EricDapper&lat=" + crd.latitude + "&lng=" + crd.longitude + "&message=Hello%20World";
    console.log(params);
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    yourLocation = new google.maps.LatLng(crd.latitude, crd.longitude);
    myOptions = {
      zoom: 13,
      center: yourLocation,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), myOptions);
    window.mapPan = function(loc) {
      console.log(loc);
      map.panTo(loc);
      return loc;
    };
    http.onreadystatechange = function() {
      var content, distance, innerHtml, location, locations, people, _i, _len;
      if (http.readyState === 4 && http.status === 200) {
        console.log(http.responseText);
        locations = JSON.parse(http.responseText);
        people = document.getElementById("people");
        innerHtml = "";
        for (_i = 0, _len = locations.length; _i < _len; _i++) {
          location = locations[_i];
          distance = haversine(crd.latitude, crd.longitude, location.lat, location.lng).toFixed(2);
          content = "<h2> " + location.message + " </h2> <p>" + location.login + "</p> <p>" + distance + "km</p>";
          makeMarker(map, location.lat, location.lng, content);
          innerHtml += "<div class=\"location .col-md-4 .col-xs-12 .col-s-6\" onclick=\"mapPan({lat:" + location.lat + ", lng:" + location.lng + "})\">" + content + "</div>";
        }
        return people.innerHTML = innerHtml;
      }
    };
    return http.send(params);
  };

  error = function(error) {
    return console.warn(error);
  };

  makeMarker = function(map, lat, lng, title) {
    var infowindow, marker;
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      title: title
    });
    marker.setMap(map);
    infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(marker.title);
      return infowindow.open(map, marker);
    });
    return marker;
  };

  window.init = function() {
    return navigator.geolocation.getCurrentPosition(success, error, options);
  };

}).call(this);
