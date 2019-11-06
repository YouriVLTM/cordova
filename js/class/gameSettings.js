/***
 *
 * @type {{setName, init, addUserPage, addNewGame, getCountPrisoner, getAllGames, getAllPlaces, setPlaceId, createNewUser, getCountAgent, goToMaps}}
 * @Class GameSettings
 */
let GameSettings = function () {
    let gameId;
    let userId;
    let elementedite;
    let personalitie;


    /**
     * @classdesc A class of GameSettings involving all the game settings.
     *
     * @author youri Van Laer
     *
     * @description Initialize this new game with given socket connection. Initialize all receiving sockets
     *  and get all games that exist in the server.
     *
     * @constructs GameSettings
     * @param {Socket} socket -The socket connection
     */
    let init = function(socket){
        socket.on('connect', function() {
            console.log("connection");
        });

        _receiveSocket(socket);

        getAllGames(socket);

    };


    /**
     * Get all games that exist in the server.
     * @memberof GameSettings#
     * @param {Socket} socket - The socket connection
     */
    let getAllGames = function(socket){
        socket.emit('games.getAll', '');
    }
    /**
     * Add new game and receive alle games that exist in the server.
     * @memberof GameSettings#
     * @param {Socket} socket - The socket connection
     * @param {String} gameName - The gameName for this new game.
     */
    let addNewGame = function(socket,gameName){
        socket.emit('games.createNewGame', {name : gameName});
        // get games
        getAllGames(socket);
    };

    /**
     * Get all place where you can play the game.
     * @memberof GameSettings#
     * @param {Socket} socket - The socket connection
     */
    let getAllPlaces = function(socket){
        socket.emit('games.getAllPlace', '');
    }
    /**
     * Set place where you want play the game.
     * @memberof GameSettings#
     * @param {Socket} socket - The socket connection
     * @param {Int} gameId - The gamId witch game you will set
     * @param {Int} placeId - The placeId where do you play the game
     */
    let setPlaceId = function(socket,gameId,placeId){
        console.log("game select",);
        socket.emit('games.setPlaceId', {gameId:gameId,placeId:placeId});
    }
    /**
     * Save the gameId and go to the userlist page where you choose your personage.
     * @memberof GameSettings#
     * @param {Localstoragegame} Localstoragegame - The Localstoragegame for this device
     * @param {Int} gameId - The gamId witch game you will set
     */
    let addUserPage = function(Localstoragegame,gameId){
        Localstoragegame.setLocalStorageGame("gameId",gameId);

        // go to new windows
        window.location = "userslist.html";
    }
    /**
     * Rename this game.
     * @memberof GameSettings#
     * @param {Socket} socket - The socket connection
     * @param {Int} gameId - The gamId witch game you will set
     * @param {String} name - The name for this game.
     */
    let setName = function(socket,gameId,name){
        socket.emit('game.setName', {gameId:gameId,name : name});
    }
    /**
     * Get count all the agent on this game
     * @memberof GameSettings#
     * @param {Socket} socket - The socket connection
     * @param {Int} gameId - The gamId witch game you will set
     */
    let getCountAgent = function(socket,gameId){
        socket.emit('game.getCountAgent', {gameId:gameId});
    }
    /**
     * Get count all the prisoners on this game
     * @memberof GameSettings#
     * @param {Socket} socket - The socket connection
     * @param {Int} gameId - The gamId witch game you will set
     */
    let getCountPrisoner = function(socket,gameId){
        socket.emit('game.getCountPrisoner', {gameId:gameId});
    }
    /**
     * Creat a new user on this game
     * @memberof GameSettings#
     * @param {Socket} socket - The socket connection
     * @param {Int} gameId - The gamId witch game you will set
     * @param {String} name - The name of the user for this game.
     * @param {String} character - The character of the user for this game.
     */
    let createNewUser = function(socket,gameId,name,character){
        socket.emit('game.createNewUser', {gameId:gameId,name:name,personalitie : character});
    }
    /**
     * Settings are fish and you can start the game.
     * @memberof GameSettings#
     * @param {Socket} socket - The socket connection
     * @param {Int} gameId - The gamId witch game you will set
     */
    let goToMaps = function(socket,gameId){
        //TODO Kijken of alles inorde is
        socket.emit('game.goToMaps', {gameId:gameId});
    }


    /**
     * Receive all the socket message
     * @memberof GameSettings#
     * @param {Socket} socket - The socket connection
     * @private
     *
     * @fires GameSettings#getAll
     * @fires GameSettings#getAllPlace
     * @fires GameSettings#getCountAgent
     * @fires GameSettings#getCountPrisoner
     * @fires GameSettings#getUser
     * @fires GameSettings#goToMaps
     * @fires GameSettings#gameSettingsError
     *
     */
    let _receiveSocket = function(socket){

        /**
         *
         * Receive all games and show.
         *
         * @property {String} data.id - The id of this game.
         * @property {String} data.name - The name of this game.
         * @property {String} data.placeName - The placeName of this game.
         * @property {String} data.users.length - The length for all users of this game.
         *
         *
         * @event GameSettings#getAll
         *
         */
        socket.on('games.getAll', function(message) {
            console.log(message.data);
            $('#loadingGames').hide();

            //maak lijst leeg
            $("#cardGameList").empty();
            $.each(message.data, function(i, game) {


                $('                    <div class="col-sm-12 col-md-6 col-lg-4">\n' +
                    '                        <!-- Card -->\n' +
                    '                        <div class="card mb-4 grey darken-3">\n' +
                    '\n' +
                    '                            <!--Card image-->\n' +
                    '                            <div class="view overlay">\n' +
                    '                                <img class="card-img-top" src="https://cdn.pixabay.com/photo/2017/06/24/11/06/board-2437446_960_720.jpg" alt="Card image cap">\n' +
                    '                                <a href="#!">\n' +
                    '                                    <div class="mask rgba-white-slight"></div>\n' +
                    '                                </a>\n' +
                    '                            </div>\n' +
                    '\n' +
                    '                            <!--Card content-->\n' +
                    '                            <div class="card-body">\n' +
                    '\n' +
                    '                                <!--Title-->\n' +
                    '                                <h4 class="card-title text-light" onclick="changeGameName(this)" data-gameId='+game.id+'>'+game.name+'</h4>\n' +
                    '                                <!--Text-->\n' +
                    '\n' +
                    '\n' +
                    '                                <p class="text-light text-left" onclick="changePlace(this)" data-gameId='+game.id+'> <i class="fas fa-map-marker-alt"></i> <span>'+game.placeName+'</span></p>\n' +
                    '                                <p class="text-light text-left"><i class="far fa-user"></i> <span>'+game.users.length+'</span></p>\n' +
                    '\n' +
                    '                                <!-- Provides extra visual weight and identifies the primary action in a set of buttons -->\n' +
                    '                                <button type="button" class="btn btn-dark-green btn-md btn-block" onclick="addUserPage(this)" data-gameId='+game.id+'>Start</button>\n' +
                    '\n' +
                    '                            </div>\n' +
                    '\n' +
                    '\n' +
                    '                        </div>\n' +
                    '                        <!-- Card -->\n' +
                    '\n' +
                    '                    </div>').addClass('newClass').appendTo('#cardGameList');
            });

        });

        /**
         *
         * Receive all places where you can play game and show.
         *
         * @property {Array} message.data - The message.data is a array of places.
         * @property {Int} place.id - The place id.
         * @property {String} place.name - The place name.
         *
         * @event GameSettings#getAllPlace
         *
         */
        socket.on('games.getAllPlace', function(message) {
            // als error
            receiv = message.data;
            console.log(receiv);
            // leegmaken
            $("#placeList").empty();

            $.each(receiv, function(i, place) {
                $("#placeList").append( "<li class='list-group-item bg-dark text-light' data-locationId='"+ place.id +"'>" + place.name + "</li>" );
            });

        });


        /**
         *
         * Receive all count of agent and show.
         *
         * @property {Int} message.data - The count of agent.
         * @event GameSettings#getCountAgent
         *
         */
        socket.on('game.getCountAgent', function(message) {
            console.log("agent",message.data);
            $(".counterAgent").text(message.data);
        });

        /**
         *
         * Receive all count of prisoner and show.
         *
         * @property {Int} message.data - The count of prisoner.
         * @event GameSettings#getCountPrisoner
         *
         */
        socket.on('game.getCountPrisoner', function(message) {
            console.log("Prisoner",message.data);
            $(".counterPrisoner").text(message.data);
        });

        /**
         *
         * Receive data of user and save local storage.
         *
         * @property {Int} message.data.id - The user id.
         * @property {Json} message.data - The data of the user
         *
         * @event GameSettings#getUser
         *
         */
        socket.on('game.getUser', function(message) {
            console.log("User",message.data);
            Localstoragegame.setLocalStorageGame("userId",message.data.id);
            Localstoragegame.setLocalStorageGame("user",JSON.stringify(message.data));
        });

        /**
         *
         * Go to page maps
         *
         * @event GameSettings#goToMaps
         *
         */
        socket.on('game.goToMaps', function(message) {
            window.location = "start.html";
        });


        /**
         *
         * Receive error from the gameSettings and show.
         *
         * @property {String} message.data - Error from the gameSettings
         *
         * @event GameSettings#gameSettingsError
         *
         */
        socket.on('games.error', function(message) {
            console.log(message.data);
            toastr.warning(message.data,'Fout!',{"timeOut": 3000});
            //$.snackbar({content: message.data});
        });


    }

    /**
     * @memberof GameSettings#
     */
    return {
        init: init,
        addNewGame: addNewGame,
        getAllGames: getAllGames,
        setName:setName,
        getAllPlaces:getAllPlaces,
        setPlaceId:setPlaceId,
        addUserPage:addUserPage,
        getCountAgent:getCountAgent,
        getCountPrisoner:getCountPrisoner,
        createNewUser:createNewUser,
        goToMaps:goToMaps
    };
}();