(function () {

    angular
        .module('app')
        .controller('RestablecerPassController', restablecerPassController);

    function restablecerPassController(AUTH, modalFactory, $uibModalInstance) {
        var vm = this;
        vm.error=modalFactory.error

        /**
         * @method restablecer Envia un email para restablecer la contraseña
         */
        vm.restablecer=function() {
            AUTH.sendPasswordResetEmail(vm.email).then(function () {
                vm.error("Se ha enviado un email a su correo",1);
                $uibModalInstance.close();
            }, function (error) {
                vm.error(error)
            })
        }

        /**
         * @method close cierra el modal
         */
        vm.close = function () {
            $uibModalInstance.close();
        };
    }
})();