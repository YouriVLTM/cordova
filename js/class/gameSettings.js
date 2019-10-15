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
            $("#gameslist").empty();
            $.each(message.data, function(i, game) {
                $(  ' <div class="card mb-3">\n' +
                    '                       <div class="card-body">\n' +
                    '                           <h5 class="card-title"><button type="button" class="btn btn-primary" onclick="changeGameName(this)" data-gameId='+game.id+'>'+game.name+'</button></h5>\n' +
                    '                           <ul class="list-unstyled">\n' +
                    '                               <li class=\'text-left\'>Plaats : <button type="button" onclick="changePlace(this)" data-gameId='+game.id+' class="btn btn-info">'+game.placeName+'</button></li>\n' +
                    '                               <li class=\'text-left\'>Aantal gebruikers : '+game.users.length+'</li>\n' +
                    '                               <li class=\'text-left\'>Game  : '+game.active+'</li>\n' +
                    '                           </ul>\n' +
                    '                           <button type="button" class="btn btn-success" onclick="addUserPage(this)" data-gameId='+game.id+'>Start</button>\n' +
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
            $.snackbar({content: message.data});
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