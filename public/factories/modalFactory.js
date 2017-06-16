(function () {


    angular
        .module('app')
        .factory('modalFactory', modalFactory);

    
    /**
     * @namespace modalFactory
     * @description 
     * Factoria para abrir los distintos modales
     */
    function modalFactory($uibModal) {


        var factory = {
            /**
             * @method error 
             * @memberof modalFactory
             * @param {String} err mensaje de error
             * @param {any} not parametro que si se usa muestra una notificacion
             * @description
             * Abre el modal de error o notificacion
             */
            error: function (err, not) {
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'modal/mError.html',
                    controller: 'ErrorController',
                    controllerAs: 'vmmm',
                    // si <10 letras sm, en caso contrario md
                    size: err.length < 25 ? 'sm' : 'md',
                    resolve: {
                        item: function () {
                            return {
                                error: err,
                                tipo: not
                            };
                        }
                    }
                });

                modalInstance.result.then(function () {

                }, function () {

                });
            },
            /**
             * @method confirmacion 
             * @memberof modalFactory
             * @param {String} msg texto del modal
             * @param {function} funcion funcion que se ejecuta si la respuesta es 'si'
             * @description
             * Abre el modal de confirmacion
             */
            confirmacion: function (msg, funcion) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'modal/mConfirmacion.html',
                    controller: 'ConfirmacionController',
                    controllerAs: 'vmmm',
                    // si < 40 letras sm, en caso contrario md
                    size: msg.length < 40 ? 'sm' : 'md',
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
            /**
             * @method progressBar 
             * @memberof modalFactory
             * @description
             * Abre el modal de con la barra de progreso
             */
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
            /**
             * @method loginForm 
             * @memberof modalFactory
             * @description
             * Abre el modal de login
             */
            loginForm: function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'modal/mLoginForm.html',
                    controller: 'LoginFormController',
                    controllerAs: 'vmm',
                    size: 'sm'
                });

                modalInstance.result.then(function () {

                }, function () {

                });
            },
            /**
             * @method adminForm 
             * @memberof modalFactory
             * @description 
             * Abre el modal de registro como administrador
             */
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
            /**
             * @method standarForm 
             * @memberof modalFactory
             * @description
             * Abre el modal de registro de usuario normal
             */
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
            },
            /**
             * @method restablecerPass 
             * @memberof modalFactory
             * @description
             * Abre el modal de para restablecer la contraseña
             */
            restablecerPass: function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'modal/mRestablecerPass.html',
                    controller: 'RestablecerPassController',
                    controllerAs: 'vmm'
                });

                modalInstance.result.then(function () {

                }, function () {

                });
            }
        };
        return factory;
    }
})();