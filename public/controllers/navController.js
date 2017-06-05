(function () {

    angular.module('app').controller('NavController', navController);

    function navController(userFactory, AUTH, $timeout, $location, $log) {
        var vm = this;
        var interval = function () {
            $timeout(recarga, 50);
        };
        interval();
        vm.isNavCollapsed = true;


        $timeout(function () {
            if (AUTH.currentUser == null) {
                $location.path("/login");
            }
        }, 350);

        vm.signOut = function () {
            AUTH.signOut();
        };

        function recarga() {
            if (userFactory.getUser() != null) {
                $timeout(function () {
                    vm.getUser = userFactory.getUser;
                    vm.photo = userFactory.getPhoto;
                }, 0);
            } else {
                interval();
            }
        }
    }
})();