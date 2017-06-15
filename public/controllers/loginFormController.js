(function () {
    angular
        .module('app')
        .controller('LoginFormController', loginFormController);

    function loginFormController(AUTH, $uibModalInstance, modalFactory, errorFactory) {
        var vm = this;
        vm.error = modalFactory.error;
        vm.restablecer = modalFactory.restablecerPass;

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

        /**
         * @method restablecerPass cierra el modal actual y abre el de restablecer contraseña
         */
        vm.restablecerPass=function(){
            vm.restablecerPass();
            $uibModalInstance.close();
        }
    }
})();