
document.addEventListener("deviceready", function() {
    console.log("device ready");
    var div = document.getElementById("map_canvas");

    // Create a Google Maps native view under the map_canvas div.
    var map = plugin.google.maps.Map.getMap(div);

    // Move to the position with animation
    /*map.animateCamera({

        target: {lat: 51.1288144, lng:5.074001 },
        zoom: 17,
        tilt: 0,
        bearing: 0,
        duration: 50
    });*/

    // Add a maker
    var marker = map.addMarker({
        position: {lat: 51.1288144, lng:5.074001 },
        title: "Welecome to \n" +
            "Cordova",
        snippet: "This plugi is awesome!"
        //animation: plugin.google.maps.Animation.BOUNCE
    });


    // Show the info window
    //marker.showInfoWindow();


    // If you click the button, do something...
    var button = document.getElementById("button");

    button.addEventListener("click", function() {
        map.animateCamera({

            target: {lat: 51.132076, lng:5.077086 },
            zoom: 16,
            tilt: 0,
            bearing: 0,
            duration: 50
        });

    });

    map.one(plugin.google.maps.event.MAP_READY, onMapInit);

}, false);

var marker = null;

function onMapInit(map) {



    var data = [
        {
            position: {lat: 51.132499, lng: 5.074668},
            title: "Ardis G Egan Intermediate School",
            icon: {
                url: 'img/polictieicon.png'
            }
        },
        {
            position: {lat: 51.133105,  lng:5.077554 },
            title: "Portola School",
            icon: {
                url: 'img/polictieicon.png'
            }
        },
        {
            position: {lat: 51.132795 , lng: 5.079249},
            title: "Isaac Newton Graham Middle School",
            icon: {
                url: 'img/cut.png'
            }
        },
        {
            position: {lat: 51.131428 , lng: 5.079807},
            title: "Los Altos High School",
            icon: {
                url: 'img/cut.png'
            }
        }
    ];

// Add markers
    var bounds = [];
    var markers = data.map(function(options) {
        bounds.push(options.position);
        return map.addMarker(options);
    });

// Set a camera position that includes all markers.
    /*map.moveCamera({
        target: bounds
    });
    */

// open the last marker.
    //markers[markers.length - 1].showInfoWindow();

    //console.log(map.getMyLocation());


// Get the current device location "without map"
    var option = {
        enableHighAccuracy: true // use GPS as much as possible
    };
    plugin.google.maps.LocationService.getMyLocation(option, function(location) {

        // Add a marker
        var text = ["Current your location:\n",
            "latitude:" + location.latLng.lat.toFixed(3),
            "longitude:" + location.latLng.lng.toFixed(3),
            "speed:" + location.speed,
            "time:" + location.time,
            "bearing:" + location.bearing].join("\n");

        marker = map.addMarker({
            title: text,
            label: "A",
            position: location.latLng,
            icon: {
                url: 'img/dief.png'
            }
        });

        var circle = map.addCircle({
            center: marker.getPosition(),
            radius: 50,
            fillColor: "rgba(238, 91, 91, 0.5)",
            strokeColor: "rgba(238, 91, 91, 0.75)",
            strokeWidth: 1
        });

        map.animateCamera({

            target: location.latLng,
            zoom: 15,
            tilt: 0,
            bearing: 0,
            duration: 0
        });


        //marker.showInfoWindow();

    });


    //update current location
    var watchID = null;
    var options = { frequency: 3000 };
    watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);


    function onSuccess(position) {
        console.log("update Locatie lat", position.coords.latitude, position.coords.longitude );
        console.log("loc", new plugin.google.maps.LatLng(position.coords.latitude,position.coords.longitude));
        if(plugin.google.maps.geometry.spherical.computeDistanceBetween(new plugin.google.maps.LatLng(position.coords.latitude,position.coords.longitude) ,new plugin.google.maps.LatLng(51.1462531,5.0027009))<200){
            console.log('You have arrived!');
        }else{
            console.log('NOT arrived!');

        }

        var newLatLng = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        marker.setPosition(newLatLng);




    }

    // onError Callback receives a [PositionError](PositionError/positionError.html) object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
    }



}

