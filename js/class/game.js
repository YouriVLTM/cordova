let Game = function () {
    let gameId;
    let elementedite;

    let init = function(socket){
        socket.on('connect', function() {
            console.log("connection");
        });
        _receiveSocket(socket);

        findAllGames(socket);


        //console.log("games init", Socket.send('games.findAll',''));
    };

    // New Youri

    let setName = function(socket,gameId,name){
        socket.emit('games.setName', {gameId:gameId,name : name});
    }

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




    //old Youri

    let findAllGames = function(socket){
        // Get all games
        //socket.on('connect', function() {
        socket.emit('games.findAll', '');

        //});
    }
    let addNewGame = function(socket,gameName){
        console.log("New game :", gameName);
        // socket
        //socket.on('connect', function() {
        socket.emit('games.creatNewGame', {name : gameName});
        findAllGames(socket);
            /*socket.on('games.creatNewGame', function(message) {
                console.log(message.data);
            });
            */
       //});

    };




    let setGame = function(gameId){
        console.log("setnewgame");
        _setLocalStorageGame('gameId', gameId);
    };


    let startGame = function(socket,gameId){
        console.log("Get game",gameId);
        socket.emit('games.startGame', {gameId : gameId});

    }





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

        socket.on('games.findAll', function(message) {
            console.log(message.data);
            $('#loadingGames').hide();

            //maak lijst leeg
            $("#gameslist").empty();
            $.each(message.data, function(i, game) {
                getLocationName(Socket.conn(), game.id);
                $(  ' <div class="card mb-3">\n' +
                    '                       <div class="card-body">\n' +
                    '                           <h5 class="card-title"><button type="button" class="btn btn-primary" onclick="changeGameName(this)" data-gameId='+game.id+'>'+game.name+'</button></h5>\n' +
                    '                           <ul class="list-unstyled">\n' +
                    '                               <li class=\'text-left\'>Location : <button type="button" onclick="changeLocationName(this)" data-gameId='+game.id+' class="btn btn-info">'+game.locationName+'</button></li>\n' +
                    '                               <li class=\'text-left\'>Aantal gebruikers : '+game.users.length+'</li>\n' +
                    '                               <li class=\'text-left\'>Game : '+game.active+'</li>\n' +
                    '                           </ul>\n' +
                    '                           <button type="button" class="btn btn-success" onclick="startGame(this)" data-gameId='+game.id+'>Start</button>\n' +
                    '                       </div>\n' +
                    '                   </div>'
                ).addClass('newClass').appendTo('#gameslist');
            });

        });

        socket.on('games.getAllLocation', function(message) {
            // als error
            receiv = message.data;
            console.log(receiv);

            // leegmaken
            $("#locationList").empty();

            $.each(receiv, function(i, location) {
                $("#locationList").append( "<li class='list-group-item' data-locationId='"+ location.id +"'>" + location.name + "</li>" );
            });

            /*

            if(!receiv.hasOwnProperty('error')){
                if(receiv.isValid){
                    //locatie beschikbaar (ga naar users aanmaken)

                }else{
                    // geen locatie beschikbaar ( nog een locatie selecteren)
                    //window.location = 'locationlist.html';

                    // kijken naar al de locatie's
                    console.log("datalocation: ", receiv.dataLocations);


                }
                console.log("Geen error");
            }else{
                console.log(receiv.error);
                $.snackbar({content: receiv.error});
            }
            */

        });

        socket.on('games.getLocationName', function(message) {
            console.log(message.data);
            $(Game.elementedite).text(message.data.locationName);

        });

        socket.on('games.startGame', function(message) {
            console.log(message.data);
            _setLocalStorageGame("gameId",message.data.id);

            window.location = "users.html";
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
        findAllGames: findAllGames,
        setGame: setGame,
        setLocation: setLocation,
        changeGameName:changeGameName,
        setName:setName,
        getLocation:getLocation,
        getLocationName:getLocationName,
        startGame:startGame,
        getAllLocation:getAllLocation
    };
}();