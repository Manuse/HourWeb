(function () {

    angular
        .module('app')
        .controller('ErrorController', errorController);

    function errorController($uibModalInstance, item) {
        var vm = this;
        vm.error = item;
        vm.close = function () {
            $uibModalInstance.close();
        }
    }
})();