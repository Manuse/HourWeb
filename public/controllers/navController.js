(function () {

    angular.module('app').controller('NavController', navController);

    function navController(userFactory, AUTH, $timeout) {
        var vm = this;
        var interval = function () {
            $timeout(recarga, 100);
        };
        interval();
        vm.isNavCollapsed = true;

        vm.signOut = function () {
            AUTH.signOut();
        };

        function recarga() {
            if (userFactory.getUser() != null) {
                $timeout(function () {
                    vm.getUser = userFactory.getUser;
                    vm.photo = userFactory.getPhoto;
                }, 0);
            }else{
                interval();
            }
        }
    }
})();