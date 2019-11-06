/***
 *
 * @type {{init, conn}}
 * @property {socket} socket - the connection
 * @class Socket
 *
 */
let Socket = function () {
    let socket
    var mes;

    /**
     * @constructor Socket
     */
    let init = function(){
        try{
            socket = io.connect('https://game.yourivanlaer.be:3000',{'multiplex': false});
        }catch{
            alert("Error: lost connection!");
            window.location = 'index.html';
            //socket = io.connect('http://192.168.112.161:8080',{'multiplex': false});
        }

        console.log('Socket connection');

    };

    /**
     * @memberof Socket#
     * @returns {socket}
     */
    let conn = function(){
        return socket;

    }

        return {
        init: init,
        conn : conn
    };
}();
