(function () {

    angular
        .module('app')
        .controller('ErrorController', errorController);

    function errorController($uibModalInstance, item, $timeout) {
        var vm = this;
        vm.error = item.error;
        vm.tipo = item.tipo;
        vm.close = function () {
            $uibModalInstance.close();
        };

        if (vm.tipo === undefined) {
            $timeout(function () {
                $uibModalInstance.close();
            }, 2000);
        }
    }
})();