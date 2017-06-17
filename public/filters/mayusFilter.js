(function () {


    angular
        .module('app')
        .filter('mayus', mayusFilter);

    
    /**
     * @method mayusFilter
     * @memberof filters
     * @description
     * Pone en mayuscula la primera letra del texto
     */
    function mayusFilter() {
        return function (text) {
            if (text != null) {
                var i=0;
                while(i < text.length){
                    if(text.substring(i, i+1) != ' ' && text.substring(i, i+1) != '\xa0'){
                      return text.substring(0, i+1).toUpperCase() + text.substring(i+1);
                    }
                    i++;
                }
            }
        }
    }
})();