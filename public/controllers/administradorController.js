(function () {

    angular
        .module('app')
        .controller('AdministradorController', administradorController);

    function administradorController($scope, $log) {
        var vm = this;



        // Timepicker reservas permanentes
        vm.mytime = new Date();

        vm.hstep = 1;
        vm.mstep = 15;

        vm.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        vm.ismeridian = true;
        vm.toggleMode = function () {
            vm.ismeridian = !vm.ismeridian;
        };

        vm.update = function () {
            var d = new Date();
            d.setHours(14);
            d.setMinutes(0);
            vm.mytime = d;
        };

        vm.clear = function () {
            vm.mytime = null;
        };


        //Accordion
        $scope.oneAtATime = true;

        $scope.groups = [
            {
                title: 'Dynamic Group Header - 1',
                content: 'Dynamic Group Body - 1'
    },
            {
                title: 'Dynamic Group Header - 2',
                content: 'Dynamic Group Body - 2'
    }
  ];

        $scope.items = ['Item 1', 'Item 2', 'Item 3'];

        $scope.addItem = function () {
            var newItemNo = $scope.items.length + 1;
            $scope.items.push('Item ' + newItemNo);
        };

        $scope.status = {
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
        };




    }

})();
