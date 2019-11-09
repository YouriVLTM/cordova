/***
 *
 * @type {{init, conn}}
 * @class Socket
 */
let Socket = function () {
    let socket
    var mes;

    /**
     * @classdesc A class of Socket interact with the connection to te server
     * @author youri Van Laer
     *
     * @description Initialize this new socket try to make a socket connection with the server.
     *
     * @constructs Socket
     *
     */
    let init = function(){
        try{
            socket = io.connect('https://game.yourivanlaer.be:3000',{'multiplex': false});

            socket.on('connect', function() {
                console.log("connection");
            });

        }catch{
            alert("Error: lost connection!");
            window.location = 'index.html';
        }
        console.log('Socket connection');
    };

    /**
     * The socket connection.
     * @memberof Socket#
     * @returns {socket} socket - Give the socket connection
     */
    let conn = function(){
        return socket;
    }

        return {
        init: init,
        conn : conn
    };
}();
