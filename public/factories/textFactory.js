(function () {

    angular
        .module('app')
        .factory('textFactory', textFactory);

    
    /**
     * @namespace textFactory
     * @description
     * Factoria para compartir los distintos mensajes 
     */

    /**
     * @method textFactory
     * @memberof factories
     * @description
     * Factoria para compartir los distintos mensajes
     */
    function textFactory() {

        var factory = {
            /**
             * @method getError 
             * @memberof textFactory
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
                        return "No pueden existir campos vacios";
                    case "contraseñaDistinta":
                        return "Las contraseñas NO son iguales";
                    case "errorHoraRegistro":
                        return "La hora de inicio debe ser menor que la final. Debe haber al menos 2 horas de diferencia entre ambas";
                    case "centroInexistente":
                        return "El centro introducido no existe";
                    case "nombre/apellido":
                        return "El nombre y apellidos son obligatorios";
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
                    case "borrarPermanente":
                        return "No puedes borrar las asignaciones permanentes";
                    default:
                        return "Ha ocurrido un error";
                }
            },
            /**
             * @method getAviso
             * @memberof textFactory
             * @param {String} text texto identificativo
             * @param {object|String} item object o string con informacion adicional
             * @description
             * Dependiendo del texto devolvera un texto u otro
             */
            getAviso:function(text, item){
                switch (text) {
                    case "verificacion":
                        return "Se ha enviado un email de verificacion a su correo";;               
                    case "borrarTipo":
                        return "¿Borrar este tipo?";
                    case "borrarRecurso":
                        return "¿Borrar el recurso " + item + "?";
                    case "hacerRP":
                        return "Se borraran todas las reservas normales que coincidan con esta reserva ¿Está seguro?";
                    case "borrarCurso":
                        return "¿Borrar el curso " + item + "? eso también borrará el curso de las reservas y de los horarios";
                    case "borrarRP":
                        return "¿Borrar esta reserva permanente?";
                    case "centroCambiado":
                        return "Nombre del centro cambiado";
                    case "cambiarHora":
                        return "Se borraran los horarios y reservas fuera del horario¿Esta seguro?";
                    case "passCambiada":
                        return "Contraseña cambiada";
                    case "updateDatos":
                        return "Se han actualizado sus datos";
                    case "cambioCentro1":
                        return "Si cambia de centro se borraran sus reservas, su calendario de horarios y no podra ver los mensajes del antiguo centro ¿Esta usted seguro?";
                    case "cambioCentro2":
                        return "Usted es el unico miembro asi que se borrara el centro y su calendario de horarios ¿Esta usted seguro?";
                    case "borrarReserva":
                        return "¿Desea borrar esta reserva?";
                    default:
                        return "¡¡Aviso!!"
                }
            }
        }
        return factory;
    }
})();