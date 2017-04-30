(function () {

    angular.module('app').controller('NavController', navController);

    function navController(userFactory, AUTH, $timeout) {
        var vm = this;
        var interval = setInterval(recarga, 1000);
        vm.isNavCollapsed = true;

        vm.signOut = function () {
            AUTH.signOut();
        };

        vm.getUser = userFactory.getUser();
        vm.photo = userFactory.getPhoto();
        
        function recarga() {
            if (userFactory.getUser() != null) {
                $timeout(function () {
                    vm.getUser = userFactory.getUser();
                    vm.photo = userFactory.getPhoto();
                    clearInterval(interval);
                },0);

            }
        }
    }
})();