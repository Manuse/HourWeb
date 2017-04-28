(function() {
    angular.module('app', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'ngSanitize']).config(function($stateProvider, $urlRouterProvider){
       
        $stateProvider.state("home",{
            url:"/home", 
        templateUrl:"templates/home.html",
        controller:'HomeController',
        controllerAs:"vm"
    })
    .state("reservar",{
        url:"/reservar",
        templateUrl:"templates/reservar.html"
        //controller:'Controller',
        //controllerAs:"ctrl"
    }).state("configuracion",{
            url:"/configuracion", 
        templateUrl:"templates/configuracion.html",
        //controller:'Controller',
        //controllerAs:"ctrl"
    }).state("administrador",{
            url:"/administrador", 
        templateUrl:"templates/administrador.html",
        //controller:'Controller',
        //controllerAs:"ctrl"
    });
    }).constant("DATABASE", firebase.database())
    .constant("AUTH", firebase.auth())
    .constant("STORAGE", firebase.storage().ref());
})();