(function () {

    angular
        .module('app')
        .controller('ConfirmacionController', confirmacionController);

    function confirmacionController($uibModalInstance, item, $timeout) {
        var vm = this;
        vm.mensaje = item;

        /**
         * Cierra el modal y devuelve false
         */
        vm.close = function () {
            $uibModalInstance.close(false);
        }

        /**
         * Cierra el modal y devuelve true
         */
        vm.ok = function () {
            $uibModalInstance.close(true);
        }
        
    }
})();