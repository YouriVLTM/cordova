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
        console.log($(this).text(), $(this).attr("data-gameId"));
        //alert($(this).text());

        //save game
        Game.setLocation(Socket.conn(),$(this).attr("data-gameId"));

        //Show Users


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









});

// show model
function changeGameName(elem){
    console.log("change name");
    // change game
    console.log($(elem).text(),$(elem).attr("data-gameId"));
    $('#recipient-name-setGameName').val($(elem).text());
    $('#StartsetGameName').modal('show');
    Game.gameId = $(elem).attr("data-gameId");



}

function onDeviceReady() {
    console.log('Device is ready');
    //socket function
    Socket.init();
    Game.init(Socket.conn());
}