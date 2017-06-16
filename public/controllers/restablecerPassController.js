(function () {

    angular
        .module('app')
        .controller('RestablecerPassController', restablecerPassController);
    
    /**
     * @namespace restablecerPassController
     * @description
     * Controlador del modal mRestablecerPass.html
     */
    function restablecerPassController(AUTH, modalFactory, $uibModalInstance) {
        var vm = this;
        vm.error=modalFactory.error

        /**
         * @method restablecer 
         * @memberof restablecerPassController
         * @description
         * Envia un email para restablecer la contraseña
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
         * @method close 
         * @memberof restablecerPassController
         * @description
         * Cierra el modal
         */
        vm.close = function () {
            $uibModalInstance.close();
        };
    }
})();