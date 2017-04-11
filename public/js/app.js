(function() {
    angular.module('app', ['ui.router', 'ui.bootstrap']).config(function($stateProvider, $urlRouterProvider){

    }).constant("DATABASE", firebase.database())
    .constant("AUTH", firebase.auth())
    .constant("STORAGE", firebase.storage().ref());
})();