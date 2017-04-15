(function () {

    angular.module('app').controller('UserController', userController);

    function userController(userFactory, AUTH) {
        var vm = this;
        var interval = setInterval(recarga, 1000);
        
        vm.signOut = function () {
            AUTH.signOut();
        };
        
        vm.getUser = userFactory.getUser();
        
        vm.t = function(){
            console.log(vm.getUser);
            vm.getUser = userFactory.getUser()
        }
        
        function recarga() {
            if(userFactory.getUser()!=null){
                vm.getUser = userFactory.getUser();
                clearInterval(interval);
            }
        }
    }
})();