(function () {

    angular.module('app').controller('NavController', navController);

    function navController(userFactory, AUTH, $timeout, $scope) {
        var vm = this;
        var interval = function () {
            $timeout(recarga, 100);
        };
        interval();
        vm.isNavCollapsed = true;

        vm.signOut = function () {
            AUTH.signOut();
        };

        /*vm.getUser = userFactory.getUser();
        vm.photo = userFactory.getPhoto();*/

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
       /* $scope.$watch(function () {
            return userFactory.getUser();
        }, function (value) {
            vm.getUser = value;
        });
         $scope.$watch(function () {
            return userFactory.getPhoto();
        }, function (value) {
            vm.photo = value;
        });*/
    }
})();