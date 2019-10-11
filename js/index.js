$(function(){
    document.addEventListener("deviceready", onDeviceReady, false);
    console.log("ok",Localstoragegame.getLocalStorageGame("gameId"));

    //Kijken of het spel nog reeds bezig is
    if(Localstoragegame.getLocalStorageGame("gameId")!== null && Localstoragegame.getLocalStorageGame("userId")!==null){
        console.log("Start");
        //TODO kijken of game wel effectief bestaat (server site)
        window.location = "start.html";
    }
});
function onDeviceReady() {
    console.log('Device is ready');

}