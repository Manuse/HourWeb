(function () {


    angular
        .module('app')
        .filter('mayus', mayusFilter);

    function mayusFilter() {
        return function (text) {
            if (text != null) {
                return text.substring(0, 1).toUpperCase() + text.substring(1);
            }
        }
    }
})();