let Maps = function () {
    let map;

    let init = function(socket,gameId,div){
        map = plugin.google.maps.Map.getMap(div);

        /*
        socket.on('connect', function() {
            console.log("connection");
        });
        */
        map.one(plugin.google.maps.event.MAP_READY, _onMapInit);

        _receiveSocket(socket);
        _onMapInit(socket,gameId);
    };

    function _onMapInit(socket,gameId){
        // get maps
        socket.emit('maps.getMaps', {gameId:gameId});

    }


    let _receiveSocket = function(socket){


        socket.on('maps.getMaps', function(message) {
            console.log(message.data);
            data =message.data;

            // Add markers
            var bounds = [];
            var markers = data.map(function(options) {
                bounds.push(options.position);
                return map.addMarker(options);
            });
        });


        //error
        socket.on('maps.error', function(message) {
            console.log(message.data);
            $.snackbar({content: message.data});
        });


    }


    return {
        init: init
    };

}();
