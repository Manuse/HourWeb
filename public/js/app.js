(function () {
    angular.module('app', ['ngAnimate', 'ngSanitize', 'ui.router', 'ui.bootstrap']).config(function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise("login");

            $stateProvider.state("login", {
                    url: "/login",
                    templateUrl: "templates/login.html",
                    controller: 'LoginController',
                    controllerAs: "vm"
                })
                .state("normal", {
                    url: "/principal",
                    templateUrl: "templates/principal.html",
                })
                .state("normal.home", {
                    url: "/home",
                    templateUrl: "templates/home.html",
                    controller: 'HomeController',
                    controllerAs: "vm"
                })
                .state("normal.reservar", {
                    url: "/reservar",
                    templateUrl: "templates/reservar.html",
                    controller: 'ReservarController',
                    controllerAs: "vm"
                })
                .state("normal.configuracion", {
                    url: "/perfil",
                    templateUrl: "templates/configuracion.html",
                    controller: 'ConfiguracionController',
                    controllerAs: "vm"
                })
                .state("normal.administrador", {
                    url: "/administrador",
                    templateUrl: "templates/administrador.html",
                    controller: 'AdministradorController',
                    controllerAs: "vm"
                });
        }).constant("DATABASE", firebase.database())
        .constant("AUTH", firebase.auth())
        .constant("STORAGE", firebase.storage().ref());
})();