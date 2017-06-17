(function () {

    angular
        .module('app')
        .factory('errorFactory', errorFactory);

    
    /**
     * @namespace errorFactory
     * @description
     * Factoria para compartir los distintos mensajes de error
     */

    /**
     * @method errorFactory
     * @memberof factories
     * @description
     * Factoria para compartir los distintos mensajes de error
     */
    function errorFactory() {

        var factory = {
            /**
             * @method getError 
             * @memberof errorFactory
             * @param {object|String} error error en texto y objeto
             * @description
             * Dependiendo del error devolvera un texto u otro
             */
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
                    case "debeRecurso":
                        return "Debe crear un recurso para poder asignar una reserva";
                    case "existeRP":
                        return "La reserva permanente ya existe";
                    case "noCurso":
                        return "El curso ya existe";
                    case "asuntoVacio":
                        return "El asunto no puede estar vacio";
                    case "textoVacio":
                        return "El texto no puede estar vacio";
                    case "sinTipo":
                        return "Minimo debe haber un tipo";
                    default:
                        return "Ha ocurrido un error";
                }
            }
        }
        return factory;
    }
})();