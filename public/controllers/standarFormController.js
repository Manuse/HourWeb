(function () {

    angular.module('app').controller('StandarFormController', standarFormController);

    /**
     * @namespace standarFormController
     * @description 
     * Controlador del modal mStandarForm.html para el registro de los usuarios 
     */
    function standarFormController(DATABASE, AUTH, registerFactory, $uibModalInstance, modalFactory, errorFactory) {
        var vm = this;
        vm.error = modalFactory.error;
        
        /**
         * @method registrar 
         * @memberof standarFormController
         * @description
         * Valida los campos del formulario y su son validos pasa a comprobar el centro
         */
        vm.registrar = function () {
            console.log("entra")
            if (vm.nombre == 0 || vm.apellido == 0 || vm.email == 0 || vm.pass1 == 0 || vm.pass2 == 0 || vm.centro == 0
                || vm.nombre == null || vm.apellido == null || vm.email == null || vm.pass1 == null || vm.pass2 == null || vm.centro == null) {
                console.log("entra1")
                vm.error(errorFactory.getError("campoVacio"));
            } else if (vm.pass1 != vm.pass2) {
                console.log("entra2")
                vm.error(errorFactory.getError("contraseñaDistinta"));
            } else {
                console.log("entra3")
                vm.comprobarCentro();
            }
        }

        /**
         * @method comprobarCentro
         * @memberof standarFormController
         * @description
         * Comprueba que el centro existe si existe inserta al usuario
         */
        vm.comprobarCentro = function() {
            newuser = {
                id: 0,
                nombre: vm.nombre,
                apellido: vm.apellido,
                codcentro: vm.centro,
                tipo: "estandar",
                email:vm.email,
                verificado: false,
                baneo:false
            };
            DATABASE.ref("centros/" + vm.centro).once("value", function (snapshot) {
                if (snapshot.exists()) { //si existe registra el usuario
                    registerFactory.registrarUser(newuser, {}, vm.email, vm.pass1);
                } else {
                    vm.error(errorFactory.getError("centroInexistente"));
                }
            });
        };

        /**
         * @method close
         * @memberof standarFormController
         * @description 
         * Cierra el modal
         */
        vm.close = function(){
            $uibModalInstance.close();
        }
        

    }
})();