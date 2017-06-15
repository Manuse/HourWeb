(function() {

    angular
        .module('app')
        .directive('resizedirective', resizeDirective);

    //directiva con evento para cuando se modifique el ancho
    function resizeDirective($window) {
  
        var directive = {
            link: link,
            restrict: 'A',
        };
        return directive;
        
        function link(scope, element, attrs) {
            scope.width = $window.innerWidth;//ancho
        
            function onResize(){ 
                if (scope.width !== $window.innerWidth)
                {
                    scope.width = $window.innerWidth;
                    scope.$digest();
                }
            };

            function cleanUp() {
                angular.element($window).off('resize', onResize);//quita el evento
            }

            angular.element($window).on('resize', onResize);//evento
            scope.$on('$destroy', cleanUp);
        }
    }
 
})();