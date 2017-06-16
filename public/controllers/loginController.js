(function () {
    angular.module('app').controller('LoginController', loginController);

    /**
     * @namespace loginController
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