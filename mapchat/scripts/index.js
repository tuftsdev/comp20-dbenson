// Generated by CoffeeScript 1.7.1
(function() {
  var error, options, success;

  console.log("Hello world");

  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  success = function(pos) {
    var crd, http, params, url;
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
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 200) {
        console.log(http.responseText);
        return alert(http.responseText);
      }
    };
    return http.send(params);
  };

  error = function(error) {
    return console.warn(error);
  };

  navigator.geolocation.getCurrentPosition(success, error, options);

}).call(this);
