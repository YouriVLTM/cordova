$(function(){
    document.addEventListener("deviceready", onDeviceReady, false);

    // canvas maken

    // Create a Google Maps native view under the map_canvas div.

    // ready


});
function onDeviceReady() {
    console.log('Device is ready');
    Socket.init();
    Game.init(Socket.conn());

    //maps init
    var div = document.getElementById("map_canvas");
    map = plugin.google.maps.Map.getMap(div);

    Maps.init(Socket.conn(),Game.gameId,map);

    //User

    User.init(Socket.conn(),Maps.map);
}