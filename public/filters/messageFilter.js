(function () {

    angular
        .module('app')
        .filter('messageFilter', messageFilter);

    function messageFilter(userFactory) {
        return function (array, filtro, page) {
            switch (filtro) {
                case "todos":
                    if (page === undefined) {
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