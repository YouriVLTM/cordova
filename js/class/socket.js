let Socket = function () {
    let socket
    var mes;

    let init = function(){
        try{
            socket = io.connect('https://game.yourivanlaer.be:3000',{'multiplex': false});

        }catch{
            //$.snackbar({content: "Error: lost connection!"});
            alert("Error: lost connection!");
            window.location = 'index.html';
        }
        console.log('Socket connection');

    };


    let conn = function(){
        return socket;

    }
    let receive = function(){

    }

        return {
        init: init,
        conn : conn
    };
}();



/*
socket.on('connect', function() {
    socket.emit('message', { test: 'hello world' });

    socket.on('message', function(text) {
        alert(text);
    });
});

*/