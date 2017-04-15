(function() {
    angular.module('app', ['ui.router', 'ui.bootstrap']).config(function($stateProvider, $urlRouterProvider){
       
        $stateProvider.state("home",{
            url:"/home", 
        templateUrl:"templates/home.html",
        //controller:'Controller',
        //controllerAs:"ctrl"
    })
    .state("reservar",{
        url:"/reservar",
        templateUrl:"templates/reservar.html"
    });
    }).constant("DATABASE", firebase.database())
    .constant("AUTH", firebase.auth())
    .constant("STORAGE", firebase.storage().ref());
})();