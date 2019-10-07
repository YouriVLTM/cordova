$(function(){
    document.addEventListener("deviceready", onDeviceReady, false);



    $('#newgame').click(function () {
        var gameName = $('input#recipient-name').val();
        // add new game
        Game.addNewGame(Socket.conn(),gameName);
        //leegmaken voor de volgende
        $('input#recipient-name').val('');

    });


    $('#reloadnewgames').click(function () {
        console.log("reloadgame");
        // reload
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

    $("#setGameNameButton").on("click", function(){
        console.log("change game name server");
        console.log(Game.gameId);

        console.log($('#recipient-name-setGameName').val())

        //socket
        Game.setName(Socket.conn(),Game.gameId,$('#recipient-name-setGameName').val());


        //If location already exist or not
        //Game.getGameLocation(Socket.conn());
    });

    // start Game











});

// show model
function changeGameName(elem){
    console.log("change name");
    // change game
    console.log($(elem).text(),$(elem).attr("data-gameId"));
    $('#recipient-name-setGameName').val($(elem).text());
    // get all locations

    $('#StartsetGameName').modal('show');
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