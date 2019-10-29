let Maps = function () {
    let map;
    let realTimeMarker;
    let mapMarkers = [];
    let UsersMarker = new Map();
    let message = null;

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

    let getMessage = function(){
        return message;
    }

    let _onMapInit = function(socket,gameId){
        // get maps
        socket.emit('maps.getMaps', {gameId:gameId});
    }

    let updateUserLocation = function(loca){
        // Set posistion
        realTimeMarker.setPosition(loca);

        //updateCamera(loca);
    }



    let removeDeviceLocation = function(users){
        userId = Localstoragegame.getLocalStorageGame("userId");
        users.forEach((user, index) => {
            if(user.id == userId){
                delete users[index];
            }
        });
        return users;
    }

    let updateUsersLocation = function(use){
        users = removeDeviceLocation(use);
        users.forEach(function(user){
            ma = UsersMarker.get(user.id);
            if(ma){
                ma.setPosition(user.location);

            }else{
                addNewUsersMarker(user);
            }


            //console.log(user.id);
        });
    }

    let addNewUsersMarker = function(user){
        if(user.location != null){

            console.log("Add new marker");
            var newMarker = map.addMarker({
                title: user.name,
                label: name._shot,
                position: user.location,
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
        if(firstLocation != null && secondLocation!= null){

            var dlat = firstLocation.lat - secondLocation.lat;
            var dlng = firstLocation.lng - secondLocation.lng;
            var distance = Math.sqrt(dlat * dlat + dlng * dlng);

            if (distance < 0.0002) {
                return true;
            }
        }
        return false;
    }

    let _multiCollisionDetectionMarkers = function(Location){
        var collisions = [];
        mapMarkers.forEach(function(marker){
            if(_collisionDetection(Location,marker.position)){
                if(!marker.taked) {
                    collisions.push(marker);
                }
            }
        });
        return collisions;
    }

    let _multiCollisionDetectionUsers = function(Location){
        var collisions = [];

        // get users
        users = JSON.parse(Localstoragegame.getLocalStorageGame("users"));
        users.forEach(function(user){
            if(user != null){
                if(_collisionDetection(Location,user.location)){
                    collisions.push(user);
                }
            }

        });
        return collisions;
    }

    let _getMarker = function(markerId){
        var ma;
        mapMarkers.forEach(function(marker){
            if(marker.id == markerId){
                console.log(marker,marker.id);
                ma = marker;
            }
        });
        return ma;
    }

    let _makeCircle = function(latlng){
        var circle = map.addCircle({
            center: latlng,
            radius: 20,
            fillColor: "#28a745",
            strokeColor: "#28a745",
            strokeWidth: 1
        });
    }



    let getMarkerAttribuut = function(markerId){
        marker = _getMarker(markerId);
        console.log(marker);
        _makeCircle(marker.position);

    }

    let collisionDetectionUsers = function(user){
        return _multiCollisionDetectionUsers(user.location);

    }

    let _getUser


    let collisionDetectionMarkers = function(Location){
        var markers = _multiCollisionDetectionMarkers(Location);





        //taken
        markers.forEach(function(marker){
            // kan take up raided
            raidedTake = false;


            if(marker.type == "raided"){
                // kijken welke item bezit
                items = marker.raided.item

                if(User.isTakedAttributes(items)){
                    // mag opnemen
                    raidedTake = true;
                }

            }

            console.log(raidedTake);

            if(marker.type != "raided" || raidedTake ){
                user = JSON.parse(Localstoragegame.getLocalStorageGame("user"));

                $('.modal-title').text("attribuut");
                $('.modal-text').text("U heeft een attribuut gevangen: \n" + marker.title);
                $('.modal-img').attr("src",marker.icon.url);
                $('.modal-img').width(marker.icon.size.width);
                $('.modal-img').height(marker.icon.size.height);


                $('#addAttribute').attr("data-id",marker.id);
                $('#canceledAttribute').attr("data-id",marker.id);
                $('#addAttributeModal').modal("show");
                marker.taked = true;



                // set Messages
                message = {
                    "message":{
                        "title" : marker.title,
                        "message" : user.name + " heeft een attribuut gevangen <img src='"+ marker.icon.url +"' ></img>",
                        "readUsers" : ["Agent","Prisoner"]

                    }
                };

            }

        });

    }


    let _receiveSocket = function(socket){

        socket.on('maps.getDeviceMarker', function(message) {
            console.log("maps.getDeviceMarker", message.data);

            data = message.data;
            realTimeMarker = map.addMarker({
                title: data.name,
                label: data.shot,
                position: data.location,
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
                mapMarkers.push(options);
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
        collisionDetectionUsers:collisionDetectionUsers,
        zoomRealTimeMarker:zoomRealTimeMarker,
        updateUsersLocation:updateUsersLocation,
        getMessage:getMessage,
        getMarkerAttribuut:getMarkerAttribuut
    };

}();
