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
            toastr.error(message.data,'Fout!',{"timeOut": 3000});
            //$.snackbar({content: "Error : Can't find storage "});
        }
    };

    let removeLocalStorageGame = function (variable) {
        try {
            return localStorage.removeItem(variable);
        } catch (err) {
            console.log("Error : Can't remove storage ");
            toastr.error(message.data,'Fout!',{"timeOut": 3000});
            //$.snackbar({content: "Error : Can't remove storage "});
        }
    };



    return {
        setLocalStorageGame: setLocalStorageGame,
        getLocalStorageGame: getLocalStorageGame,
        removeLocalStorageGame:removeLocalStorageGame
    };

}();
