(function () {

    angular
        .module('app')
        .controller('ReservarController', reservarController);


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

        /**
         * @method recarga carga datos cuando carga al usuario
         */
        function recarga() {
            if (userFactory.getUser() != null) {
                $timeout(function () {
                    vm.getUser = userFactory.getUser;
                    if(vm.getUser().baneo){
                        $location.path("/principal/home");
                    }
                    vm.getFechaRecursos();
                    getTipos();
                    getCursos();
                }, 0);
            } else {
                interval();
            }
        }

        /**
         * @method getCursos Carga los cursos y los mete en un array
         */
        function getCursos() {
            DATABASE.ref("horarios/").orderByChild("usuario").equalTo(vm.getUser().id).once("value", function (snapshot) {
                try{
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
                vm.curso = vm.cursos[0].value;
                }catch(err){}
            });
        }

        /* carga los dias de la semana en reservar.html */
        /**
         * @method getFecha Carga la fecha en un array
         */
        function getFecha() {
            var dia = new Date(new Date().getTime() - (86400000 * (new Date().getDay() - 1)));
            vm.dias = [];
            for (var j = 0; j < 5; j++) {
                dia.setTime(dia.getTime() + (j == 0 ? 0 : 86400000));
                if (vm.semana == 1 && j == 0) {//si esta en semana 2 le suma 7
                    dia.setTime(dia.getTime() + (7 * 86400000));
                }
                vm.dias.push(new Date(dia));
            }
        }

        /**
         * @method getFechaRecursos Carga la fecha y luego los recursos
         */
        vm.getFechaRecursos = function () {
            getFecha();
            if (vm.recurso != null)
                vm.getDisponible();
        }

        /**
         * @method hacerReserva Crea una reserva
         * @param {object} celda celda seleccionada
         * @param {object} ncelda siguiente celda vertical 
         */
        vm.hacerReserva = function (celda, ncelda) {
            var reserva = {
                nombre: vm.getUser().nombre + ' ' + vm.getUser().apellido,
                curso: vm.curso == null ? '' : vm.curso,
                fecha: celda.fecha.getTime(),
                recurso: vm.recurso,
                usuario: vm.getUser().id
            };
            if (celda.activo && ncelda == null || ncelda.activo && celda.activo) {//si la siguiente celda esta disponible o la actual es la ultima
                DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").push(reserva);
                vm.progress();
                progressBarFactory.initProgress();//se inicia la barra de progreso
            }
        };

        /* select de pruebaReservas.html que se carga al seleccionar opcion del select anterior */
        /**
         * @method getRecursos Carga los recursos en un array 
         */
        vm.getRecursos = function () {
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

        /**
         * @method getTipos Carga los tipos
         */
        function getTipos() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/tipos").once("value", function (snapshot) {
                $timeout(function () {
                    vm.tipos = snapshot.val();
                    vm.tipos.unshift('Seleccione un tipo');
                    vm.tipo = vm.tipos[0];
                }, 0);
            });
        }

        /* carga recursos disponibles en la tabla de pruebaReservas.html*/
        /**
         * @method getDisponible carga los recursos disponibles
         */
        vm.getDisponible = function () {
            try {
                q.off()//quita el evento on de la anterior consulta
            } catch (err) {}
            q = DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").orderByChild("recurso").equalTo(vm.recurso);
            if (vm.recurso == null) {//si es null vacia el array y la tabla
                vm.tabla = [];
            } else {
                q.on("value", function (snapshot) {
                    var reservas = snapshot.val();
                    DATABASE.ref("centros/" + vm.getUser().codcentro + "/horas").once("value", function (hor) {
                        var horas = hor.val().split("-");
                        progressBarFactory.setProgress(20);//aumenta el progreso
                        $timeout(function () {
                            vm.tabla = [];
                            for (var i = new Date('1/1/1 ' + horas[0]).getTime(); i < new Date('1/1/1 ' + horas[1]); i += 1800000) { //fila que aumenta el tiempo en 30 minutos
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
                                    for (var data in reservas) {//buscar en las reservas
                                        if (reservas[data].perm && new Date(reservas[data].fecha).getDay() == vm.dias[j].getDay()) {//si es permanente y el mismo dia se adapta la fecha para que cumpla la siguiente condicion
                                            var nf = new Date(vm.dias[j]);
                                            reservas[data].fecha = nf.setHours(new Date(reservas[data].fecha).getHours(), new Date(reservas[data].fecha).getMinutes(), 0);
                                        }
                                        if (vm.dias[j] - new Date(reservas[data].fecha) < 3500000 && vm.dias[j] - new Date(reservas[data].fecha) >= -60000) {//si entra dentro del rango de horario  
                                            celda.activo = false;
                                            celda.nombre = reservas[data].nombre;
                                            celda.curso = reservas[data].curso;
                                        }
                                    }
                                    if (progressBarFactory.getProgress() < 90) {
                                        progressBarFactory.sumProgress(5);
                                    }
                                    switch (j) {//dependiendo del dia lo pondra en una posicion u otra
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