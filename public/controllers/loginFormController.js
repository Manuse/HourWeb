(function () {
    angular
        .module('app')
        .controller('LoginFormController', loginFormController);

    function loginFormController(AUTH, $uibModalInstance, $uibModal, errorFactory) {
        var vm = this;

         vm.iniciarSesion = function() {
            AUTH.signInWithEmailAndPassword(vm.email, vm.pass).catch(function (err) {
                vm.error(errorFactory.getError(err));
            });
        }

        vm.error = function(err){
            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: 'modal/mError.html',
                controller: 'ErrorController',
                controllerAs: 'vmmm',
                resolve:{
                    item: function(){
                        return err;
                    }
                }
            });

            modalInstance.result.then(function () {
     
            }, function () {
      
            });
        };

        vm.close = function(){
            $uibModalInstance.close();
        };
    }
})();