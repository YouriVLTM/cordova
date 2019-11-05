/***
 *
 * @type {{init, getMessage, popupMessage}}
 */
let Game = function () {
    let gameId;
    let userId;
    let messages = [];

    let init = function(socket){
        socket.on('connect', function() {
            console.log("connection");
        });

        _receiveSocket(socket);

        // get Saving things
        this.gameId = Localstoragegame.getLocalStorageGame("gameId");
        this.userId = Localstoragegame.getLocalStorageGame("userId");

       // TODO kijken of die gegeven effectief bestaan (gameId, userID)!

    };

    let getMessage = function(socket,data){
        // kijken of er nog geen bericht open staat
        if(!$('#addMessageModal').hasClass('show')){
            socket.emit('game.getMessage', data);
        }

    }

    let popupMessage = function(){
        console.log("mess", messages);
        if(!$('#addMessageModal').hasClass('in')){
            if(messages.length > 0){
                mes = messages.pop();

                $('#messageTitle').text(mes.title);
                $('#messageText').text(mes.message);

                //popup

                $('#addMessageModal').modal('show');
            }
        }

    }



    let _receiveSocket = function(socket){

        socket.on('game.getMessage', function(message) {
            if(!jQuery.isEmptyObject(message)) {
                mes = message.data;
                console.log(mes);
                $('#messageTitle').html(mes.title);
                $('#messageText').html(mes.message);



                //popup

                $('#addMessageModal').modal('show');
            }

        });


        socket.on('game.getMessages', function(message) {
                console.log(message);
                if(message.data.length > 0){
                    $.each(message.data, function(i,messag){
                        messages.push(message.data[i]);
                    });


                    /*$('#messageTitle').text(message.data[0].title);
                    $('#messageText').text(message.data[0].message);

                    //popup

                    $('#addMessageModal').modal('show');
                    */
                }

        });

        //error
        socket.on('game.error', function(message) {
            console.log(message.data);
            toastr.error(message.data,'Fout!',{"timeOut": 3000});
            //$.snackbar({content: message.data});
        });

        socket.on('game.log', function(message) {
            console.log(message.data);
            //toastr.log(message.data,'Fout!',{"timeOut": 3000});
            //$.snackbar({content: message.data});
        });

    }


    return {
        init: init,
        popupMessage:popupMessage,
        getMessage:getMessage
    };

}();
