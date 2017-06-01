(function () {

    angular
        .module('app')
        .directive('filedirective', fileDirective);

    function fileDirective() {
        return {
            
            restrict: 'A', 
            scope: {
                file: '='
            },
            link: function (scope, element, attrs) {
                element.bind('change', function (event) {
                    console.log("pene")
                    var files = event.target.files;
                    var file = files[0];
                    //scope.file = file ? file.name : undefined; 
                    scope.file(file)                
                    scope.$apply();
                     
                });
            }
        };
    }
})();