(function () {

    angular
        .module('app')
        .filter('messageFilter', messageFilter);

    function messageFilter(userFactory) {
        return function (array, filtro) {
            switch (filtro) {
                case "todos":
                    return array.filter(function (el) {
                        return (el.destinatario == userFactory.getUser().codcentro || el.destinatario == userFactory.getUser().id
                         || el.cod_remitente == userFactory.getUser().id);
                    })
                case "enviados":
                    return array.filter(function (el) {
                        return el.cod_remitente == userFactory.getUser().id;
                    })

                case "recibidos":
                    return array.filter(function (el) {
                        return el.destinatario == userFactory.getUser().id;
                    })
            }
        }
    }
})();