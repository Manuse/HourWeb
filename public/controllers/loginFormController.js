(function () {
    angular
        .module('app')
        .controller('LoginFormController', loginFormController);

    function loginFormController(AUTH, $uibModalInstance, modalFactory, errorFactory) {
        var vm = this;
        vm.error = modalFactory.error;

        /**
         * @method iniciarSesion Inicia sesion de un usuario
         */
        vm.iniciarSesion = function () {
            AUTH.signInWithEmailAndPassword(vm.email, vm.pass).then(function () {
                    $uibModalInstance.close();
                },
                function (err) {
                    vm.error(errorFactory.getError(err));
                });
        }

        /**
         * @method close cierra el modal
         */
        vm.close = function () {
            $uibModalInstance.close();
        };

        vm.restablecerPass=function(){

        }
    }
})();