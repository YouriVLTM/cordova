$(function(){
    document.addEventListener("deviceready", onDeviceReady, false);

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
        window.location = "index.html";

    });





});
function onDeviceReady() {
    console.log('Device is ready');
    Socket.init();
    Game.init(Socket.conn());

    //maps init
    var div = document.getElementById("map_canvas");
    var map = plugin.google.maps.Map.getMap(div, {
        controls: {
            compass: true
        }
    });

    Maps.init(Socket.conn(),Game.gameId,map);

    //User

    User.init(Socket.conn(),Maps.map);
}
function onMapInit(map) {
    console.log("hello");
}