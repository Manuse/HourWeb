(function () {

    angular
        .module('app')
        .filter('buscarRPFilter', buscarRPFilter);

    
    /**
     * @method buscarRPFilter
     * @memberof filters
     * @description
     * Filtra las reservas permanentes por nombre, recurso y dia
     * recibe por argumento en interfaz el texto de filtro
     */
    function buscarRPFilter() {
        return function (value, item) {
            if(item != null && item != 0)
            item=item.toLowerCase();
            var result = [];
            if (value.length > 0) {
                for (var i = 0; i < value.length; i++) {
                    if (value[i].nombre.toLowerCase().includes(item) || value[i].recurso.toLowerCase().includes(item) || value[i].dia.toLowerCase().includes(item)) {
                        result.push(value[i]);
                    }
                }
                return result;
            }
        };

    }
})();