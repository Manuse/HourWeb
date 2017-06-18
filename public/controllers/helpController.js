(function() {

    angular
        .module('app')
        .controller('HelpController', helpController);
    /**
     * @namespace helpController
     * @description
     * Controlador para los modales de ayuda
     */

    /**
     * @method helpController
     * @memberof controllers
     * @param {object} uibModalInstance servicio de modales del angular
     * @description
     * Controlador para los modales de ayuda 
     */
    function helpController($uibModalInstance) {
        var vm = this;
       
        /**
         * @method close 
         * @memberof helpController
         * @description
         * Cierra el modal
         */
        vm.close = function () {
            $uibModalInstance.close();
        };

        vm.fotos={
            botonSemana12:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Fboton-semana12.png?alt=media&token=39d7ec50-bf77-4eae-8259-b0a675c75863",
            listasFull:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Flistas-full.png?alt=media&token=59e2caea-53a2-47a0-b8cc-430414224a9d",
            casillaNoPermanente:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Fcasilla-no-permanente.png?alt=media&token=b60fee20-a8fc-43fc-9084-c477dbe0bc71",
            casillaPermanente:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Fcasilla-permanente.png?alt=media&token=97bdf74d-60c7-4695-8f66-f8ce3027b2ea",
            casillaActual:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Fcasilla-actual.png?alt=media&token=5d92a923-0918-41d9-befc-301aff50bd52",
            casillaPasada:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Fcasilla-pasada.png?alt=media&token=a6126982-8703-485a-8be1-87fa6db40754",
            tablaMiHorario:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Ftabla-mi-horario.png?alt=media&token=36feef74-643f-49d2-953a-f2e93cac753b",
            mensajes:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Fmensajes.png?alt=media&token=9a20574b-e03d-4838-8523-b6f6f5ded64e",
            adminDropdown:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Fadmin-dropdown.png?alt=media&token=bd7cd9f8-4c34-4367-8b2b-66dda74e3633",
            perfil1:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Fperfil1.png?alt=media&token=c2585c7d-8c4d-4ef0-9e06-8321728cdc9f",
            perfil2:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Fperfil2.png?alt=media&token=023f045e-3c02-487f-8dd7-195014b40b8f",
            adminRecurso:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Fadmin-recurso.png?alt=media&token=334324f4-6dce-49c4-aa5b-feb8803b81ac",
            permanente:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Fpermanente.png?alt=media&token=03ebe3b8-22b7-489a-a627-58857a3f446c",
            usuariosAdmin:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Fusuarios-admin.png?alt=media&token=255c2b6d-a733-4b61-a482-baf1fb62329f",
            centroAdmin:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Fcentro-admin.png?alt=media&token=8b17ded0-902d-4b1d-bb5a-a6bcd79d27d7",
            cursoAdmin:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Fcurso-admin.png?alt=media&token=2dc3c8e6-f453-48fc-b016-20c2198c70d5",
            comboRecurso:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Fcombo-recurso.png?alt=media&token=7dd71562-c71a-428f-8da0-4e059d49a479",
            comboReservar:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Fcombo-reservar.png?alt=media&token=3e34f120-783d-4da1-9169-882fdddcafd5",
            tablaReservas:"https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/web%2Ftabla-mi-horario.png?alt=media&token=36feef74-643f-49d2-953a-f2e93cac753b"

        }

    }
})();