(function () {
    angular
        .module('app')
        .controller('LoginFormController', loginFormController);

    function loginFormController(AUTH, $uibModalInstance) {
        var vm = this;
         vm.error = "";
         vm.iniciarSesion = function() {
            AUTH.signInWithEmailAndPassword(vm.email, vm.pass).catch(function (error) {
                switch (error.code) { //dependiendo del error ejecutara un alert u otro
                    case "auth/invalid-email":
                        vm.error = "El email no es valido";
                        console.log(vm.error)
                        break;
                    case "auth/user-not-found":                        
                        vm.error = "El email o la contraseña no son validos";
                        break;
                    case "auth/wrong-password":
                        vm.error = "El email o la contraseña no son validos";
                        break;
                    default:
                        vm.error = "Ha ocurrido un error";
                }
            });
        }

        vm.close = function(){
            $uibModalInstance.close();
        }
    }
})();