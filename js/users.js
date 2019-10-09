$(function(){
    document.addEventListener("deviceready", onDeviceReady, false);

    $("ul#personalities").on("click","li", function(){
        console.log("persone",$(this).attr("data-personalitie"));
        GameSettings.personalitie = $(this).attr("data-personalitie");

        $('#StartsetUsernameModel').modal('show');

        // leegmaken
        $('#setUserName').val('');



    });

    $("#setUsernameButton").on("click", function(){
        console.log("New user name");
        GameSettings.createNewUser(Socket.conn(),GameSettings.gameId,$('#setUserName').val(),GameSettings.personalitie);
        $('#StartsetUsernameModel').modal('hide');

        // Go to Maps
        GameSettings.goToMaps(Socket.conn(),GameSettings.gameId);


        //reload
        //getAllcounters();
    });




});
function onDeviceReady() {
    console.log('Device is ready');
    Socket.init();
    GameSettings.init(Socket.conn());
    // get game ID
    GameSettings.gameId = Localstoragegame.getLocalStorageGame("gameId");
    console.log("GameSettings id",GameSettings.gameId);

    //load counters
    getAllcounters();
}
function getAllcounters(){
    console.log("oke functions tart");
    GameSettings.getCountAgent(Socket.conn(),GameSettings.gameId);
    GameSettings.getCountPrisoner(Socket.conn(),GameSettings.gameId);
}