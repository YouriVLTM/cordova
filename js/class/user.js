/***
 *
 * @type {{isTakedAttributes, init, shoot, updateGetMessage}}
 * @class User
 */
let User = function () {
    let gameId;
    let userId;
    let user;
    let LatLng;
    let debugCounter = 0;

    /**
     *
     * Init the 'User'
     * @constructs User
     * @param {Socket} socket - the connection
     * @param {Maps} maps - init map
     */
    let init = function(socket,map){
        socket.on('connect', function() {
            console.log("connection");
        });

        _receiveSocket(socket);

        // get value
        gameId = Localstoragegame.getLocalStorageGame("gameId");
        userId = Localstoragegame.getLocalStorageGame("userId");
        user = JSON.parse(Localstoragegame.getLocalStorageGame("user"));

        console.log("user",user);

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
        _setupMessage(2000);
        _setupWatchAllUsers(3000);

    };

    /**
     * setup
     * @memberof User#
     * @param freq
     * @private
     */
    let _setupWatchAllUsers = function(freq){
        activeWatchAllUsers = setInterval(_getLocationAllUsers, freq);
    }

    /**
     * @memberof User#
     * @private
     */

    let _getLocationAllUsers = function(){
        Socket.conn().emit('game.getAllUserLocation', {gameId:gameId});
    }


    /**
     * @memberof User#
     * @param freq
     * @private
     */
    let _setupWatch = function(freq){
        activeWatch = setInterval(_watchLocation, freq);
    }
    /**
     * @memberof User#
     * @param freq
     * @private
     */
    let _setupMessage = function(freq){
        activeWatch = setInterval(updateGetMessage, freq);
    }

    /**
     * @memberof User#
     * @private
     */
    let _watchLocation = function(){
        navigator.geolocation.getCurrentPosition(
            updateLocation,
            updateLocationError,{
                enableHighAccuracy: true
            });
    }

    /**
     * @memberof User#
     */
    let updateGetMessage = function(){
        // kijken of er een bericht binnen is
        Game.getMessage(Socket.conn(),{gameId:gameId,userId:userId});
    }

    /**
     * @memberof User#
     * @param position
     */
    let updateLocation = function(position) {
        //var location = new plugin.google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        // get Game Id

        // debug settings
        //console.log(position);
        debugCounter+=1;
        $('#location').text(position.coords.latitude+ ' ' + position.coords.longitude+ ' '+ debugCounter);


        // get google plugin location
        var loca = new plugin.google.maps.LatLng(position.coords.latitude,position.coords.longitude);


        //update users
        Maps.updateUserLocation(loca);

        // collision detection
        //marker
        Maps.collisionDetectionMarkers(loca);
        // user


        //local update
        //console.log(loca);
        user.location = {lat:loca.lat,lng:loca.lng};
        // save local
        Localstoragegame.setLocalStorageGame("user",JSON.stringify(user));


        // update location to server
        Socket.conn().emit('user.setLocation', {gameId:gameId,userId:userId,location:loca});


        // view message
        //Game.popupMessage();

    }

    /**
     * @memberof User#
     * @param error
     */
    function updateLocationError(error) {
        alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
    }

    /**
     * @memberof User#
     * @param socket
     */
    let shoot = function(socket){
        us = JSON.parse(Localstoragegame.getLocalStorageGame("user"));
        var detectUsers = Maps.collisionDetectionUsers(us);
        // kijken of misshot
        if(detectUsers.length > 0){
            console.log("hit");
            socket.emit('user.hitShot', {gameId:gameId,userId:userId,detectUsers});
        }else {
            console.log("lose");
            socket.emit('user.loseShot', {gameId:gameId,userId:userId});
        }
    }

    /**
     * @memberof User#
     * @param attributeId
     * @returns {boolean}
     * @private
     */
    let _isGetAttribut = function(attributeId){
        user = JSON.parse(Localstoragegame.getLocalStorageGame("user"));

        try {
            user.takedAttributes.forEach(function(itemId){
                console.log("userget", itemId);
                if(itemId == attributeId){
                    console.log("ok", itemId);
                    throw "break";
                }
            });
            return false;

        }catch (e) {
            return true;
        }


    }


    /**
     * @memberof User#
     * @param attributes
     * @returns {boolean}
     */
    let isTakedAttributes = function(attributes){
        try {
            attributes.forEach(function(attribute){
                if(!_isGetAttribut(attribute)){
                    console.log("false");
                    throw "break";
                }
            });
            return true;

        }catch (e) {
            return false;
        }

    }

    /**
     * @memberof User#
     * @param socket
     * @private
     */
    let _receiveSocket = function(socket){

        socket.on('game.getAllUserLocation', function(message) {
            Maps.updateUsersLocation(message.data);
            Localstoragegame.setLocalStorageGame("users",JSON.stringify(message.data));
        });


        socket.on('user.getPrice', function(message) {
            console.log(message);
            $('#price').text(message.data);
        });



        socket.on('user.error', function(message) {
            console.log(message.data);

            toastr.warning(message.data,'Fout!',{"timeOut": 3000});
            //$.snackbar({content: message.data});
        });

        socket.on('user.log', function(message) {
            console.log(message.data);
            toastr.error(message.data,'Fout!',{timeOut: 3000});
            //$.snackbar({content: message.data});
        });

    }

    /**
     *
     */
    return {
        init: init,
        updateGetMessage:updateGetMessage,
        shoot:shoot,
        isTakedAttributes:isTakedAttributes
    };

}();
