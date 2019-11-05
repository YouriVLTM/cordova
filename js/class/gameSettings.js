/**
 *
 * @type {{setName, init, addUserPage, addNewGame, getCountPrisoner, getAllGames, getAllPlaces, setPlaceId, createNewUser, getCountAgent, goToMaps}}
 */
let GameSettings = function () {
    let gameId;
    let elementedite;
    let personalitie;
    let userId;

    let init = function(socket){
        socket.on('connect', function() {
            console.log("connection");
        });

        _receiveSocket(socket);

        getAllGames(socket);

    };

    // New

    let getAllGames = function(socket){
        socket.emit('games.getAll', '');
    }
    let addNewGame = function(socket,gameName){
        socket.emit('games.createNewGame', {name : gameName});

        // get games
        getAllGames(socket);
    };

    let getAllPlaces = function(socket){
        socket.emit('games.getAllPlace', '');
    }

    let setPlaceId = function(socket,gameId,placeId){
        console.log("game select",);
        socket.emit('games.setPlaceId', {gameId:gameId,placeId:placeId});
    }

    let addUserPage = function(Localstoragegame,gameId){
        Localstoragegame.setLocalStorageGame("gameId",gameId);

        // go to new windows
        window.location = "userslist.html";
    }

    let setName = function(socket,gameId,name){
        socket.emit('game.setName', {gameId:gameId,name : name});
    }

    let getCountAgent = function(socket,gameId){
        socket.emit('game.getCountAgent', {gameId:gameId});
    }

    let getCountPrisoner = function(socket,gameId){
        socket.emit('game.getCountPrisoner', {gameId:gameId});
    }

    let createNewUser = function(socket,gameId,name,personalitie){
        socket.emit('game.createNewUser', {gameId:gameId,name:name,personalitie : personalitie});
    }

    let goToMaps = function(socket,gameId){
        // Kijken of alles inorde is
        socket.emit('game.goToMaps', {gameId:gameId});
    }





    let _receiveSocket = function(socket){

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


        socket.on('game.getCountAgent', function(message) {
            console.log("agent",message.data);
            $(".counterAgent").text(message.data);
        });

        socket.on('game.getCountPrisoner', function(message) {
            console.log("Prisoner",message.data);
            $(".counterPrisoner").text(message.data);
        });

        socket.on('game.getUser', function(message) {
            console.log("User",message.data);
            Localstoragegame.setLocalStorageGame("userId",message.data.id);
            Localstoragegame.setLocalStorageGame("user",JSON.stringify(message.data));
        });

        socket.on('game.goToMaps', function(message) {
            window.location = "start.html";
        });


        //error
        socket.on('games.error', function(message) {
            console.log(message.data);
            toastr.warning(message.data,'Fout!',{"timeOut": 3000});
            //$.snackbar({content: message.data});
        });


    }


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