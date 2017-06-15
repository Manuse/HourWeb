(function () {

    angular.module('app').controller('NavController', navController);

    function navController(userFactory, AUTH, $timeout, $location, $log) {
        var vm = this;
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
         * @method signOut Desloguea a un usuario
         */
        vm.signOut = function () {
            AUTH.signOut();
        };

        /**
         * @method recarga Carga los datos del usuario
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