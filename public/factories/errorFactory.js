(function () {

    angular
        .module('app')
        .factory('errorFactory', errorFactory);

    function errorFactory() {

        var factory = {
            getError: function (error) {
                switch (error.code) {
                    case "auth/invalid-email":
                        return "El email no es válido";
                    case "auth/user-not-found":
                        return "El email o la contraseña no son válidos";
                    case "auth/wrong-password":
                        return "El email o la contraseña no son válidos";
                    case "campoVacio":
                        return "No puede haber campos vacios";
                    case "contraseñaDistinta":
                        return "Las contraseñas deben ser iguales"
                    default:
                        return "Ha ocurrido un error";
                }
            }
        }
        return factory;

    }
})();