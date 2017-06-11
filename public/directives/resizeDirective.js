(function() {

    angular
        .module('app')
        .directive('resizedirective', resizeDirective);

    function resizeDirective($window) {
  
        var directive = {
            link: link,
            restrict: 'A',
        };
        return directive;
        
        function link(scope, element, attrs) {
            scope.width = $window.innerWidth;
        
            function onResize(){ 
                if (scope.width !== $window.innerWidth)
                {
                    scope.width = $window.innerWidth;
                    scope.$digest();
                }
            };

            function cleanUp() {
                angular.element($window).off('resize', onResize);
            }

            angular.element($window).on('resize', onResize);
            scope.$on('$destroy', cleanUp);
        }
    }
 
})();