(function () {

    angular
        .module('app')
        .controller('ProgressBarController', progressBarController);

    function progressBarController($uibModalInstance, progressBarFactory, $timeout) {
        var vm = this;
        vm.value = progressBarFactory.getProgress;
        vm.max=100;
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