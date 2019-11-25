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

    /*Init local Id*/
    let _initSocket;
    let _initGameId;
    let _initUserId;


    /**
     * @classdesc A class of Map interact with the map. Control everything in the map.
     * @author youri Van Laer
     *
     *
     * @description Initialize this new map with given parameters initialize. Load the map.
     *
     *
     * @constructs Maps
     *
     * @param {Socket} socket - the connection
     * @param {Int} gameId - The unique number of the game
     * @param {Int} userId - The unique number of the user
     * @param {map} mapp - init map
     */
    let init = function(socket,gameId,userId,mapp){
        /*local parameters*/
        _initSocket = socket;
        _initGameId = gameId;
        _initUserId = userId;
        map = mapp;

        /*socket*/
        _receiveSocket();

        // Set a random possition
        var latlng = new plugin.google.maps.LatLng(-24.397, 140.644);

        // compas
        map.setCompassEnabled(true);

        /*Get all the markers in this game*/
        _initSocket.emit('maps.getDeviceMarker', {gameId:_initGameId,userId:_initUserId});

        // load maps labels
        _onMapInit();
    };

    /**
     * Receive message
     * @memberof Maps#
     * @returns {Json} message - Get the message box
     */
    let getMessage = function(){
        return message;
    }

    /**
     * Init the map
     * @memberof Maps#
     * @private
     */
    let _onMapInit = function(){
        // get maps
        _initSocket.emit('maps.getMaps', {gameId:_initGameId});
    }

    /**
     * Update this user location
     * @memberof Maps#
     * @param loca
     */
    let updateUserLocation = function(loca){
        // Set posistion
        realTimeMarker.setPosition(loca);

        //updateCamera(loca);
    }


    /**
     * Return all users without this user
     * @memberof Maps#
     * @param users
     * @returns {Array} users - return users
     */
    let removeDeviceLocation = function(users){
        users.forEach((user, index) => {
            if(user.id == _initUserId){
                delete users[index];
            }
        });
        return users;
    }

    /**
     * Updata all users location
     * @memberof Maps#
     * @param {Array} use - array with all users
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

        });
    }

    /**
     * Add new user in the map
     * @memberof Maps#
     * @param {json} user - User data
     */
    let addNewUsersMarker = function(user){
        if(user.location != null){
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
     * Zoom in on this user.
     * @memberof Maps#
     * @param {json} location - Set location of the camera
     */
    let zoomRealTimeMarker = function(){
        map.animateCamera({
            target:Localstoragegame.getUser().location,
            zoom:16,
            tilt: 0,
            bearing: 0,
            duration: 0
        });
    }

    /**
     * Updata camera view
     * @memberof Maps#
     * @param {json} location - Set location of the camera
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
     * Collissiondetection between two locations
     *
     * @memberof Maps#
     *
     * @param {json} firstLocation - the first location
     * @param {json} secondLocation - the second location
     *
     * @returns {boolean}
     *
     * @private
     * @static
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
     * Multicollison detections between all markers.
     * Between Attributes and users.
     *
     * @memberof Maps#
     *
     * @param {json} Location - Location of the detection
     * @returns {Array}
     *
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
     * Multicollsion detections between all users.
     * Between users and users.
     *
     * @memberof Maps#
     *
     * @param {json} Location - Location of the detection
     *
     * @returns {Array}
     *
     * @private
     */
    let _multiCollisionDetectionUsers = function(FirstUser,users){
        var collisions = [];

        // get users
        users.forEach(function(user){
            if(user != null){
                if(_collisionDetection(FirstUser.location,user.location)){
                    if(FirstUser.id != user.id){
                        collisions.push(user);
                    }
                }
            }

        });
        return collisions;
    }

    /**
     * Search the marker with a marker Id
     *
     * @memberof Maps#
     *
     * @param {Int} markerId - The marker Id
     *
     * @returns {*}
     *
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
     * Make a color circle in a specific location
     *
     * @memberof Maps#
     *
     * @param {json} latlng - The location of the circle
     *
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
     * If this user take a Marker
     *
     * @memberof Maps#
     *
     * @param {Int} markerId - The marker id
     */
    let getMarkerAttribuut = function(markerId){
        marker = _getMarker(markerId);
        _makeCircle(marker.position);

    }

    /**
     * View if there is a collision detection with other user
     * @memberof Maps#
     *
     * @param {Json} user - The data of user
     *
     * @returns {Array}
     */
    let collisionDetectionUsers = function(user,users){
        return _multiCollisionDetectionUsers(user,users);

    }

    /**
     * View if there is a collision dection with a Marker
     *
     * @memberof Maps#
     *
     * @param {json} Location - Location of the detection
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



            // if type
            if((marker.type == "item" || marker.type=="raided" || raidedTake) && Localstoragegame.getUser()._function == "Prisoner"){
                if(marker.type != "raided" || raidedTake ){
                    user = Localstoragegame.getUser();

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
            }



            /// basecamp
            if(marker.type == "basecamp"){
                // kijken of het hun basecamp is
                if(marker.function == Localstoragegame.getUser()._function){
                    // kijken of hij nog voldoende kogels heeft
                    _initSocket.emit('user.reloadShot', {gameId:_initGameId,userId:_initUserId});
                }

            }

        });

    }


    /**
     * Receive all the socket message
     * @memberof Maps#
     * @private
     *
     * @fires Maps#getDeviceMarker
     * @fires Maps#getMaps
     * @fires Maps#mapsError
     *
     */
    let _receiveSocket = function(){

        /**
         *
         * Receive message device marker
         *
         * @property {String} data.name - The name of user
         * @property {String} data.shot - The counter of shots
         * @property {String} data.location - The counter location
         * @property {String} data.icon - The icon
         *
         * @event Maps#getDeviceMarker
         *
         */
        _initSocket.on('maps.getDeviceMarker', function(message) {
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


        /**
         *
         * Receive all settings of map
         *
         * @property {Array} data - Array of all attributes
         * @property {String} attr.icon - The icon of attribute
         * @property {Json} attr.raided - The raided of attr
         *
         * @event Maps#getMaps
         *
         */
        _initSocket.on('maps.getMaps', function(message) {
            data =message.data;
            console.log("getMaps", data);
            // Add markers
            var markers = data.map(function(options) {
                mapMarkers.push(options);
                return map.addMarker(options);
            });

            // add viewAttribute
            //leegmaken
            $('#viewAttribute').text('');
            $.each(data, function(i, attr) {
                if(attr.type == "raided"){
                    //console.log(attr);
                   html = "<div class=\"col-6 col-sm-6 col-md-6 col-lg-4\"><img src='"+ attr.icon.url +"' class=\"iconAttribute\" alt=\"\"><span class=\"text-light\">= " + attr.raided.price +" euro</span><br>";
                    $.each(attr.raided.item, function(ite, at) {
                        html += "<img src='"+ data[at].icon.url +"' class=\"iconAttribute\">";

                    });
                    html += "</div>";
                    //console.log("add view", html);
                    $('#viewAttribute').append(html);
                }
            });
        });


        /**
         *
         * Receive error from the maps and show.
         *
         * @property {String} message.data - Error from the game
         *
         * @event Maps#mapsError
         *
         */
        _initSocket.on('maps.error', function(message) {
            console.log(message.data);
            //$.snackbar({content: message.data});
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
