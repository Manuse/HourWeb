(function () {
    angular
        .module('app')
        .controller('LoginFormController', loginFormController);

    /**
     * @namespace loginFormController
     * @description
     * Controlador del modal mLoginForm.html para loguearse en la pagina
     */
    function loginFormController(AUTH, $uibModalInstance, modalFactory, errorFactory) {
        var vm = this;
        vm.error = modalFactory.error;
        vm.restablecer = modalFactory.restablecerPass;

        /**
         * @method iniciarSesion 
         * @memberof loginFormController
         * @description
         * Inicia sesion de un usuario
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
         * @method close 
         * @memberof loginFormController
         * @description
         * Cierra el modal
         */
        vm.close = function () {
            $uibModalInstance.close();
        };

        /**
         * @method restablecerPass 
         * @memberof loginFormController
         * @description
         * Cierra el modal actual y abre el de restablecer contraseña
         */
        vm.restablecerPass=function(){
            vm.restablecer();
            vm.close();
        }
    }
})();