(function () {
    angular.module('app').controller('LoginController', loginController);

    function loginController($uibModal) {
        var vm = this;
        vm.animationsEnabled = true;
        vm.loginForm = function() {
            var modalInstance = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'modal/mLoginForm.html',
                controller: 'LoginFormController',
                controllerAs: 'vmm'
            });

            modalInstance.result.then(function () {
     
            }, function () {
      
             });
        }

        vm.adminForm = function() {
           var modalInstance = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'modal/mAdminForm.html',
                controller: 'AdminFormController',
                controllerAs: 'vmm'
            });

            modalInstance.result.then(function () {
     
            }, function () {
      
             });
        }

        vm.standarForm = function() {
            var modalInstance = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'modal/mStandarForm.html',
                controller: 'StandarFormController',
                controllerAs: 'vmm'
            });

            modalInstance.result.then(function () {
     
            }, function () {
                
             });
        }


    }
})();