$(function(){
    document.addEventListener("deviceready", onDeviceReady, false);


    // Button Start new game
    $("#startNewGameModal").on("click", function(){
        // input game leegmaken
        $('#newGameName').val('');
    });


    $('#startNewGame').click(function () {
        var gameName = $('input#newGameName').val();
        // add new game
        Game.addNewGame(Socket.conn(),gameName);
        //leegmaken voor de volgende
        $('input#recipient-name').val('');

    });

    $("#setGameNameButton").on("click", function(){
        console.log("Change name");

        //socket
        Game.setName(Socket.conn(),Game.gameId,$('input#setGameName').val());


        //If location already exist or not
        //Game.getGameLocation(Socket.conn());
    });

    $('#reloadnewgames').click(function () {
        Game.findAllGames(Socket.conn());
    });



    $("ul#gameslist").on("click","li", function(){
        console.log($(this).text(), $(this).attr("data-gameId"));
        //alert($(this).text());

        //save game
        Game.setGame($(this).attr("data-gameId"));

        //If location already exist or not
        Game.getGameLocation(Socket.conn());
    });

    //locatie keuze
    $("ul#locationList").on("click","li", function(){
        console.log($(this).text(), $(this).attr("data-locationId"));
        //alert($(this).text());
        locationId= $(this).attr("data-locationId")

        //save game
        Game.setLocation(Socket.conn(),Game.gameId,locationId);

        //Hidden
        $('#setLocation').modal('hide');

        //save client
        Game.getLocationName(Socket.conn(),Game.gameId);


        //If location already exist or not
        //Game.getGameLocation(Socket.conn());
    });



    // start Game











});

// show model
function changeGameName(elem){
    // read old Game names
    $('input#setGameName').val($(elem).text());
    // get all locations

    $('#StartsetGameNameModel').modal('show');
    // save gameId
    Game.gameId = $(elem).attr("data-gameId");

}

function changeLocationName(elem){
    console.log("change location");
    // change game
    console.log($(elem).text(),$(elem).attr("data-gameId"));
    // Get location names
    Game.getAllLocation(Socket.conn());

    // show modal
    $('#setLocation').modal('show');


    // save gameId
    Game.gameId = $(elem).attr("data-gameId");
    Game.elementedite = elem;

}


function startGame(elem){
    console.log("Start Game location");
    // change game
    console.log($(elem).attr("data-gameId"));

    Game.startGame(Socket.conn(),$(elem).attr("data-gameId"));


}



function onDeviceReady() {
    console.log('Device is ready');
    //socket function
    Socket.init();
    Game.init(Socket.conn());
}