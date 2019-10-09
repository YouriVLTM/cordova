let Game = function () {
    let gameId;
    let userId;

    let init = function(socket){
        socket.on('connect', function() {
            console.log("connection");
        });

        _receiveSocket(socket);

        // get Saving things
        this.gameId = Localstoragegame.getLocalStorageGame("gameId");
        this.userId = Localstoragegame.getLocalStorageGame("UserId");

       // TODO kijken of die gegeven effectief bestaan (gameId, userID)!

    };



    let _receiveSocket = function(socket){
        //error
        socket.on('user.error', function(message) {
            console.log(message.data);
            $.snackbar({content: message.data});
        });

        socket.on('user.log', function(message) {
            console.log(message.data);
            $.snackbar({content: message.data});
        });

    }


    return {
        init: init
    };

}();
