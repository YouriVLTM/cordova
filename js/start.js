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
        Localstoragegame.removeLocalStorageGame("user");
        window.location = "index.html";

    });

    //klin
    $("#addAttribute").on("click", function(){
        // input game leegmaken
        //$('#addAttributeModal').modal("hide");
        var attributeId = $('#addAttribute').attr("data-id");
        console.log(Game.gameId);
        console.log(Game.userId);
        // save to server
        console.log("Message", Maps.getMessage().message);
        Socket.conn().emit('user.addAttribute', {gameId:Game.gameId,userId:Game.userId,attributeId:attributeId,message:Maps.getMessage().message});
        // change Markers
        Maps.getMarkerAttribuut(attributeId);

   });

    $("#canceledAttribute").on("click", function(){
        // input game leegmaken
        //$('#addAttributeModal').modal("hide");
        var attributeId = $('#canceledAttribute').attr("data-id");
        console.log(Game.gameId);
        console.log(Game.userId);
        // save to server
        Socket.conn().emit('user.canceledAttribute', {gameId:Game.gameId,userId:Game.userId,attributeId:attributeId});

    });


    //shoot function
    $(".shootButton").on("click", function(){
        // kijken of er iemand in de buurt is
        User.shoot(Socket.conn());

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