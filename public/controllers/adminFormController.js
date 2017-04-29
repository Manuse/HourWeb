(function () {

    angular.module('app').controller('AdminFormController', adminFormController);

    function adminFormController(DATABASE, AUTH, registerFactory, $uibModalInstance, $uibModal,$log) {
        var vm = this;
        vm.inicioHora = new Date('1/1/1 12:00');
        vm.finHora = new Date('1/1/1 13:00');

        vm.registrar = function () {
            $log.log(vm.finHora-vm.inicioHora)
            if (vm.nombre == 0 || vm.apellido == 0 || vm.email == 0 || vm.pass1 == 0 || vm.pass2 == 0 || vm.centro == 0 || vm.horas == 0) {
                vm.error("Rellene todos los campos");
            } else if (vm.inicioHora >= vm.finHora || vm.finHora-vm.inicioHora < 7200000) {
                console.log(vm.finHora-vm.inicioHora > 7200000)
                vm.error("El inicio debe ser menor que el final y haber un minimo de 2 horas de diferencia");
            } else if (vm.pass1 != vm.pass2) {
                vm.error("Las contraseñas no son iguales");
            } else {
                vm.registrarAdmin();
            }
        }

        vm.registrarAdmin = function() {
            console.log(vm.inicioHora.getHours()+':'+vm.inicioHora.getMinutes()+'-'+vm.finHora.getHours()+':'+vm.finHora.getMinutes())
            newcentro = { //le damos los valores que se van a insertar en la base de datos a los objetos
                nombre: vm.centro,
                horas: vm.inicioHora.getHours()+':'+vm.inicioHora.getMinutes()+'-'+vm.finHora.getHours()+':'+vm.finHora.getMinutes(),
                rango_horas:vm.finHora.getHours()-vm.inicioHora.getHours()
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
        };

        vm.close = function(){
            $uibModalInstance.close();
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

        /* variables para cambiar hora según rango */
        vm.horaup = 1;
        vm.minutoup = 30;    
        
        
    }
})();