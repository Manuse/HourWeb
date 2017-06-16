(function () {

    angular.module('app').controller('NavController', navController);

    /**
     * @namespace navController
     * @description
     * Controlador del navbar
     */
    function navController(userFactory, AUTH, $timeout, $location, $log) {
        var vm = this;

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