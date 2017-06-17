(function () {
    /** @namespace controllers*/
    /** @namespace factories*/
    /** @namespace directives*/
    /** @namespace filters */
    /**
     * @module app
     * @requires ngAnimate
     * @requires ngSabitize 
     * @requires ui.router 
     * @requires ui.bootstrap  
     * @description
     * Modulo de angular unico para toda la aplicacion, usa los modulos ui.router para hacer el cambio de vistas,
     * ui.boostrap para componentes compatibles de angular y ngAnimate y ngSanitize que son utilizados por ui.boostrap
     * para animaciones
     */
    angular.module('app', ['ngAnimate', 'ngSanitize', 'ui.router', 'ui.bootstrap']).config(function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise("login");//la primera vista que carga es el login

            $stateProvider.state("login", {//declaracion de las distintas vistas con la url que tendran, su template,
                    url: "/login",         //controlador y alias del controlador
                    templateUrl: "templates/login.html",
                    controller: 'LoginController',
                    controllerAs: "vm"
                })
                .state("normal", {
                    url: "/principal",
                    templateUrl: "templates/principal.html",
                })
                .state("normal.home", {//subvista de normal
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
        }).constant("DATABASE", firebase.database())//constantes de firebase
        .constant("AUTH", firebase.auth())
        .constant("STORAGE", firebase.storage().ref());
})();