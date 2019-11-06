/**
 *
 * @type {{removeLocalStorageGame, setLocalStorageGame, getLocalStorageGame}}
 * @Class Localstoragegame
 */
let Localstoragegame = function () {

    /**
     * @memberof Localstoragegame#
     * @param variable
     * @param data
     */
    let setLocalStorageGame = function (variable, data) {
        try {
            localStorage.setItem(variable, data);
        } catch (err) {
            console.log("Error : Can't storage ");
            $.snackbar({content: "Error : Can't storage "});
        }
    };

    /**
     * @memberof Localstoragegame#
     * @param variable
     * @returns {string}
     */
    let getLocalStorageGame = function (variable) {
        try {
            return localStorage.getItem(variable);
        } catch (err) {
            console.log("Error : Can't find storage ");
            toastr.error(message.data,'Fout!',{"timeOut": 3000});
            //$.snackbar({content: "Error : Can't find storage "});
        }
    };
    /**
     * @memberof Localstoragegame#
     * @param variable
     */
    let removeLocalStorageGame = function (variable) {
        try {
            return localStorage.removeItem(variable);
        } catch (err) {
            console.log("Error : Can't remove storage ");
            toastr.error(message.data,'Fout!',{"timeOut": 3000});
            //$.snackbar({content: "Error : Can't remove storage "});
        }
    };


    /**
     * @memberof Localstoragegame#
     */
    return {
        setLocalStorageGame: setLocalStorageGame,
        getLocalStorageGame: getLocalStorageGame,
        removeLocalStorageGame:removeLocalStorageGame
    };

}();
