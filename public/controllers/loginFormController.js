(function () {
    angular
        .module('app')
        .controller('LoginFormController', loginFormController);

    function loginFormController(AUTH, $uibModalInstance, $uibModal) {
        var vm = this;

         vm.iniciarSesion = function() {
            AUTH.signInWithEmailAndPassword(vm.email, vm.pass).catch(function (error) {
                switch (error.code) { //dependiendo del error ejecutara un alert u otro
                    case "auth/invalid-email":
                        vm.error("El email no es válido");                 
                        break;
                    case "auth/user-not-found":                        
                        vm.error("El email o la contraseña no son válidos");
                        break;
                    case "auth/wrong-password":
                        vm.error("El email o la contraseña no son válidos");
                        break;
                    default:
                        vm.error("Ha ocurrido un error");
                }
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