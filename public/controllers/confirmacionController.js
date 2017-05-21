(function() {


    angular
        .module('app')
        .controller('ConfirmacionController', confirmacionController);

    function confirmacionController($uibModalInstance, item, $timeout) {
        var vm = this;
        vm.mensaje = item;
        vm.close = function () {
            $uibModalInstance.close(false);
        }

        vm.ok=function(){
            $uibModalInstance.close(true);
        }

        
    }
})();