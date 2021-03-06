(function () {

    angular.module('app').controller('NavController', navController);

    /**
     * @namespace navController
     * @description
     * Controlador del navbar
     */

    /**
     * @method navController
     * @memberof controllers
     * @param {object} userFactory factoria con los datos del usuario
     * @param {object} AUTH constante de firebase.auth()
     * @param {object} timeout servicio de timeout de angular
     * @param {object} location servicio de rutas de angular
     * @param {object} log servicio de logging de angular
     * @param {object} modalFactory factoria de modales
     * @description
     * Controlador del navbar
     */
    function navController(userFactory, AUTH, $timeout, $location, $log, modalFactory) {
        var vm = this;
        vm.ayuda=modalFactory.help;

        /*
         *Intervalo para recargar
         */
        var interval = function () {
            $timeout(recarga, 50);
        };
        interval();
        vm.isNavCollapsed = true;

        //si no esta logueado lo redirige al login
        $timeout(function () {
            if (AUTH.currentUser == null) {
                $location.path("/login");
            }
        }, 350);

        /**
         * @method signOut 
         * @memberof navController
         * @description
         * Desloguea a un usuario
         */
        vm.signOut = function () {
            AUTH.signOut();
        };

        /**
         * @method recarga 
         * @memberof navController
         * @description
         * Carga los datos del usuario cuando estan disponibles
         */
        function recarga() {
            if (userFactory.getUser() != null) {
                $timeout(function () {
                    vm.getUser = userFactory.getUser;
                    vm.photo = userFactory.getPhoto;
                }, 0);
            } else {
                interval();
            }
        }
    }
})();