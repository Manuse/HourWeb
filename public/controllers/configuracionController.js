(function() {


    angular
        .module('app')
        .controller('ConfiguracionController', configuracionController);

    function configuracionController($timeout, userFactory, DATABASE, AUTH, STORAGE, $log) {
        var vm = this;
        
        var interval = function(){$timeout(recarga, 1000);};
        interval();

        function recarga() {
            if (userFactory.getUser() != null) {
                $timeout(function () {
                    vm.getUser = userFactory.getUser();
                    vm.photo = userFactory.getPhoto();
                },0);
            }else{
                interval();
            }
        }

         vm.visualizar=function(bool){
            vm.eye = !vm.eye;
            $timeout(function(){
                vm.eye=false;
            }, 800);
        }
       
    }
})();