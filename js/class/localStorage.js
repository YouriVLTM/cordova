let Localstoragegame = function () {

    let setLocalStorageGame = function (variable, data) {
        try {
            localStorage.setItem(variable, data);
        } catch (err) {
            console.log("Error : Can't storage ");
            $.snackbar({content: "Error : Can't storage "});
        }
    };

    let getLocalStorageGame = function (variable) {
        try {
            return localStorage.getItem(variable);
        } catch (err) {
            console.log("Error : Can't find storage ");
            $.snackbar({content: "Error : Can't find storage "});
        }
    };


    return {
        setLocalStorageGame: setLocalStorageGame,
        getLocalStorageGame: getLocalStorageGame
    };

}();
