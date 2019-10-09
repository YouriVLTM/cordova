let Maps = function () {
    let map;

    let init = function(socket,gameId,mapp){
        map = mapp;


        /*
        socket.on('connect', function() {
            console.log("connection");
        });
        */
        //map.one(plugin.google.maps.event.MAP_READY, _onMapInit);

        _receiveSocket(socket);
        // load maps labels
        _onMapInit(socket,gameId);
    };

    let _onMapInit = function(socket,gameId){
        // get maps
        socket.emit('maps.getMaps', {gameId:gameId});

    }

    let updateUserLocation = function(location){
        console.log("ok");
        marker = map.addMarker({
            title: "Youri Location",
            label: "A",
            position: location.latLng,
            icon: {
                url: 'img/dief.png'
            }
        });

        updateCamera(location);

    }

    let updateCamera = function(location){
        map.animateCamera({
            target: location.latLng,
            zoom: 15,
            tilt: 0,
            bearing: 0,
            duration: 0
        });

    }


    let _receiveSocket = function(socket){


        socket.on('maps.getMaps', function(message) {
            //console.log(message.data);
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
        init: init,
        updateUserLocation:updateUserLocation
    };

}();
