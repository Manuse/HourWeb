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
                    // si >10 letras sm, en caso contrario md
                    size: err.length > 10 ? 'sm':'md',
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
                    // si < 40 letras sm, en caso contrario md
                    size: msg.length < 40 ? 'sm':'md',
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
            // barra de progreso mientras se carga la nueva foto en configuracion.html
            progressBar: function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: false,
                    keyboard: false,
                    templateUrl: 'modal/mProgressBar.html',
                    controller: 'ProgressBarController',
                    controllerAs: 'vmm',

                });

                modalInstance.result.then(function () {

                }, function () {

                });
            },
            loginForm: function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'modal/mLoginForm.html',
                    controller: 'LoginFormController',
                    controllerAs: 'vmm',
                    size:'sm'
                });

                modalInstance.result.then(function () {

                }, function () {

                });
            },
            adminForm: function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'modal/mAdminForm.html',
                    controller: 'AdminFormController',
                    controllerAs: 'vmm'
                });

                modalInstance.result.then(function () {

                }, function () {

                });
            },
            standarForm: function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'modal/mStandarForm.html',
                    controller: 'StandarFormController',
                    controllerAs: 'vmm'
                });

                modalInstance.result.then(function () {

                }, function () {

                });
            }
        };

        return factory;

        ////////////////

    }
})();