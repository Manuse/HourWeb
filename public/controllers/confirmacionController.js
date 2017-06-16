(function () {

    angular
        .module('app')
        .controller('ConfirmacionController', confirmacionController);
    
    /**
     * @namespace confirmacionController
     * @description
     * Controlador del modal mConfirmacion.html
     */
    function confirmacionController($uibModalInstance, item, $timeout) {
        var vm = this;
        vm.mensaje = item;

        /**
         * @method close 
         * @memberof confirmacionController
         * @description
         * Cierra el modal y devuelve false
         */
        vm.close = function () {
            $uibModalInstance.close(false);
        }

        /**
         * @method ok 
         * @memberof confirmacionController
         * @description
         * Cierra el modal y devuelve true
         */
        vm.ok = function () {
            $uibModalInstance.close(true);
        }
        
    }
})();