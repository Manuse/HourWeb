(function () {

    angular
        .module('app')
        .controller('ProgressBarController', progressBarController);
    
    /**
     * @namespace progressBarController
     * @description
     * Controlador del modal mProgressBar
     */

    /**
     * @method progressBarController
     * @memberof controllers
     * @param {object} uibModalInstance servicio de modales del angular
     * @param {object} progressBarFactory factoria para manejar la progress bar
     * @param {object} timeout servicio de timeout de angular
     * @description
     * Controlador del modal mProgressBar
     */
    function progressBarController($uibModalInstance, progressBarFactory, $timeout) {
        var vm = this;
        vm.value = progressBarFactory.getProgress;
        vm.max=100;
       
        /**
         * @method refrescar 
         * @memberof progressBarController
         * @description
         * Intervalo que comprueba el valor de la barra de progreso, si es 100 cierra el modal
         */
        var refrescar = function () {
            $timeout(function () {
                if (vm.value() < 100) {
                    refrescar();
                } else {
                    $uibModalInstance.close();
                }
            }, 500);
        }
        refrescar();

    }
})();