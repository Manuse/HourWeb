(function () {

    angular
        .module('app')
        .controller('ReservarController', reservarController);

    /* primer select de pruebaReservas.html*/
    function reservarController(userFactory, DATABASE, $timeout, $log, modalFactory, progressBarFactory, $location) {
        var vm = this;
        var interval = function () {
            $timeout(recarga, 100);
        };
        interval();
        vm.progress = modalFactory.progressBar;
        vm.recursos = [];
        vm.tabla = [];
        vm.tipos = [];
        vm.semana = '0';
        vm.cursos = [];
        var q;

        /*
        carga datos cuando carga al usuario
        */
        function recarga() {
            if (userFactory.getUser() != null) {
                $timeout(function () {
                    vm.getUser = userFactory.getUser;
                    if(vm.getUser().baneo){
                        $location.path("/home/principal");
                    }
                    vm.cargarFechaRecursos();
                    cargarTipos();
                    cargarCursos();
                }, 0);
            } else {
                interval();
            }
        }

        function cargarCursos() {
            DATABASE.ref("horarios/").orderByChild("usuario").equalTo(vm.getUser().id).once("value", function (snapshot) {
                vm.cursos = Object.keys(snapshot.val()).map(function (key) {
                        return snapshot.val()[key].curso;
                    }).filter(function (value, index, array) {
                        return array.indexOf(value) === index;
                    }).sort().map(function (val) {
                        return {
                            value: val,
                            label: val
                        };
                    })
                    vm.cursos.unshift({
                        value: null,
                        label: "Seleccione un curso(Opcional)"
                    });
                    $log.log(vm.cursos)
                vm.curso = vm.cursos[0].value;
            });
        }

        /* carga los dias de la semana en el home y en reservar.html */
        /**
         * Carga la fecha
         */
        function cargarFecha() {
            var dia = new Date(new Date().getTime() - (82800000 * (new Date().getDay() - 1)));
            vm.dias = [];
            for (var j = 0; j < 5; j++) {
                dia.setTime(dia.getTime() + (j == 0 ? 0 : 82800000));
                if (vm.semana == 1 && j == 0) {
                    dia.setTime(dia.getTime() + (7 * 82800000));
                }
                vm.dias.push(new Date(dia));
            }
        }

        /**
         * Carga la fecha y luego los recursos
         */
        vm.cargarFechaRecursos = function () {
            cargarFecha();
            if (vm.recurso != null)
                vm.cargarDisponible();
        }

        vm.hacerReserva = function (celda, ncelda) {
            var reserva = {
                nombre: vm.getUser().nombre + ' ' + vm.getUser().apellido,
                curso: vm.curso == null ? '' : vm.curso,
                fecha: celda.fecha.getTime(),
                recurso: vm.recurso,
                usuario: vm.getUser().id
            };
            if (celda.activo && ncelda == null || ncelda.activo && celda.activo) {
                DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").push(reserva);
                vm.progress();
                progressBarFactory.initProgress();
            }
        };

        /* select de pruebaReservas.html que se carga al seleccionar opcion del select anterior */
        vm.cargarRecursos = function () {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/recursos/").orderByChild("tipo").equalTo(vm.tipo).on("value", function (snapshot) {
                vm.tabla = [];
                $timeout(function () {
                    if (snapshot.exists()) {
                        vm.recursos = Object.keys(snapshot.val()).map(function (key) {
                            return {
                                name: key,
                                value: key
                            };
                        });
                        vm.recursos.unshift({
                            name: 'Indique el recurso a consultar',
                            value: null
                        })
                        try {
                            vm.recurso = vm.recursos[0].value;
                        } catch (err) {}
                    } else {
                        vm.recursos = [];
                    }
                }, 0);
            });
        };

        /*
         * Carga los tipos
         */
        function cargarTipos() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/tipos").once("value", function (snapshot) {
                $timeout(function () {
                    vm.tipos = snapshot.val();
                    vm.tipos.unshift('Seleccione un recurso');
                    vm.tipo = vm.tipos[0];
                }, 0);
            });
        }

        /* carga recursos disponibles en la tabla de pruebaReservas.html*/
        vm.cargarDisponible = function () {
            try {
                q.off()
            } catch (err) {}
            q = DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").orderByChild("recurso").equalTo(vm.recurso);
            if (vm.recurso == null) {
                vm.tabla = [];
            } else {
                q.on("value", function (snapshot) {
                    var reservas = snapshot.val();
                    DATABASE.ref("centros/" + vm.getUser().codcentro + "/horas").once("value", function (hor) {
                        var horas = hor.val().split("-");
                        progressBarFactory.setProgress(20);
                        $timeout(function () {
                            vm.tabla = [];
                            for (var i = new Date('1/1/1 ' + horas[0]).getTime(); i < new Date('1/1/1 ' + horas[1]); i += 1800000) { //fila
                                var fila = {};
                                fila.hora = new Date(i).getHours() + ':' + (new Date(i).getMinutes() != 0 ? new Date(i).getMinutes() : new Date(i).getMinutes() + '0') + ' - ' + new Date(i + 1800000).getHours() + ':' + (new Date(i + 1800000).getMinutes() != 0 ? new Date(i + 1800000).getMinutes() : new Date(i + 1800000).getMinutes() + '0');
                                progressBarFactory.setProgress(20);
                                for (var j = 0; j < 5; j++) { //columnas
                                    vm.dias[j].setHours(new Date(i).getHours(), new Date(i).getMinutes(), 0);
                                    var celda = {};
                                    celda.activo = true;
                                    celda.fecha = new Date(vm.dias[j]);
                                    if (vm.dias[j] < new Date()) {
                                        celda.activo = false;
                                    }
                                    for (var data in reservas) {
                                        if (reservas[data].perm && new Date(reservas[data].fecha).getDay() == vm.dias[j].getDay()) {
                                            var nf = new Date(vm.dias[j]);
                                            reservas[data].fecha = nf.setHours(new Date(reservas[data].fecha).getHours(), new Date(reservas[data].fecha).getMinutes(), 0);
                                        }
                                        if (vm.dias[j] - new Date(reservas[data].fecha) < 3500000 && vm.dias[j] - new Date(reservas[data].fecha) >= -60000) {
                                            celda.activo = false;
                                            celda.nombre = reservas[data].nombre;
                                            celda.curso = reservas[data].curso;
                                        }
                                    }
                                    if (progressBarFactory.getProgress() < 90) {
                                        progressBarFactory.sumProgress(5);
                                    }
                                    switch (j) {
                                        case 0:
                                            fila.lunes = celda;
                                            break;
                                        case 1:
                                            fila.martes = celda;
                                            break;
                                        case 2:
                                            fila.miercoles = celda;
                                            break;
                                        case 3:
                                            fila.jueves = celda;
                                            break;
                                        case 4:
                                            fila.viernes = celda;
                                            break;
                                    }

                                }
                                vm.tabla.push(fila);
                            }
                            progressBarFactory.setProgress(100);
                        }, 0);
                    });
                });
            }
        }

    }
})();