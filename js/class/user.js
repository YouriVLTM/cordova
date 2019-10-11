//Follow live location
let User = function () {
    let gameId;
    let userId;
    let LatLng;
    let debugCounter = 0;

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
        //plugin.google.maps.LocationService.getMyLocation(option,updateLocation);

        //navigator.geolocation.watchPosition(updateLocation, updateLocationError);
        // active watch

        _setupWatch(2000);
        _setupWatchAllUsers(3000);

    };

    let _setupWatchAllUsers = function(freq){
        activeWatchAllUsers = setInterval(_getLocationAllUsers, freq);
    }

    let _getLocationAllUsers = function(){
        Socket.conn().emit('game.getAllUserLocation', {gameId:gameId});
    }

    let _setupWatch = function(freq){
        activeWatch = setInterval(_watchLocation, freq);
    }

    let _watchLocation = function(){
        navigator.geolocation.getCurrentPosition(
            updateLocation,
            updateLocationError,{
                enableHighAccuracy: true
            });
    }


    let updateLocation = function(position) {
        //var location = new plugin.google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        // get Game Id
        console.log(position);
        debugCounter+=1;
        $('#location').text(position.coords.latitude+ ' ' + position.coords.longitude+ ' '+ debugCounter);

        var loca = new plugin.google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        LatLng = loca;

        Maps.updateUserLocation(loca);
        // collision detection
        Maps.collisionDetectionMarkers(loca);

        // update location to server
        Socket.conn().emit('user.setLocation', {gameId:gameId,userId:userId,latlng:loca});


    }

    function updateLocationError(error) {
        alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
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






    let _receiveSocket = function(socket){
        //error

        socket.on('game.getAllUserLocation', function(message) {
            console.log(message.data);
            Maps.updateUsersLocation(message.data);
        });


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
