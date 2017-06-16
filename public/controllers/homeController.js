(function () {

    angular
        .module('app')
        .controller('HomeController', homeController);

    /**
     * @namespace homeController
     * @description 
     * Controlador de la vista home.html
     */
    function homeController(userFactory, $timeout, DATABASE, $log, errorFactory, modalFactory, $window) {
        var vm = this;
        vm.confirmacion = modalFactory.confirmacion;
        vm.error = modalFactory.error;
        /*Accordion*/
        vm.oneAtATime = true;
        vm.open = [];
        vm.filtro = "todos";
        vm.page=1;
        
        /*
         * Intervalo para recargar
         */
        var interval = function () {
            $timeout(recarga, 50);
        };
        interval();

        vm.lunes = [];
        vm.martes = [];
        vm.miercoles = [];
        vm.jueves = [];
        vm.viernes = [];
        vm.semana = 0;
        vm.mensajes = []

        /**
         * @method recarga 
         * @memberof homeController
         * @description
         * Carga los datos de la pagina cuando carga el usuario
         */
        function recarga() {
            if (userFactory.getUser() != null) {
                $timeout(function () {
                    vm.getUser = userFactory.getUser;
                    vm.photo = userFactory.getPhoto;
                    getMisReservas();
                    getCentro();
                    getFecha();
                    getMensajes();
                    getUsuarios();
                    getCursos();
                    rellenarTablaHorarios();
                }, 0);
            } else {
                interval();
            }
        }

        /**
         * @method refrescarCalendario 
         * @memberof homeController
         * @description
         * Refresa las listas y su encabezado
         */
        vm.refrescarCalendario = function () {
            getMisReservas();
            getFecha();
        };

        /**
         * @method getCentro 
         * @memberof homeController
         * @description
         * Carga el nombre del centro
         */
        function getCentro() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/nombre").once("value", function (snapshot) {
                $timeout(function () {
                    vm.centro = snapshot.val();
                }, 0);
            });
        }

        /**
         * @method getFecha 
         * @memberof homeController
         * @description
         * Carga una fecha segun la semana seleccionada
         */
        function getFecha() {
            var dia = new Date(new Date().getTime() - (86400000 * (new Date().getDay() - 1)));
            vm.dias = [];
            for (var j = 0; j < 5; j++) {
                dia.setTime(dia.getTime() + (j == 0 ? 0 : 86400000));
                if (vm.semana == 1 && j == 0) {
                    dia.setTime(dia.getTime() + (7 * 86400000));
                }
                vm.dias.push(new Date(dia));
            }
        }

        /**
         * @method getMisReservas 
         * @memberof homeController
         * @description
         * Carga mis reservas
         */
        function getMisReservas() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").orderByChild("usuario").equalTo(vm.getUser().id).once("value", function (snapshot) {
                var reser = snapshot.val();
                vm.lunes = [];
                vm.martes = [];
                vm.miercoles = [];
                vm.jueves = [];
                vm.viernes = [];
                var semana1 = new Date(new Date().getTime() - (86400000 * (new Date().getDay() - 1)));//se posiciona en el lunes
                var fsemana1 = new Date(semana1.getTime() + (6 * 86400000));//se posiciona el domingo
                semana1.setHours(0, 0, 0);
                fsemana1.setHours(0, 0, 0);
                if (vm.semana == 1) {//suma una semana si semana 2 esta seleccionada
                    semana1.setTime(semana1.getTime() + (8 * 86400000));
                    fsemana1.setTime(fsemana1.getTime() + (8 * 86400000));
                }
                $timeout(function () {
                    for (var data in reser) {
                        if (reser[data].fecha < new Date("1/1/2999")) {
                            var date = new Date(reser[data].fecha);
                            if (semana1 < date && date < fsemana1) {
                                var activ = true;
                                var actu = false;
                                if (new Date() > date) {//si es antiguo esta pasada
                                    activ = false;
                                }
                                if (date < new Date() && date >= new Date() - 3600000) {//si esta dentro del rango es actual
                                    actu = true;
                                }
                                var reserva = {
                                    code: data,
                                    recurso: reser[data].recurso,
                                    hora: (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() != 0 ? date.getMinutes() : date.getMinutes() + '0') + "-" + (new Date(date.getTime() + 3600000).getHours() < 10 ? '0' + new Date(date.getTime() + 3600000).getHours() : new Date(date.getTime() + 3600000).getHours()) + ':' + (date.getMinutes() != 0 ? date.getMinutes() : date.getMinutes() + '0'),
                                    fecha: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(),
                                    activo: activ,
                                    actual: actu,
                                    curso: reser[data].curso
                                };
                                switch (parseInt(date.getDay())) {
                                    case 1:
                                        vm.lunes.push(reserva);
                                        break;
                                    case 2:
                                        vm.martes.push(reserva);
                                        break;
                                    case 3:
                                        vm.miercoles.push(reserva);
                                        break;
                                    case 4:
                                        vm.jueves.push(reserva);
                                        break;
                                    case 5:
                                        vm.viernes.push(reserva);
                                        break;
                                }
                            }
                        } else {
                            var actu = false;
                            if (new Date().getHours() > new Date(reser[data].fecha).getHours() && new Date().getHours() - 1 < new Date(reser[data].fecha).getHours()) {
                                actu = true;
                            }
                            var date = new Date(reser[data].fecha);
                            var reserva = {
                                code: data,
                                recurso: reser[data].recurso,
                                hora: (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() != 0 ? date.getMinutes() : date.getMinutes() + '0') + "-" + (new Date(date.getTime() + 3600000).getHours() < 10 ? '0' + new Date(date.getTime() + 3600000).getHours() : new Date(date.getTime() + 3600000).getHours()) + ':' + (date.getMinutes() != 0 ? date.getMinutes() : date.getMinutes() + '0'),
                                fecha: "Permanente",
                                activo: true,
                                actual: actu,
                                perm: true,
                                curso: reser[data].curso
                            };
                            switch (parseInt(date.getDay())) {
                                case 1:
                                    vm.lunes.push(reserva);
                                    break;
                                case 2:
                                    vm.martes.push(reserva);
                                    break;
                                case 3:
                                    vm.miercoles.push(reserva);
                                    break;
                                case 4:
                                    vm.jueves.push(reserva);
                                    break;
                                case 5:
                                    vm.viernes.push(reserva);
                                    break;
                            }
                        }
                    }
                }, 0);
            });
        }

        /**
         * @method borrarReserva
         * @memberof homeController
         * @param {object} reserva objeto reserva
         * @param {array} array array en el que esta el objeto
         * @description
         * Borra una reserva
         */
        vm.borrarReserva = function (reserva, array) {
            if (reserva.activo) {
                funcion = function () {
                    var reser = DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/" + reserva.code);
                    reser.once("value", function (datos) {
                        var a = datos.val();
                        if (a.perm == null) { // si perm es null es porque no es permanente y se puede borrar
                            reser.remove().then(function () {
                                $timeout(function () {
                                    array.splice(array.indexOf(reserva), 1)
                                });
                            }, function (err) {});
                        } else {
                            vm.error("No puedes borrar las asignaciones permanentes");
                        }
                    });
                }
                vm.confirmacion("¿Desea borrar esta reserva?", funcion)
            }
        };

        /**
         * @method rellenarTablaHorarios 
         * @memberof homeController
         * @description
         * Rellena la tabla de horarios
         */
        function rellenarTablaHorarios() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/rango_horas").once("value", function (horas) {
                DATABASE.ref("horarios/").orderByChild("usuario").equalTo(vm.getUser().id).once("value", function (snapshot) {
                    $timeout(function () {
                        vm.horarios = [];
                        var data = snapshot.val();
                        var hora = horas.val();
                        for (var i = 1; i <= hora; i++) {//horas
                            var fila = {
                                num: i
                            }
                            for (var j = 1; j <= 5; j++) {//dias
                                var horario = {
                                    dia: j,
                                    hora: i,
                                    curso: null,
                                    usuario: vm.getUser().id
                                };
                                for (var data1 in data) {
                                    if (data[data1].hora == i && data[data1].dia == j) {//si hay una reserva cambia los datos
                                        horario.curso = data[data1].curso;
                                        horario.code = data1;
                                        break;
                                    }
                                }
                                switch (j) {
                                    case 1:
                                        fila.lunes = horario;
                                        break;
                                    case 2:
                                        fila.martes = horario;
                                        break;
                                    case 3:
                                        fila.miercoles = horario;
                                        break;
                                    case 4:
                                        fila.jueves = horario;
                                        break;
                                    case 5:
                                        fila.viernes = horario;
                                        break;
                                }
                            }
                            vm.horarios.push(fila);
                        }
                    }, 0)
                });
            });
        }

        /**
         * @method getCursos 
         * @memberof homeController
         * @description
         * Carga los cursos
         */
        function getCursos() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/cursos").once("value", function (snapshot) {
                vm.cursos = snapshot.val().map(function (key) {
                    return {
                        label: key,
                        value: key
                    };
                })
                try {
                    vm.cursos.unshift({
                        label: "Seleccione un curso",
                        value: null
                    });
                } catch (err) {}
            });
        }

        /**
         * @method crearHorario 
         * @memberof homeController
         * @param {object} fila dia de la semana de una fila
         * @description
         * Crea un horario lo remueve o lo actualiza
         */
        vm.crearHorario = function (fila) {
            if (fila.curso == null && fila.code != null) {
                DATABASE.ref("horarios/" + fila.code).remove();
                fila.code = null;
            } else if (fila.curso != null && fila.code != null) {
                DATABASE.ref("horarios/" + fila.code).update({
                    curso: fila.curso
                })
            } else if (fila.curso != null && fila.code == null) {
                fila.code = DATABASE.ref("horarios/").push({
                    dia: fila.dia,
                    hora: fila.hora,
                    curso: fila.curso,
                    usuario: fila.usuario
                }).key;
            }
        };

        /**
         * @method getMensajes 
         * @memberof homeController
         * @description
         * Carga los mensajes
         */
        function getMensajes() {
            DATABASE.ref("mensajes/").orderByChild("codcentro").equalTo(vm.getUser().codcentro).limitToLast(70).on("value", function (snapshot) {
                $timeout(function () {
                    try{
                    vm.mensajes = Object.keys(snapshot.val()).map(function (key) {
                        return {
                            code: key,
                            texto: snapshot.val()[key].texto,
                            asunto: snapshot.val()[key].asunto,
                            remitente: snapshot.val()[key].remitente,
                            cod_remitente: snapshot.val()[key].cod_remitente,
                            fecha: new Date(snapshot.val()[key].fecha),
                            codcentro: snapshot.val()[key].codcentro,
                            destinatario: snapshot.val()[key].destinatario
                        };
                    }).reverse();
                    }catch(err){}
                }, 0)
            });
        }

        /**
         * @method nuevoMensaje 
         * @memberof homeController
         * @description
         * Crea un nuevo mensaje
         */
        vm.nuevoMensaje = function () {
            if (vm.asunto != 0 && vm.asunto != null) {
                if (vm.texto != 0 && vm.texto != null) {
                    var mensaje = {
                        texto: vm.texto,
                        asunto: vm.asunto,
                        remitente: vm.getUser().nombre + " " + vm.getUser().apellido,
                        cod_remitente: vm.getUser().id,
                        codcentro: vm.getUser().codcentro,
                        fecha: new Date().getTime(),
                        destinatario: vm.destinatario
                    }
                    mensaje.code = DATABASE.ref("mensajes/").push(mensaje).key;
                    mensaje.fecha = new Date(mensaje.fecha);
                    vm.texto = "";
                    vm.asunto = "";
                } else {
                    vm.error(errorFactory.getError("textoVacio"));
                }
            } else {
                vm.error(errorFactory.getError("asuntoVacio"));
            }
        }

        /**
         * @method borrarMensaje 
         * @memberof homeController
         * @param {object} mensaje mensaje 
         * @description
         * Borra un mensaje
         */
        vm.borrarMensaje = function (mensaje) {
            funcion = function () {
                DATABASE.ref("mensajes/" + mensaje.code).remove();
            }
            vm.confirmacion("¿Borrar este mensaje?", funcion);
        }

        /**
         * @method getUsuarios 
         * @memberof homeController
         * @description
         * Carga los usuarios
         */
        function getUsuarios() {
            DATABASE.ref("user/").orderByChild("codcentro").equalTo(vm.getUser().codcentro).once("value", function (snapshot) {
                $timeout(function () {
                    vm.usuarios = Object.keys(snapshot.val()).map(function (key) {
                        return {
                            id: snapshot.val()[key].id,
                            nombre: snapshot.val()[key].nombre + ' ' + snapshot.val()[key].apellido,
                            verificado: snapshot.val()[key].verificado
                        };
                    });
                    vm.usuarios.unshift({
                        id: vm.getUser().codcentro,
                        nombre: "Todos",
                        verificado: true
                    });
                    vm.destinatario = vm.usuarios[0].id;
                }, 0);
            });
        }
    }
})();