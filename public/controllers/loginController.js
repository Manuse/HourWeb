(function () {
    angular.module('app').controller('LoginController', loginController);

    /**
     * @namespace loginController
     * @description
     * Controlador de la vista login.html
     */

    /**
     * @method loginController
     * @memberof controllers
     * @param {object} AUTH constante de firebase.auth()
     * @param {object} DATABASE constante de firebase.database()
     * @param {object} modalFactory factoria de modales
     * @param {object} location servicio de rutas de angular
     * @param {object} timeout servicio de timeout de angular
     * @description
     * Controlador de la vista login.html
     */
    function loginController(AUTH, DATABASE, modalFactory, $location, $timeout) {
        var vm = this;
        vm.loginForm = modalFactory.loginForm;
        vm.adminForm = modalFactory.adminForm;
        vm.standarForm = modalFactory.standarForm;

        //si esta logueado lo redirige a principal
        $timeout(function () {
            if (AUTH.currentUser != null) {
                $location.path("/principal/home");
            }
        }, 350);
    }
})();