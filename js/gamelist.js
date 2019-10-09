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
        GameSettings.addNewGame(Socket.conn(),gameName);
        //leegmaken voor de volgende
        $('input#recipient-name').val('');

    });

    $("#setGameNameButton").on("click", function(){
        console.log("Change name");

        //socket
        GameSettings.setName(Socket.conn(),GameSettings.gameId,$('input#setGameName').val());

        // reload
        GameSettings.getAllGames(Socket.conn());


        //If location already exist or not
        //GameSettings.getGameLocation(Socket.conn());
    });

    // reload button
    $('#reloadnewgames').click(function () {
        GameSettings.getAllGames(Socket.conn());
    });

    //locatie keuze
    $("ul#placeList").on("click","li", function(){
        console.log($(this).text(), $(this).attr("data-locationId"));
        console.log("game",GameSettings.gameId);
        // save new place
        GameSettings.setPlaceId(Socket.conn(),GameSettings.gameId,$(this).attr("data-locationId"));

        $('#setPlaceModal').modal('hide');

        // reload
        GameSettings.getAllGames(Socket.conn());
    });



    // start GameSettings






});

// show model
function changeGameName(elem){
    // read old GameSettings names
    $('input#setGameName').val($(elem).text());
    $('#StartsetGameNameModel').modal('show');
    // save gameId
    GameSettings.gameId = $(elem).attr("data-gameId");

}

function changePlace(elem){
    console.log("change place");
    // Get location names
    GameSettings.getAllPlaces(Socket.conn());

    // show modal
    $('#setPlaceModal').modal('show');


    // save gameId
    GameSettings.gameId = $(elem).attr("data-gameId");
    // miss
    GameSettings.elementedite = elem;

}


function addUserPage(elem){
    console.log("Go to users");
    // change game
    console.log($(elem).attr("data-gameId"));

    GameSettings.addUserPage(Localstoragegame,$(elem).attr("data-gameId"));
}



function onDeviceReady() {
    console.log('Device is ready');
    //socket function
    Socket.init();
    console.log('OKE');
    GameSettings.init(Socket.conn());
    //LocalStorage.init();
}