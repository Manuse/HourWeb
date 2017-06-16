(function () {

    angular
        .module('app')
        .controller('ErrorController', errorController);

    /**
     * @namespace errorController
     * @description
     * Controlador del modal nError.html usado tambien para notificaciones
     */
    function errorController($uibModalInstance, item, $timeout) {
        var vm = this;
        vm.error = item.error;
        vm.tipo = item.tipo;

        /**
         * @method close 
         * @memberof errorController
         * @description
         * Cierra el modal
         */
        vm.close = function () {
            $uibModalInstance.close();
        };

        //si tipo es indefinido se ejecuta el timeout para cerrar el modal
        if (vm.tipo === undefined) {
            $timeout(function () {
                $uibModalInstance.close();
            }, 2000);
        }
    }
})();