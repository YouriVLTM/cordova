//Follow live location
let User = function () {
    let gameId;
    let userId;

    let init = function(socket,map){
        socket.on('connect', function() {
            console.log("connection");
        });

        _receiveSocket(socket);

        // get value
        gameId = Localstoragegame.getLocalStorageGame("gameId");
        userId = Localstoragegame.getLocalStorageGame("userId");

        // update
        //var watchID = navigator.geolocation.watchPosition(updateLocation, updateLocationError, { frequency: 3000 });

        // Get the current device location "without map"
        var option = {
            enableHighAccuracy: true // use GPS as much as possible
        };
        plugin.google.maps.LocationService.getMyLocation(option,updateLocation);


    };

    let updateLocation = function(location) {
        // get Game Id
        console.log(location,location.latLng);

        Maps.updateUserLocation(location);

        // update location to server
        Socket.conn().emit('user.setLocation', {gameId:gameId,userId:userId,latlng:location.latLng});


    }

    let testCollesion = function(position) {
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


    function updateLocationError(error) {
        alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
    }



    let _receiveSocket = function(socket){
        //error
        socket.on('user.error', function(message) {
            console.log(message.data);
            $.snackbar({content: message.data});
        });

        socket.on('user.log', function(message) {
            console.log(message.data);
            $.snackbar({content: message.data});
        });

    }


    return {
        init: init
    };

}();
