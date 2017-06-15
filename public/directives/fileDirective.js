(function () {

    angular
        .module('app')
        .directive('filedirective', fileDirective);

    //directiva que recoge la imagen
    function fileDirective() {
        return {
            
            restrict: 'A', //atributo
            scope: {
                file: '=' //nombre del atributo '='significa q tenga el mismo
            },
            link: function (scope, element, attrs) {
                element.bind('change', function (event) {
                    var files = event.target.files;
                    var file = files[0];
                    //scope.file = file ? file.name : undefined; 
                    scope.file(file)//ejecuta la funcion que haya pasado por parametro de atributo             
                    scope.$apply();
                     
                });
            }
        };
    }
})();
