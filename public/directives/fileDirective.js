(function () {

    angular
        .module('app')
        .directive('filedirective', fileDirective);

    
    /**
     * @method fileDirective
     * @memberof directives
     * @description
     * Directiva que recoge la imagen y ejecuta una funcion para trabajar la imagen
     */
    function fileDirective() {
        return {
            
            restrict: 'A', //atributo
            scope: {
                file: '=' //nombre del atributo '='significa q tenga el mismo
            },
            link: function (scope, element, attrs) {
                element.bind('change', function (event) {//enlaza envento de cambio
                    var files = event.target.files;
                    var file = files[0]; 
                    scope.file(file)//ejecuta la funcion que haya pasado por parametro de atributo             
                    scope.$apply();
                     
                });
            }
        };
    }
})();
