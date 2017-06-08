(function () {

    angular.module('app').controller('StandarFormController', standarFormController);

    function standarFormController(DATABASE, AUTH, registerFactory, $uibModalInstance, modalFactory, errorFactory) {
        var vm = this;
        vm.error = modalFactory.error;
        
        vm.registrar = function () {
            if (vm.nombre == 0 || vm.apellido == 0 || vm.email == 0 || vm.pass1 == 0 || vm.pass2 == 0 || vm.centro == 0) {
                vm.error(errorFactory.getError("campoVacio"));
            } else if (vm.pass1 != vm.pass2) {
                vm.error(errorFactory.getError("contraseñaDistinta"));
            } else {
                vm.comprobarCentro();
            }
        }


        vm.comprobarCentro = function() {
            newuser = {
                id: 0,
                nombre: vm.nombre,
                apellido: vm.apellido,
                codcentro: vm.centro,
                tipo: "estandar",
                email:vm.email,
                verificado: false
            };
            DATABASE.ref("centros/" + vm.centro).once("value", function (snapshot) {
                if (snapshot.exists()) { //si existe registra el usuario
                    registerFactory.registrarUser(newuser, {}, vm.email, vm.pass1);
                } else {
                    vm.error(errorFactory.getError("centroInexistente"));
                }
            });
        };

        vm.close = function(){
            $uibModalInstance.close();
        }
        

    }
})();