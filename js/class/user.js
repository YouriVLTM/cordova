/***
 *
 * @type {{isTakedAttributes, init, shoot, updateGetMessage}}
 * @class User
 */
let User = function () {
    /*local values*/
    let _initGameId;
    let _initUserId;
    let _initSocket;
    // min
    let _agentTimer = 1;
    // min
    let _prisonerTimer = 2;



    //stopwatch
    let _stopwatchAgent = new Date();
    let _stopwatchPrisoner = new Date();

    let LatLng;
    let debugCounter = 0;

     /**
     * @classdesc A class of User interact with live location streaming, take a attribute (on maps), can shoot.
     * @author youri Van Laer
     *
     * @description Initialize this new User with given socket connection. Start streaming live location. Initialize all receiving sockets
     *  and get gameId and UserId from the local storagegame.
     *
     * @constructs User
     * @param {Socket} socket - Give the socket connection
     * @param {Maps} maps - init map
     *
     */
    let init = function(socket,gameId,userId){
         _initSocket = socket;
         _initGameId = gameId;
         _initUserId = userId;



        _receiveSocket();

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


        //Location update other users
         //rules
         if(Localstoragegame.getUser()._function == "Agent"){
             _setupWatchAgent(2000);
             _setupWatchPrisoner(_prisonerTimer * 60000);
         }else if(Localstoragegame.getUser()._function == "Prisoner"){
             _setupWatchAgent(_agentTimer * 60000);
             _setupWatchPrisoner(2000);
         }else{
             _setupWatchAllUsers(2000);
         }

    };

    let getStopwatchTimeLeft = function(){
        currentTime = new Date();
        if(Localstoragegame.getUser()._function == "Agent"){
            time = (currentTime.getTime() - _stopwatchPrisoner);

            timeBackMin = _prisonerTimer - (time / 60000);

            min = Math.floor( timeBackMin );
            sec = Math.round( (timeBackMin - min ) * 60 );
            //"Dief update locatie: " +
            return min + " : " + sec;
        }else if(Localstoragegame.getUser()._function == "Prisoner"){
            time = (currentTime.getTime() - _stopwatchAgent.getTime());

            timeBackMin = _agentTimer - (time / 60000);

            min = Math.floor( timeBackMin );
            sec = Math.round( (timeBackMin - min ) * 60 );
            //"Agent update locatie: " +
            return min + " : " + sec;
        }else{
            return "Live";
        }
    }

    let _setupWatchAgent = function(freq){
        activeWatchAgent = setInterval(_getLocationAllAgent, freq);
    }

    let _getLocationAllAgent = function(){
        _initSocket.emit('game.getAllAgentLocation', {gameId:_initGameId});
        _stopwatchAgent = new Date();
    }



    let _setupWatchPrisoner = function(freq){
        activeWatchPrisoner = setInterval(_getLocationAllPrisoner, freq);
    }



    let _getLocationAllPrisoner = function(){
        _initSocket.emit('game.getAllPrisonerLocation', {gameId:_initGameId});
        _stopwatchPrisoner = new Date();
    }

    /**
     * Set a streaming line to watch all users location.
     * @memberof User#
     * @param {int} freq - the frequention call of function.
     * @private
     */
    let _setupWatchAllUsers = function(freq){
        activeWatchAllUsers = setInterval(_getLocationAllUsers, freq);
    }

    /**
     * Get location of all Users.
     * @memberof User#
     * @private
     */

    let _getLocationAllUsers = function(){
        _initSocket.emit('game.getAllUserLocation', {gameId:_initGameId});
    }


    /**
     * Set a streaming line to watch this user location.
     * @memberof User#
     * @param {int} freq - the frequention call of function.
     * @private
     */
    let _setupWatch = function(freq){
        activeWatch = setInterval(_watchLocation, freq);
    }
    /**
     * Set a streaming line to watch all incoming messages.
     * @memberof User#
     * @param {int} freq - the frequention call of function.
     * @private
     */
    let _setupMessage = function(freq){
        activeWatch = setInterval(updateGetMessage, freq);
    }

    /**
     * Get location of this user.
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
     * Get all messages from this user.
     * @memberof User#
     */
    let updateGetMessage = function(){
        // kijken of er een bericht binnen is
        Game.getMessage({gameId:_initGameId,userId:_initUserId});
    }

    /**
     * Update position on user, local storage, server, user location on maps, Watch if there is a collisionDetection.
     * @memberof User#
     * @param {Json} position - The new position of this user.
     */
    let updateLocation = function(position) {

        // debug settings
        //console.log(position);
        //debugCounter+=1;
        //$('#location').text(position.coords.latitude+ ' ' + position.coords.longitude+ ' '+ debugCounter);


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
        Localstoragegame.getUser().location = {lat:loca.lat,lng:loca.lng};
        // save local
        //Localstoragegame.setLocalStorageGame("user",JSON.stringify(user));


        // update location to server
        _initSocket.emit('user.setLocation', {gameId:_initGameId,userId:_initUserId,location:loca});


        // view message
        //Game.popupMessage();

    }

    /**
     * When there is a error for updating location of this user.
     * @memberof User#
     * @param error
     */
    function updateLocationError(error) {
        alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
    }

    /**
     * This user as a shoot function.
     * Get all paramaters from de server
     *
     * @memberof User#
     * @param {Socket} socket - Give the socket connection
     */
    let shoot = function(){
        // shot uitvoeren
        _initSocket.emit('user.shot', {gameId:_initGameId,userId:_initUserId});
    }

    /**
     * Check if the user as already a attribute. In the list of attribute.
     * @memberof User#
     * @param {int} attributeId - A unique number of attribute
     * @returns {boolean}
     * @private
     */
    let _isGetAttribut = function(attributeId){
        user = Localstoragegame.getUser();

        try {
            user.takedAttributes.forEach(function(itemId){
                //console.log("userget", itemId);
                if(itemId == attributeId){
                    //console.log("ok", itemId);
                    throw "break";
                }
            });
            return false;

        }catch (e) {
            return true;
        }


    }


    /**
     * Check if the user as already take attributes.
     * @memberof User#
     * @param {Array} attributes - A list of unique number of attributes
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
     * Receive all the socket message
     * @memberof User#
     * @param {Socket} socket - Give the socket connection
     * @private
     *
     * @fires User#getAllUserLocation
     * @fires User#getPrice
     * @fires User#userError
     * @fires User#userLog
     *
     */
    let _receiveSocket = function(){

        /**
         *
         * Receive all user location's.
         *
         * @property {Array} message.data - Array of users objects
         *
         * @event User#getAllUserLocation
         *
         */
        _initSocket.on('game.getAllUserLocation', function(message) {
            // if counter is ok
            Maps.updateUsersLocation(message.data);
            Localstoragegame.setLocalStorageGame("users",JSON.stringify(message.data));
        });


        _initSocket.on('game.getAllAgentLocation', function(message) {
            // if counter is ok
            Maps.updateUsersLocation(message.data);
            //Localstoragegame.setLocalStorageGame("users",JSON.stringify(message.data));
        });

        _initSocket.on('game.getAllPrisonerLocation', function(message) {
            // if counter is ok
            Maps.updateUsersLocation(message.data);
            //Localstoragegame.setLocalStorageGame("users",JSON.stringify(message.data));
        });


        /**
         *
         * Receive the price of the user.
         *
         * @property {String} message.data - Price of the user
         *
         * @event User#getPrice
         *
         */
        _initSocket.on('user.getPrice', function(message) {
            $('#price').text(message.data);
        });


        /**
         *
         *  - If there is a other User around this User.
         *  - then this user hit the other user
         *  - else this user miss
         *
         *  and lose one shoot.
         *
         *
         */
        _initSocket.on('user.shot', function(message) {
            console.log(message.data);
            // count teller down
            $('#counterShot').text(message.data[0].shot);

            us = Localstoragegame.getUser();
            var detectUsers = Maps.collisionDetectionUsers(us,message.data);
            // kijken of misshot
            if(detectUsers.length > 0){
                console.log("hit");
                var message = {};
                message.title = "";
                _initSocket.emit('user.hitShot', {gameId:_initGameId,userId:_initUserId,detectUsers:detectUsers,message: message });
            }else {
                console.log("lose");
                _initSocket.emit('user.loseShot', {gameId:_initGameId,userId:_initUserId});
            }

        });


        _initSocket.on('user.reloadShot', function(message) {
            console.log(message.data);
            $('#counterShot').text(message.data);

            toastr.success("reload Shots",'Reload!',{"timeOut": 3000});

        });




        /**
         *
         * Receive error from the game and show.
         *
         * @property {String} message.data - Price of the user
         *
         * @event User#userError
         *
         */
        _initSocket.on('user.error', function(message) {
            toastr.warning(message.data,'Fout!',{"timeOut": 3000});
        });


        /**
         *
         * Receive logs from the game.
         *
         * @property {String} message.data - Logs from the game
         *
         * @event User#userLog
         *
         */
        _initSocket.on('user.log', function(message) {
            toastr.error(message.data,'Fout!',{timeOut: 3000});
        });

    }
    return {
        init: init,
        updateGetMessage:updateGetMessage,
        shoot:shoot,
        isTakedAttributes:isTakedAttributes,
        getStopwatchTimeLeft:getStopwatchTimeLeft
    };

}();
