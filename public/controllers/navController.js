(function () {

    angular.module('app').controller('NavController', navController);

    function navController(userFactory, AUTH, $scope) {
        var vm = this;
        var interval = setInterval(recarga, 1000);
        vm.isNavCollapsed = true;

        vm.status = {
            isOpen: true
        };

        vm.signOut = function () {
            AUTH.signOut();
        };

        vm.getUser = userFactory.getUser();

        vm.t = function () {
            console.log(vm.getUser);
            vm.getUser = userFactory.getUser()
        };

        function recarga() {
            if (userFactory.getUser() != null) {
                $scope.$apply(function () {
                    vm.getUser = userFactory.getUser();
                    clearInterval(interval);
                });

            }
        }
    }
})();