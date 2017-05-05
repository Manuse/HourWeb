(function () {
    angular.module('app', ['ngAnimate', 'ngSanitize', 'ui.router', 'ui.bootstrap']).config(function ($stateProvider, $urlRouterProvider) {

        //$urlRouterProvider.otherwise("/home");
        
            $stateProvider.state("home", {
                    url: "/home",
                    templateUrl: "templates/home.html",
                    controller: 'HomeController',
                    controllerAs: "vm"
                })
                .state("reservar", {
                    url: "/reservar",
                    templateUrl: "templates/reservar.html",
                    controller: 'ReservarController',
                    controllerAs: "vm"
                }).state("configuracion", {
                    url: "/configuracion",
                    templateUrl: "templates/configuracion.html",
                    //controller:'Controller',
                    //controllerAs:"ctrl"
                }).state("administrador", {
                    url: "/administrador",
                    templateUrl: "templates/administrador.html",
                    //controller:'Controller',
                    //controllerAs:"ctrl"
                });
        }).constant("DATABASE", firebase.database())
        .constant("AUTH", firebase.auth())
        .constant("STORAGE", firebase.storage().ref());
})();