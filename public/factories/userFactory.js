(function () {
    angular
        .module('app')
        .factory('userFactory', userFactory);

    
    /**
     * @namespace userFactory
     * @description 
     * Factoria para compartir informacion del usuario
     */
    function userFactory(DATABASE, AUTH, $timeout) {
        var users;
        var photo;
        var code;

        /**
         * @method getDataUser 
         * @memberof userFactory
         * @description
         * Consulta los datos del usuario actual
         */
        function getDataUser() {
            DATABASE.ref("user/").orderByChild("id").equalTo(AUTH.currentUser.uid).on("value", function (snapshot) {
                $timeout(function () {
                    users = snapshot.val()[Object.keys(snapshot.val())[0]];
                    photo = AUTH.currentUser.photoURL;
                    code = Object.keys(snapshot.val())[0];
                }, 0);
            });
        }

        var factory = {
            /**
             * @method getUser 
             * @memberof userFactory
             * @return objeto usuario
             * @description
             * Devuelve el objeto usuario
             */
            getUser: function () {
                return users;
            },
            /**
             * @method getPhoto 
             * @memberof userFactory
             * @return url de la foto
             * @description
             * Devuelve la url de la foto
             */
            getPhoto: function () {
                return photo;
            },
            /**
             * @method setPhoto 
             * @memberof userFactory
             * @param {String} url url de la foto
             * @description
             * Setea el enlace de la foto
             */
            setPhoto: function (url) {
                photo = url;
            },
            /**
             * @method setUser 
             * @memberof userFactory
             * @param {object} user objeto user
             * @description
             * Setea el usuario
             */
            setUser: function (user) {
                users = user;
            },
            /**
             * @method getCode 
             * @memberof userFactory
             * @return codigo del nodo
             * @description
             * Devuelve codigo del nodo del usuario
             */
            getCode: function () {
                return code;
            },
            /**
             * @method getData
             * @memberof userFactory
             * @description
             *  Refresca los datos del usuario consultando la base de datos
             */
            getData: function () {
                getDataUser();
            }
        };
        return factory;
    }
})();