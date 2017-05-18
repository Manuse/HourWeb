(function () {

    angular
        .module('app')
        .controller('AdministradorController', administradorController);

    function administradorController($log) {
        var vm = this;

        

        // Timepicker reservas permanentes
        vm.mytime = new Date("1/1/1 12:00");

        vm.hstep = 1;
        vm.mstep = 30;


        //Accordion
        vm.oneAtATime = true;       

    }

})();
