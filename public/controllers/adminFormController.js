(function () {

    angular.module('app').controller('AdminFormController', adminFormController);

    function adminFormController(DATABASE, AUTH, registerFactory, $uibModalInstance, $uibModal) {
        var vm = this;

        vm.registrar = function () {
            if (vm.nombre == 0 || vm.apellido == 0 || vm.email == 0 || vm.pass1 == 0 || vm.pass2 == 0 || vm.centro == 0 || vm.horas == 0) {
                vm.error = "Rellene todos los campos";
            } else if (isNaN(vm.horas)) {
                vm.error = "El numero de horas debe ser numero";
            } else if (vm.horas < 2 || vm.horas > 8) {
                vm.error = "Debe seleccionar un rango entre 2 y 8 horas";
            } else if (vm.pass1 != vm.pass2) {
                vm.error = "Las contraseñas no son iguales";
            } else {
                vm.registrarAdmin();
            }
        }

        vm.registrarAdmin = function() {
            newcentro = { //le damos los valores que se van a insertar en la base de datos a los objetos
                nombre: vm.centro,
                horas: vm.horas
            };
            newuser = {
                id: 0,
                nombre: vm.nombre,
                apellido: vm.apellido,
                codcentro: 0,
                tipo: "administrador",
                verificado: false
            };
            registerFactory.registrarUser(newuser, newcentro, vm.email, vm.pass1);
        }

        vm.close = function(){
            $uibModalInstance.close();
        }
        
    }
})();