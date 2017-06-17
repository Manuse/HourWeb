(function () {

    angular
        .module('app')
        .filter('messageFilter', messageFilter);
    
    //filtro para los mensajes segun si son todos, los enviados o recibidos
    /**
     * @method messageFilter
     * @memberof filters
     * @param {object} userFactory factoria con los datos del usuario 
     * @description
     * Filtro para los mensajes segun si son todos, los enviados o recibidos
     * los argumentos que recibe son el filtro y pagina
     */
    function messageFilter(userFactory) {
        return function (array, filtro, page) {
            switch (filtro) {//dependiendo del caso mostrara unos mensajes u otros
                case "todos":
                    if (page === undefined) {//si page es indefinido me devuelve el length 
                        return array.filter(function (el) {
                            return (el.destinatario == userFactory.getUser().codcentro || el.destinatario == userFactory.getUser().id ||
                                el.cod_remitente == userFactory.getUser().id);
                        }).length;
                    }
                    return array.filter(function (el) {
                        return (el.destinatario == userFactory.getUser().codcentro || el.destinatario == userFactory.getUser().id ||
                            el.cod_remitente == userFactory.getUser().id);
                    }).slice(((page - 1) * 10), ((page) * 10));
                case "enviados":
                    if (page === undefined) {
                        return array.filter(function (el) {
                            return el.cod_remitente == userFactory.getUser().id;
                        }).length;
                    }
                    return array.filter(function (el) {
                        return el.cod_remitente == userFactory.getUser().id;
                    }).slice(((page - 1) * 10), ((page) * 10));

                case "recibidos":
                    if (page === undefined) {
                        return array.filter(function (el) {
                            return el.destinatario == userFactory.getUser().id;
                        }).length;
                    }
                    return array.filter(function (el) {
                        return el.destinatario == userFactory.getUser().id;
                    }).slice(((page - 1) * 10), ((page) * 10));
            }
        }
    }
})();