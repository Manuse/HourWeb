(function() {

    angular
        .module('app')
        .controller('HelpController', helpController);
    /**
     * @namespace helpController
     * @description
     * Controlador para los modales de ayuda
     */

    /**
     * @method helpController
     * @memberof controllers
     * @param {object} uibModalInstance servicio de modales del angular
     * @description
     * Controlador para los modales de ayuda 
     */
    function helpController($uibModalInstance) {
        var vm = this;
       
        /**
         * @method close 
         * @memberof helpController
         * @description
         * Cierra el modal
         */
        vm.close = function () {
            $uibModalInstance.close();
        };

    }
})();