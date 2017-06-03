(function () {


    angular
        .module('app')
        .factory('modalFactory', modalFactory);


    function modalFactory($uibModal) {
        var factory = {
            error: function (err) {
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'modal/mError.html',
                    controller: 'ErrorController',
                    controllerAs: 'vmmm',
                    resolve: {
                        item: function () {
                            return err;
                        }
                    }
                });

                modalInstance.result.then(function () {

                }, function () {

                });
            },
            confirmacion: function (msg, funcion) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'modal/mConfirmacion.html',
                    controller: 'ConfirmacionController',
                    controllerAs: 'vmmm',
                    resolve: {
                        item: function () {
                            return msg;
                        }
                    }
                });

                modalInstance.result.then(function (resul) {
                    if (resul) {
                        console.log(resul);
                        funcion();
                    }

                }, function () {

                });
            },
            progressBar:function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop:false,
                    keyboard:false,
                    templateUrl: 'modal/mProgressBar.html',
                    controller: 'ProgressBarController',
                    controllerAs: 'vmm',
                    
                });

                modalInstance.result.then(function () {

                }, function () {

                });
            },
        };

        return factory;

        ////////////////

    }
})();