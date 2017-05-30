(function () {

    angular
        .module('app')
        .factory('errorFactory', errorFactory);

    function errorFactory() {

        var factory = {
            getError: function (error) {

                switch (error.code == null ? error : error.code) {
                    case "auth/invalid-email":
                        return "El email no es válido";
                    case "auth/user-not-found":
                        return "El email o la contraseña no son válidos";
                    case "auth/wrong-password":
                        return "El email o la contraseña no son válidos";
                    case "campoVacio":
                        return "No puede haber campos vacios";
                    case "contraseñaDistinta":
                        return "Las contraseñas no son iguales iguales";
                    case "errorHoraRegistro":
                        return "El inicio debe ser menor que el final y haber un minimo de 2 horas de diferencia";
                    case "centroInexistente":
                        return "El centro no existe";
                    case "nombre/apellido":
                        return "El nombre y el apellidos son obligatorios";
                    case "noRecurso":
                        return "El recurso ya existe";
                    case "noTipo":
                        return "El tipo ya existe";
                    default:
                        return "Ha ocurrido un error";
                }
            }
        }
        return factory;
    }
})();
