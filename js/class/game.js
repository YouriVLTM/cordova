let Game = function () {
    let games;
    let gameId;

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


    let getGameLocation = function(socket){
        //gameId ophalen
        console.log(_getLocalStorageGame('gameId'));

        // kijken of er al een game location bestaat
        socket.emit('games.getLocation', { gameId : _getLocalStorageGame('gameId')});

    };

    let setGame = function(gameId){
        console.log("setnewgame");
        _setLocalStorageGame('gameId', gameId);
    };

    let setLocation = function(socket,locationId){
        console.log("setnewlocation");
        // lokaal opslaan
        _setLocalStorageGame('locationId', locationId);

        // server opslaan
        socket.emit('games.setLocation', { gameId : _getLocalStorageGame('gameId'), locationId : locationId});

        $('#setNewLocation').modal('hide');

    };





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
                $(  ' <div class="card mb-3">\n' +
                    '                       <div class="card-body">\n' +
                    '                           <h5 class="card-title"><button type="button" class="btn btn-primary" onclick="changeGameName(this)" data-gameId='+game.id+'>'+game.name+'</button></h5>\n' +
                    '                           <ul class="list-unstyled">\n' +
                    '                               <li class=\'text-left\'>Location : <button type="button" onclick="changeLocationName()" class="btn btn-info">'+game.locationId+'</button></li>\n' +
                    '                               <li class=\'text-left\'>Aantal gebruikers : 2</li>\n' +
                    '                               <li class=\'text-left\'>Game : Actief</li>\n' +
                    '                           </ul>\n' +
                    '                           <button type="button" class="btn btn-success">Start</button>\n' +
                    '                       </div>\n' +
                    '                   </div>'
                ).addClass('newClass').appendTo('#gameslist');
            });

        });

        socket.on('games.getLocation', function(message) {
            // als error
            receiv = message.data;
            if(!receiv.hasOwnProperty('error')){
                if(receiv.isValid){
                    //locatie beschikbaar (ga naar users aanmaken)

                }else{
                    // geen locatie beschikbaar ( nog een locatie selecteren)
                    //window.location = 'locationlist.html';
                    $('#setNewLocation').modal('show');
                    // kijken naar al de locatie's
                    console.log("datalocation: ", receiv.dataLocations);
                    // leegmaken
                    $("#locationList").empty();

                    $.each(receiv.dataLocations, function(i, location) {
                        $("#locationList").append( "<li class='list-group-item' data-gameId='"+ location.id +"'>" + location.name + "</li>" );
                    });

                }
                console.log("Geen error");
            }else{
                console.log(receiv.error);
                $.snackbar({content: receiv.error});
            }

        });

    }


    return {
        init: init,
        addNewGame: addNewGame,
        findAllGames: findAllGames,
        setGame: setGame,
        setLocation: setLocation,
        getGameLocation: getGameLocation,
        changeGameName:changeGameName,
        setName:setName
    };
}();