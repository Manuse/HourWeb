(function () {

    angular.module('app').controller('AdminFormController', adminFormController);

    /**
     * @namespace adminFormController
     * @description 
     * Controlador del modal del formulario del registro como administrador mAdminForm.html
     */
    function adminFormController(DATABASE, AUTH, registerFactory, $uibModalInstance, modalFactory,$log, errorFactory) {
        var vm = this;
        vm.inicioHora = new Date('1/1/1 12:00');
        vm.finHora = new Date('1/1/1 13:00');
        vm.error = modalFactory.error;

        /**
         * @method vm.registrar 
         * @memberof adminFormController
         * @description
         * Valida los campos del formulario si pasa el filtro procede a registrar
         */
        vm.registrar = function () {
            if (vm.nombre == 0 || vm.apellido == 0 || vm.email == 0 || vm.pass1 == 0 || vm.pass2 == 0 || vm.centro == 0
                || vm.nombre == null || vm.apellido == null || vm.email == null || vm.pass1 == null || vm.pass2 == null || vm.centro == null) {
                vm.error(errorFactory.getError("campoVacio"));
            } else if (vm.inicioHora >= vm.finHora || vm.finHora-vm.inicioHora < 7200000) {
                vm.error(errorFactory.getError("errorHoraRegistro"));
            } else if (vm.pass1 != vm.pass2) {
                vm.error(errorFactory.getError("contraseñaDistinta"));
            } else {
                vm.registrarAdmin();
            }
        }

        /**
         * @method vm.registrarAdmin 
         * @memberof adminFormController
         * @description
         * Registra un administrador
         */
        vm.registrarAdmin = function() {        
            newcentro = { //le damos los valores que se van a insertar en la base de datos a los objetos
                nombre: vm.centro,
                horas: vm.inicioHora.getHours()+':'+(vm.inicioHora.getMinutes()!=0 ? vm.inicioHora.getMinutes():vm.inicioHora.getMinutes()+'0')+'-'+vm.finHora.getHours()+':'+(vm.finHora.getMinutes()!=0 ? vm.finHora.getMinutes():vm.finHora.getMinutes()+'0'),
                rango_horas:vm.finHora.getHours()-vm.inicioHora.getHours(),
                tipos:["Clase"]
            };
            newuser = {
                id: 0,
                nombre: vm.nombre,
                apellido: vm.apellido,
                codcentro: 0,
                tipo: "administrador",
                email:vm.email,
                verificado: false,
                baneo:false
            };
            registerFactory.registrarUser(newuser, newcentro, vm.email, vm.pass1);
        };

        /**
         * @method close 
         * @memberof adminFormController
         * @description
         * Cierra el modal 
         */
        vm.close = function(){
            $uibModalInstance.close();
        }
        

        /* variables para cambiar hora según rango */
        vm.horaup = 1;
        vm.minutoup = 30;    
            
    }
})();