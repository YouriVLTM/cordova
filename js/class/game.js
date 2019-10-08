let Game = function () {
    let gameId;
    let elementedite;

    let init = function(socket){
        socket.on('connect', function() {
            console.log("connection");
        });
        _receiveSocket(socket);

        getAllGames(socket);


        //console.log("games init", Socket.send('games.findAll',''));
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

    let setName = function(socket,gameId,name){
        socket.emit('game.setName', {gameId:gameId,name : name});
    }

    let getAllPlaces = function(socket){
        socket.emit('games.getAllPlace', '');
    }

    let setPlaceId = function(socket,gameId,placeId){
        console.log("game select",);
        socket.emit('games.setPlaceId', {gameId:gameId,placeId:placeId});
    }





    // New Youri

/*

    let setLocation = function(socket,gameId,locationId){
        console.log("set location");
        // lokaal opslaan
        //_setLocalStorageGame('locationId', locationId);

        // server save
        socket.emit('games.setLocation', { gameId : gameId, locationId : locationId});


    };

    let getLocation = function(socket,gameId){
        console.log("get location");

        // server
        socket.emit('games.getLocation', { gameId : gameId});

    }

    let getLocationName = function(socket,gameId){
        console.log("get location name");

        // server
        socket.emit('games.getLocationName', { gameId : gameId});

    }




    let getAllLocation = function(socket){
        //gameId ophalen
        console.log('get all locations');

        // kijken of er al een game location bestaat
        socket.emit('games.getAllLocation', { gameId : _getLocalStorageGame('gameId')});

    };




    let setGame = function(gameId){
        console.log("setnewgame");
        _setLocalStorageGame('gameId', gameId);
    };


    let startGame = function(socket,gameId){
        console.log("Get game",gameId);
        socket.emit('games.startGame', {gameId : gameId});

    }

*/


    let _setLocalStorageGame = function(variable,data) {
        try{
            localStorage.setItem(variable, data);
        }catch(err){
            console.log("Error : Can't storage ");
            $.snackbar({content: "Error : Can't storage "});
        }
    };

    let _getLocalStorageGame = function(variable) {
        try{
            return localStorage.getItem(variable);
        }catch(err){
            console.log("Error : Can't find storage ");
            $.snackbar({content: "Error : Can't find storage "});
        }
    };



    let _receiveSocket = function(socket){

        socket.on('games.getAll', function(message) {
            console.log(message.data);
            $('#loadingGames').hide();

            //maak lijst leeg
            $("#gameslist").empty();
            $.each(message.data, function(i, game) {
                $(  ' <div class="card mb-3">\n' +
                    '                       <div class="card-body">\n' +
                    '                           <h5 class="card-title"><button type="button" class="btn btn-primary" onclick="changeGameName(this)" data-gameId='+game.id+'>'+game.name+'</button></h5>\n' +
                    '                           <ul class="list-unstyled">\n' +
                    '                               <li class=\'text-left\'>Plaats : <button type="button" onclick="changePlace(this)" data-gameId='+game.id+' class="btn btn-info">'+game.placeName+'</button></li>\n' +
                    '                               <li class=\'text-left\'>Aantal gebruikers : '+game.users.length+'</li>\n' +
                    '                               <li class=\'text-left\'>Game : '+game.active+'</li>\n' +
                    '                           </ul>\n' +
                    '                           <button type="button" class="btn btn-success" onclick="startGame(this)" data-gameId='+game.id+'>Start</button>\n' +
                    '                       </div>\n' +
                    '                   </div>'
                ).addClass('newClass').appendTo('#gameslist');
            });

        });

        socket.on('games.getAllPlace', function(message) {
            // als error
            receiv = message.data;
            console.log(receiv);
            // leegmaken
            $("#placeList").empty();

            $.each(receiv, function(i, place) {
                $("#placeList").append( "<li class='list-group-item' data-locationId='"+ place.id +"'>" + place.name + "</li>" );
            });

        });

        /*

        socket.on('games.getLocationName', function(message) {
            console.log(message.data);
            $(Game.elementedite).text(message.data.locationName);

        });

        socket.on('games.startGame', function(message) {
            console.log(message.data);
            _setLocalStorageGame("gameId",message.data.id);

            window.location = "users.html";
        });

        */



        //error
        socket.on('games.error', function(message) {
            console.log(message.data);
            $.snackbar({content: message.data});
        });





    }


    return {
        init: init,
        addNewGame: addNewGame,
        getAllGames: getAllGames,
        setName:setName,
        getAllPlaces:getAllPlaces,
        setPlaceId:setPlaceId
    };
}();