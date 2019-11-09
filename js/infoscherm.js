$(function(){
    // load html
    $( "head,#navigation,.content,#modalvesters,#footer" ).hide();
    loader();

    document.addEventListener("deviceready", onDeviceReady, false);

});
function loader(){
    $( "head" ).load( "template/head.html" );
    $( "#navigation" ).load( "template/navigation.html" );
    //$( "#content" ).load( "template/page/content-index.html" );
    $( "#footer" ).load( "template/footer.html" );
}
function onDeviceReady() {
    console.log('Device is ready');

}

// word geladen
$(window).on("load",function(){
    setTimeout( function(){
        $(".screenLoader").hide();
        $( "head,#navigation,.content,#modalvesters,#footer" ).show();
    }  , 1500 );

});