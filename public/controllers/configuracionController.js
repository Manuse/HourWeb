(function() {


    angular
        .module('app')
        .controller('ConfiguracionController', configuracionController);

    function configuracionController() {
        var vm = this;
        
         var interval = function(){$timeout(recarga, 1000)};
        
        function recarga() {
            if (userFactory.getUser() != null) {
                $timeout(function () {
                    vm.getUser = userFactory.getUser();
                },0);
            }else{
                interval();
            }
        }
       
    }
})();