(function () {

    angular
        .module('app')
        .controller('ErrorController', errorController);

    function errorController($uibModalInstance, item, $timeout) {
        var vm = this;
        vm.error = item;
        vm.close = function () {
            $uibModalInstance.close();
        }

        var interval = $timeout(function(){
             $uibModalInstance.close();
        }, 2000);
        interval();
    }
})();