/***
 *
 * @type {{init, getMarkerAttribuut, collisionDetectionMarkers, updateUsersLocation, updateUserLocation, zoomRealTimeMarker, getMessage, collisionDetectionUsers}}
 * @class Maps
 */
let Maps = function () {
    let map;
    let realTimeMarker;
    let mapMarkers = [];
    let UsersMarker = new Map();
    let message = null;

    /**
     * @constructs Maps
     * @param {Socket} socket - the connection
     * @param  mapp - init map
     * @param gameId
     */
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

    /**
     * @memberof Maps#
     * @returns {*}
     */
    let getMessage = function(){
        return message;
    }

    /**
     * @memberof Maps#
     * @param socket
     * @param gameId
     * @private
     */
    let _onMapInit = function(socket,gameId){
        // get maps
        socket.emit('maps.getMaps', {gameId:gameId});
    }

    /**
     * @memberof Maps#
     * @param loca
     */
    let updateUserLocation = function(loca){
        // Set posistion
        realTimeMarker.setPosition(loca);

        //updateCamera(loca);
    }


    /**
     * @memberof Maps#
     * @param users
     * @returns {*}
     */
    let removeDeviceLocation = function(users){
        userId = Localstoragegame.getLocalStorageGame("userId");
        users.forEach((user, index) => {
            if(user.id == userId){
                delete users[index];
            }
        });
        return users;
    }

    /**
     * @memberof Maps#
     * @param use
     */
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

    /**
     * @memberof Maps#
     * @param user
     */
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
    /**
     * @memberof Maps#
     * @param location
     */
    let zoomRealTimeMarker = function(location){
        map.animateCamera({
            target:{lat: 51.1462244, lng: 5.0027229},
            zoom:16,
            tilt: 0,
            bearing: 0,
            duration: 0
        });
    }

    /**
     * @memberof Maps#
     * @param location
     */
    let updateCamera = function(location){
        map.animateCamera({
            target: location,
            tilt: 0,
            bearing: 0,
            duration: 0
        });

    }

    /**
     * @memberof Maps#
     * @param firstLocation
     * @param secondLocation
     * @returns {boolean}
     * @private
     */
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

    /**
     * @memberof Maps#
     * @param Location
     * @returns {Array}
     * @private
     */
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

    /**
     * @memberof Maps#
     * @param Location
     * @returns {Array}
     * @private
     */
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

    /**
     * @memberof Maps#
     * @param markerId
     * @returns {*}
     * @private
     */
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

    /**
     * @memberof Maps#
     * @param latlng
     * @private
     */
    let _makeCircle = function(latlng){
        var circle = map.addCircle({
            center: latlng,
            radius: 20,
            fillColor: "#28a745",
            strokeColor: "#28a745",
            strokeWidth: 1
        });
    }


    /**
     * @memberof Maps#
     * @param markerId
     */
    let getMarkerAttribuut = function(markerId){
        marker = _getMarker(markerId);
        console.log(marker);
        _makeCircle(marker.position);

    }

    /**
     * @memberof Maps#
      * @param user
     * @returns {Array}
     */
    let collisionDetectionUsers = function(user){
        return _multiCollisionDetectionUsers(user.location);

    }

    let _getUser

    /**
     * @memberof Maps#
     * @param Location
     */
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
                $('.modal-text').html("U heeft een attribuut gevangen: \n" + marker.title);
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
                        "message" : user.name + " heeft een attribuut gevangen <img src='"+ marker.icon.url +"' class='iconAttribute' ></img>",
                        "readUsers" : ["Agent","Prisoner"]

                    }
                };

            }

        });

    }


    /**
     * @memberof Maps#
     * @param socket
     * @private
     */
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

    /**
     * @memberof Maps#
     */
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
