$(function(){
    $( "head,#navigation,#content,#footer" ).hide();
    loader();

    // canvas maken

    // Create a Google Maps native view under the map_canvas div.

    // ready
    $(".zoomUser").on("click", function(){
        // input game leegmaken
        Maps.zoomRealTimeMarker(User.LatLng);
    });

    // stop
    $(".stopGame").on("click", function(){
        // input game leegmaken
        Localstoragegame.removeLocalStorageGame("gameId");
        Localstoragegame.removeLocalStorageGame("userId");
        Localstoragegame.removeLocalStorageGame("user");
        window.location = "index.html";

    });

    //klin
    $("#addAttribute").on("click", function(){
        // input game leegmaken
        //$('#addAttributeModal').modal("hide");
        var attributeId = $('#addAttribute').attr("data-id");
        // save to server
        Socket.conn().emit('user.addAttribute', {gameId:Localstoragegame.getGameId(),userId:Localstoragegame.getUserId(),attributeId:attributeId,message:Maps.getMessage().message});
        // change Markers
        Maps.getMarkerAttribuut(attributeId);

   });

    $("#canceledAttribute").on("click", function(){
        // input game leegmaken
        //$('#addAttributeModal').modal("hide");
        var attributeId = $('#canceledAttribute').attr("data-id");
        // save to server
        Socket.conn().emit('user.canceledAttribute', {gameId:Localstoragegame.getGameId(),userId:Localstoragegame.getUserId(),attributeId:attributeId});

    });


    //shoot function
    $(".shootButton").on("click", function(){
        // kijken of er iemand in de buurt is
        User.shoot();
    });






});

function loader(){
    $( "head" ).append($('<div>').load( "template/head.html" ));
    $( "#navigation" ).load( "template/navigation.html" );
    $( "#footer" ).load( "template/footer.html" );
}

// word geladen
$(window).on("load",function(){
    setTimeout( function(){
        $(".screenLoader").hide();
        $( "head,#navigation,#content,#modalvesters,#footer" ).show();
    }  , 1500 );
    document.addEventListener("deviceready", onDeviceReady, false);

});

function onDeviceReady() {

    console.log('Device is ready');
    Socket.init();
    Localstoragegame.init();
    Game.init(Socket.conn());

    //maps init
    var div = document.getElementById("map_canvas");
    var map = plugin.google.maps.Map.getMap(div, {
        controls: {
            compass: true
        },
        styles: [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#242f3e"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#746855"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#242f3e"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "administrative.neighborhood",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#263c3f"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#6b9a76"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#38414e"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#212a37"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9ca5b3"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#746855"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#1f2835"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#f3d19c"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#2f3948"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#17263c"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#515c6d"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#17263c"
                    }
                ]
            }
        ]
    });

    Maps.init(Socket.conn(),Localstoragegame.getGameId(),Localstoragegame.getUserId(),map);

    //User
    User.init(Socket.conn(),Localstoragegame.getGameId(),Localstoragegame.getUserId());

}