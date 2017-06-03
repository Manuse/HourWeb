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
                        return "El email o la contraseña no son correctos";
                    case "auth/wrong-password":
                        return "La contraseña no es correcta";
                    case "campoVacio":
                        return "No puede haber campos vacios";
                    case "contraseñaDistinta":
                        return "Las contraseñas no son iguales";
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
                    case "bigImg":
                        return "La imagen no puede pesar mas de 300 Kb";
                    case "telefono/largo":
                        return "El telefono es demasiado largo";
                    case "telefono/formato":
                        return "El telefono no tiene el formato correcto";
                    case "cambioCentro":
                        return "El centro nuevo no existe o ya perteneces a ese centro";
                    default:
                        return "Ha ocurrido un error";
                }
            }
        }
        return factory;
    }
})();