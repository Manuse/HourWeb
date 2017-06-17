(function() {

    angular
        .module('app')
        .controller('HelpController', helpController);

    function helpController($uibModalInstance) {
        var vm = this;
       
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