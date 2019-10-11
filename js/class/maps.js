let Maps = function () {
    let map;
    let realTimeMarker;
    let mapMarkers = [];
    let UsersMarker = new Map();

    let init = function(socket,gameId,mapp){
        map = mapp;

        // Setings
        //map.setCompassEnabled(isEnabled);

        // Set possition
        var latlng = new plugin.google.maps.LatLng(-24.397, 140.644);



        use = Localstoragegame.getLocalStorageGame("userId");

        // compas
        map.setCompassEnabled(true);



        socket.emit('maps.getDeviceMarker', {gameId:gameId,userId:use});

        //map.one(plugin.google.maps.event.MAP_READY, _onMapInit);

        _receiveSocket(socket);
        // load maps labels
        _onMapInit(socket,gameId);
    };

    let _onMapInit = function(socket,gameId){
        // get maps
        socket.emit('maps.getMaps', {gameId:gameId});

    }

    let updateUserLocation = function(loca){
        console.log("ok",loca);
        // Set posistion
        realTimeMarker.setPosition(loca);
        realTimeMarker.setCompassEnabled(true);

        //updateCamera(loca);
    }

    let removeDeviceLocation = function(users){
        userId = Localstoragegame.getLocalStorageGame("userId");
        users.forEach((user, index) => {

            if(user.id == userId){
                console.log("good",user);

                delete users[index];
            }
        });
        return users;
    }

    let updateUsersLocation = function(use){
        users = removeDeviceLocation(use);
        //console.log("update", users);
        users.forEach(function(user){
            ma = UsersMarker.get(user.id);
            if(ma){
                ma.setPosition(user.location.latlng);

            }else{
                addNewUsersMarker(user);
            }


            //console.log(user.id);
        });
    }

    let addNewUsersMarker = function(user){
        console.log("Add new marker");
        var newMarker = map.addMarker({
            title: user.name,
            label: name._shot,
            position: user.location.latlng,
            icon: {
                url: 'img/' + user.icon,
                "size": {
                    "width": 40,
                    "height": 40
                }
            }
        });
        UsersMarker.set(user.id, newMarker);


    }

    let zoomRealTimeMarker = function(location){
        map.animateCamera({
            target:{lat: 51.1462244, lng: 5.0027229},
            zoom:16,
            tilt: 0,
            bearing: 0,
            duration: 0
        });
    }

    let updateCamera = function(location){
        map.animateCamera({
            target: location,
            tilt: 0,
            bearing: 0,
            duration: 0
        });

    }

    let _collisionDetection = function(firstLocation,secondLocation){

        var dlat = firstLocation.lat - secondLocation.lat;
        var dlng = firstLocation.lng - secondLocation.lng;
        var distance = Math.sqrt(dlat * dlat + dlng * dlng);

        if (distance < 0.0002) {
            // collision detected!
            console.log("collision");


            var circle = map.addCircle({
                center: secondLocation,
                radius: 20,
                fillColor: "rgba(238, 91, 91, 0.5)",
                strokeColor: "rgba(238, 91, 91, 0.75)",
                strokeWidth: 1
            });
        }
    }

    let collisionDetectionMarkers = function(Location){
        mapMarkers.forEach(function(marker){
            _collisionDetection(Location,new plugin.google.maps.LatLng(marker.lat,marker.lng));
        });
    }


    let _receiveSocket = function(socket){

        socket.on('maps.getDeviceMarker', function(message) {
            console.log("maps.getDeviceMarker", message.data);

            data = message.data;
            realTimeMarker = map.addMarker({
                title: data.name,
                label: data._shot,
                position: data.location.latlng,
                icon: {
                    url: 'img/'+data.icon,
                    "size": {
                        "width": 40,
                        "height": 40
                    }
                }
            });

        });


        socket.on('maps.getMaps', function(message) {
            console.log(message.data);

            data =message.data;
            // Add markers

            var markers = data.map(function(options) {
                mapMarkers.push(options.position);
                return map.addMarker(options);
            });



        });


        //error
        socket.on('maps.error', function(message) {
            console.log(message.data);
            $.snackbar({content: message.data});
        });


    }


    return {
        init: init,
        updateUserLocation:updateUserLocation,
        collisionDetectionMarkers:collisionDetectionMarkers,
        zoomRealTimeMarker:zoomRealTimeMarker,
        updateUsersLocation:updateUsersLocation
    };

}();
