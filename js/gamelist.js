$(function(){
    //load page
    $( "head,#navigation,#content,#footer" ).hide();
    loader();


    document.addEventListener("deviceready", onDeviceReady, false);

    // Button Start new game
    $("#startNewGameModal").on("click", function(){
        // input game leegmaken
        $('#newGameName').val('');
    });


    $('#startNewGame').click(function () {
        var gameName = $('input#newGameName').val();
        // add new game
        GameSettings.addNewGame(gameName);
        //leegmaken voor de volgende
        $('input#recipient-name').val('');
    });

    $("#setGameNameButton").on("click", function(){
        //socket
        GameSettings.setName(Localstoragegame.getGameId(),$('input#setGameName').val());
        // reload Game
        GameSettings.getAllGames(Socket.conn());
    });

    // reload button
    $('#reloadnewgames').click(function () {
        GameSettings.getAllGames();
    });

    //Select location choise
    $("ul#placeList").on("click","li", function(){
        // save new place
        GameSettings.setPlaceId(Localstoragegame.getGameId(),$(this).attr("data-locationId"));
        // hide modal screen
        $('#setPlaceModal').modal('hide');
        // reload
        GameSettings.getAllGames();
    });


});

function onDeviceReady() {
    console.log('Device is ready');
    //Functions
    Socket.init();
    Localstoragegame.init();
    GameSettings.init(Socket.conn());
}


// show model
function changeGameName(elem){
    // read old GameSettings names
    $('input#setGameName').val($(elem).text());
    $('#StartsetGameNameModel').modal('show');
    // save gameId
    Localstoragegame.setGameId($(elem).attr("data-gameId"));
    //Localstoragegame.gameId = $(elem).attr("data-gameId");
    //GameSettings.gameId = $(elem).attr("data-gameId");

}

function changePlace(elem){
    // Get location names
    GameSettings.getAllPlaces(Socket.conn());

    // show modal
    $('#setPlaceModal').modal('show');
    // save gameId
    Localstoragegame.setGameId($(elem).attr("data-gameId"));
    //Localstoragegame.gameId = $(elem).attr("data-gameId");
    //GameSettings.gameId = $(elem).attr("data-gameId");
    // miss
    GameSettings.elementedite = elem;

}


function addUserPage(elem){
    GameSettings.addUserPage(Localstoragegame,$(elem).attr("data-gameId"));
}

function loader(){
    $( "head" ).load( "template/head.html" );
    $( "#navigation" ).load( "template/navigation.html" );
    $( "#footer" ).load( "template/footer.html" );
}

// Load The page
$(window).on("load",function(){
    setTimeout( function(){
        $(".screenLoader").hide();
        $( "head,#navigation,#content,#modalvesters,#footer" ).show();
    }  , 1500 );
});