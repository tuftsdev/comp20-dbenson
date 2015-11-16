// Generated by CoffeeScript 1.7.1
(function() {
  var crd, error, haversine, makeMarker, options, success;

  options = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0
  };

  crd = null;


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


  /*
  Handles panning the map when a message is clicked
   */

  success = function(pos) {
    var http, map, myOptions, params, url, yourLocation;
    crd = pos.coords;
    yourLocation = new google.maps.LatLng(crd.latitude, crd.longitude);
    myOptions = {
      zoom: 13,
      center: yourLocation,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), myOptions);
    window.mapPan = function(loc) {
      map.panTo(loc);
      document.getElementById("map").scrollIntoView();
      return loc;
    };
    http = new XMLHttpRequest();
    url = "https://comp20-dbenson.herokuapp.com/sendlocation";
    params = "login=EricDapper&lat=" + crd.latitude + "&lng=" + crd.longitude + "&message=Hello%20World";
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function() {
      var byDistance, content, distance, i, innerHtml, loc, locations, people, _i, _j, _len, _len1;
      if (http.readyState === 4 && http.status === 200) {
        locations = JSON.parse(http.responseText);
        console.log(locations);
        people = document.getElementById("people");
        innerHtml = "";
        for (i = _i = 0, _len = locations.length; _i < _len; i = ++_i) {
          loc = locations[i];
          loc.distance = haversine(crd.latitude, crd.longitude, loc.lat, loc.lng);
          locations[i] = loc;
        }
        byDistance = function(a, b) {
          return a.distance - b.distance;
        };
        locations.sort(byDistance);
        for (_j = 0, _len1 = locations.length; _j < _len1; _j++) {
          loc = locations[_j];
          distance = loc.distance.toFixed(2);
          content = "<h2> " + loc.message + " </h2> <p>" + loc.login + "</p> <p>" + distance + "km</p>";
          makeMarker(map, loc.lat, loc.lng, content);
          innerHtml += "<div class=\"location col-xs-12\">\n" + content + "\n<span class=\"glyphicon glyphicon-search search\" aria-hidden=\"true\" aria-label=\"Locate\" onclick=\"mapPan({lat:" + loc.lat + ", lng:" + loc.lng + "})\"></span>\n</div>";
        }
        return people.innerHTML = innerHtml;
      }
    };
    return http.send(params);
  };

  error = function(error) {
    return alert("There was an error trying to locate your position, please refresh the page");
  };

  makeMarker = function(map, lat, lng, title) {
    var infowindow, marker;
    if (lat === crd.latitude && lng === crd.longitude) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        title: title,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 5,
          strokeColor: '#03A9F4'
        }
      });
    } else {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        title: title
      });
    }
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
