/**
 *
 * @type {{init,setGameId,getGameId,setUser,getUser,removeLocalStorageGame, setLocalStorageGame, getLocalStorageGame}}
 * @Class Localstoragegame
 */
let Localstoragegame = function () {
    let gameId;
    let user;

    let init = function(){
        gameId = getLocalStorageGame("gameId");
        user = JSON.parse(getLocalStorageGame("user"));
    }


    /**
     * Set Game id and local storage
     * @memberof Localstoragegame#
     * @param {Int} Id - The game Id
     */
    let setGameId = function(Id){
        //variable
        gameId = Id;

        //local storage
        setLocalStorageGame("gameId", Id);
    }

    /**
     * Get game Id
     * @returns {Int} gameId - The game Id
     */
    let getGameId = function(){
        return gameId;
    }

    /**
     * Get User Id
     * @returns {Int} userId - The user Id
     */
    let getUserId = function(){
        return getUser().id;
    }


    /**
     * Set user value and local storage
     * @memberof Localstoragegame#
     * @param {Json} data - Information about User
     *
     */
    let setUser = function(data){
        // variable
        user = data;

        //local storage
        setLocalStorageGame("user",user);
    }

    /**
     * Get User value
     * @memberof Localstoragegame#
     * @returns {Json} User - get User information
     */
    let getUser = function(){
        return user;
    }

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
        init:init,
        setGameId:setGameId,
        getGameId:getGameId,
        setUser:setUser,
        getUser:getUser,
        getUserId:getUserId,
        setLocalStorageGame: setLocalStorageGame,
        getLocalStorageGame: getLocalStorageGame,
        removeLocalStorageGame:removeLocalStorageGame
    };

}();
