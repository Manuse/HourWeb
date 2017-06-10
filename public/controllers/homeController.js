(function () {

    angular
        .module('app')
        .controller('HomeController', homeController);

    function homeController(userFactory, $timeout, DATABASE, $log) {
        var vm = this;


        /*Accordion*/
        vm.oneAtATime = true;
        vm.open = [];

        /**
         * Intervalo para recargar
         */
        var interval = function () {
            $timeout(recarga, 100);
        };
        interval();
        vm.lunes = [];
        vm.martes = [];
        vm.miercoles = [];
        vm.jueves = [];
        vm.viernes = [];
        vm.semana = 0;

        /**
         * Carga los datos de la vista
         */
        function recarga() {
            if (userFactory.getUser() != null) {
                $timeout(function () {
                    vm.getUser = userFactory.getUser;
                    vm.photo = userFactory.getPhoto;
                    recogerMisReservas();
                    recogerCentro();
                    cargarFecha();
                }, 0);
            } else {
                interval();
            }
        }

        /**
         * Refresa las listas y su encabezado
         */
        vm.refrecarCalendario = function () {
            recogerMisReservas();
            cargarFecha();
        };

        /**
         * Carga los datos del centro
         */
        function recogerCentro() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/nombre").once("value", function (snapshot) {
                $timeout(function () {
                    vm.centro = snapshot.val();
                }, 0);
            });
        }

        /**
         * Carga una fecha segun la semana seleccionada
         */
        function cargarFecha() {
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
         * Carga mis reservas
         */
        function recogerMisReservas() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").orderByChild("usuario").equalTo(vm.getUser().id).once("value", function (snapshot) {
                var reser = snapshot.val();
                vm.lunes = [];
                vm.martes = [];
                vm.miercoles = [];
                vm.jueves = [];
                vm.viernes = [];
                var semana1 = new Date(new Date().getTime() - (86400000 * (new Date().getDay() - 1)));
                var fsemana1 = new Date(semana1.getTime() + (6 * 86400000));
                semana1.setHours(0, 0, 0);
                fsemana1.setHours(0, 0, 0);
                if (vm.semana == 1) {
                    semana1.setTime(semana1.getTime() + (8 * 86400000));
                    fsemana1.setTime(fsemana1.getTime() + (8 * 86400000));
                }
                $log.log(semana1)
                $log.log(fsemana1)
                $timeout(function () {
                    for (var data in reser) {
                        if (reser[data].fecha < new Date("1/1/2999")) {
                            var date = new Date(reser[data].fecha);
                            if (semana1 < date && date < fsemana1) {
                                var activ = true;
                                var actu = false;
                                if (new Date() > date) {
                                    activ = false;
                                }
                                if (date < new Date() && date >= new Date() - 3600000) {
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
         * Borra una reserva
         * @param reserva objeto reserva
         * @param array array en el que esta el objeto
         */
        vm.borrarReserva = function (reserva, array) {
            if (reserva.activo) {
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
        };

        //CAMBIAR
        function rellenarTablaHorarios() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/rango_horas").once("value", function (horas) {
                DATABASE.ref("horarios/").orderByChild("usuario").equalTo(vm.getUser().id).once("value", function (snapshot) {
                    vm.filas = [];
                    var data = snapshot.val();
                    var hora = horas.val();
                    for (var i = 1; i <= hora; i++) {
                        for (var j = 1; j <= 5; j++) {
                            var horario = {
                                dia: j,
                                hora: i
                            };
                            for (var data1 in data) {
                                if (data[data1].hora==i && data[data1].dia==j){
                                    horario.curso=data[data1].curso;
                                    horario.usuario=data[data1].usuario;
                                    break;
                                }
                            }
                            vm.filas.push(horario);
                        }
                    }
                });
            });
        }
    }
})();