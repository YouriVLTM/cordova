$(function(){

    $( "head,#navigation,#content,#footer" ).hide();
    loader();

    document.addEventListener("deviceready", onDeviceReady, false);

    $(".personalities").on("click", function(){
        GameSettings.personalitie = $(this).attr("data-personalitie");
        $('#StartsetUsernameModel').modal('show');
        // leegmaken
        $('#setUserName').val('');

    });

    $("#setUsernameButton").on("click", function(){
        console.log("New user name");
        GameSettings.createNewUser(Localstoragegame.getGameId(),$('#setUserName').val(),GameSettings.personalitie);
        $('#StartsetUsernameModel').modal('hide');

        // Go to Maps
        GameSettings.goToMaps(Localstoragegame.getGameId());
    });




});
function loader(){
    $( "head" ).load( "template/head.html" );
    $( "#navigation" ).load( "template/navigation.html" );
    $( "#footer" ).load( "template/footer.html" );
}

// word geladen
$(window).on("load",function(){
    setTimeout( function(){
        $(".screenLoader").hide();
        $( "head,#navigation,#content,#modalvesters,#footer" ).show();
    }  , 1500 );
});

function onDeviceReady() {
    console.log('Device is ready');
    Socket.init();
    Localstoragegame.init();
    GameSettings.init(Socket.conn());

    //load counters
    getAllcounters();
}
function getAllcounters(){
    console.log("oke functions tart");
    GameSettings.getCountAgent(Localstoragegame.getGameId());
    GameSettings.getCountPrisoner(Localstoragegame.getGameId());
}