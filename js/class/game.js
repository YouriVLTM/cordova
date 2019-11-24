/***
 *
 * @type {{init, getMessage, popupMessage}}
 * @class Game
 */
let Game = function () {
    let messages = [];

    let _initSocket;

    /**
     * @classdesc A class of Game interact with the user. Involving a popup message what is going on in the game.
     * @author youri Van Laer
     *
     * @description Initialize this new game with given socket connection. Initialize all receiving sockets
     *  and get gameId and UserId from the local storagegame.
     *
     * @constructs Game
     * @param {Socket} socket - Give the socket connection
     *
     */
    let init = function(socket){
        /*local value*/
        _initSocket= socket;

        _receiveSocket();
    };

    /**
     * GetMessage from other players or general information
     * @memberof Game#
     * @param {Json} data - Give the json file parameters (gameId and UserId)
     */
    let getMessage = function(data){
        // kijken of er nog geen bericht open staat
        if(!$('#addMessageModal').hasClass('show')){
            _initSocket.emit('game.getMessage', data);
        }

    }

    /**
     * Let the User view a message
     * @memberof Game#
     *
     */
    let popupMessage = function(){
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


    /**
     * Receive all the socket message
     * @memberof Game#
     * @private
     *
     * @fires Game#getMessage
     * @fires Game#getMessages
     * @fires Game#gameError
     * @fires Game#gameLog
     *
     */
    let _receiveSocket = function(){

        /**
         *
         * Receive message from a game and show.
         *
         * @property {String} data.title - title
         * @property {String} data.message - message
         *
         * @event Game#getMessage
         *
         */
        _initSocket.on('game.getMessage', function(message) {
            if(!jQuery.isEmptyObject(message)) {
                mes = message.data;
                console.log(mes);
                $('#messageTitle').html(mes.title);
                $('#messageText').html(mes.message);
                $('#messsageButton').html(mes.buttonName);
                if(mes.buttonUrl != null){
                    $('#messsageButton').attr('data-dismiss','');
                    $('#messsageButton').attr('href', mes.buttonUrl);
                }

                //popup
                $('#addMessageModal').modal('show');
            }

        });

        /**
         *
         * Receive messages from a game and show.
         *
         * @property {Array} data.messages - All messages
         *
         * @event Game#getMessages
         *
         */
        _initSocket.on('game.getMessages', function(message) {
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

        /**
         *
         * Receive error from the game and show.
         *
         * @property {String} message.data - Error from the game
         *
         * @event Game#gameError
         *
         */
        _initSocket.on('game.error', function(message) {
            console.log(message.data);
            toastr.error(message.data,'Fout!',{"timeOut": 3000});
            //$.snackbar({content: message.data});
        });

        /**
         *
         * Receive logs from the game.
         *
         * @property {String} message.data - Logs from the game
         *
         * @event Game#gameLog
         *
         */
        _initSocket.on('game.log', function(message) {
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
