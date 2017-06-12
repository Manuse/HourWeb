(function () {

    angular
        .module('app')
        .controller('AdministradorController', administradorController);

    function administradorController(userFactory, DATABASE, AUTH, $log, $timeout, $location, modalFactory, errorFactory, progressBarFactory) {
        var vm = this;
        var centro;
        // Timepicker reservas permanentes       
        vm.hstep = 1;
        vm.mstep = 30;
        vm.bRP = '';
        vm.error = modalFactory.error;
        vm.confirmacion = modalFactory.confirmacion;
        vm.progressBar = modalFactory.progressBar;

        //Accordion
        vm.oneAtATime = true;
        vm.open = [];

        vm.cursosRP = [];
        vm.cursos = [];
        vm.RP = [];
        vm.tipologias = [];
        vm.recursos = [];
        vm.usuarios = [];
        vm.dayRP = "6";

        /**
         * Intervalo para recargar
         */
        var interval = function () {
            $timeout(recarga, 100)
        };
        interval();

        /**
         * carga los datos de la pagina
         */
        function recarga() {
            if (userFactory.getUser() != null) {
                $timeout(function () {
                    vm.getUser = userFactory.getUser;
                    if (vm.getUser().tipo != "administrador" || vm.getUser().baneo) {
                        $location.path("/principal/home");
                    }
                    cargarRecursos();
                    cargarUsuarios();
                    getTipologias();
                    horaYNombreCentro()
                    cargarCursos();
                    cargarRP();
                }, 0);
            } else {
                interval();
            }
        }

        /**
         * Carga la hora y en nombre del centro
         */
        function horaYNombreCentro() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/horas").once("value", function (snapshot) {
                $timeout(function () {
                    vm.mytimeRP = new Date("1/1/3000 " + snapshot.val().split("-")[0] + ":00");
                    vm.max = new Date("1/1/3000 " + snapshot.val().split("-")[1] + ":00") - 3600000;
                    vm.min = vm.mytimeRP;
                    vm.inicio = vm.min;
                    vm.final = vm.max + 3600000;
                }, 0);
            });
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/nombre").once("value", function (snapshot) {
                $timeout(function () {
                    vm.nCentro = snapshot.val();
                    centro = snapshot.val();
                }, 0);
            });
        }

        /**
         * Crea un recurso
         */
        vm.crearRecurso = function () {
            var re = DATABASE.ref("centros/" + vm.getUser().codcentro + "/recursos/" + vm.recurso); //decimos el nodo del recurso
            if (vm.recurso != 0 && vm.recurso != null) {
                re.once("value", function (snapshot) {
                    if (!snapshot.exists()) { //sino existe lo creamos
                        if (vm.recursos[0].value == null) {
                            vm.recursos.splice(0, 1);
                        }
                        re.set({
                            tipo: vm.tipo
                        });
                        vm.recursos.push({
                            recurso: vm.recurso,
                            tipo: vm.tipo,
                            value: vm.recurso
                        });
                        vm.recurso = "";
                    } else {
                        vm.error(errorFactory.getError("noRecurso"));
                    }
                });
            } else {
                vm.error(errorFactory.getError("campoVacio"));
            }
        };

        /**
         * Carga los tipos
         */
        function getTipologias() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/tipos/").once("value", function (snapshot) {
                $timeout(function () {
                    vm.tipologias = snapshot.val();
                    vm.open.fill(false, 0, vm.tipologias.length);
                    vm.tipo = vm.tipologias[0];
                }, 0);

            });
        }

        /**
         * Borra un tipo, sus recursos y las reservas de ese recurso
         * @param index posicion
         */
        vm.borrarTipo = function (index) {
            var funcion = function () {
                var tipo = vm.tipologias[index];
                vm.tipologias.splice(index, 1);
                vm.open.splice(index, 1);
                DATABASE.ref("centros/" + vm.getUser().codcentro + "/tipos/").set(vm.tipologias);
                DATABASE.ref("centros/" + vm.getUser().codcentro + "/recursos/").orderByChild("tipo").equalTo(tipo).once("value", function (snapshot) {
                    var recursos = snapshot.val();
                    for (var data in recursos) {
                        DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").orderByChild("recurso").equalTo(data).once("value", function (data1) {
                            var reserva = data1.val();
                            for (var data2 in reserva) {
                                $log.log(data2);
                                DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/" + data2).remove();
                            }
                        });
                        DATABASE.ref("centros/" + vm.getUser().codcentro + "/recursos/" + data).remove();
                    }
                })
            }

            vm.confirmacion("¿Borrar este tipo?", funcion);
        };

        /**
         * Crea un nuevo tipo
         */
        vm.crearTipo = function () {
            if (vm.ntipo != 0 && vm.ntipo != null) {
                if (!vm.tipologias.includes(vm.ntipo)) {
                    vm.tipologias.push(vm.ntipo);
                    vm.open.push(false);
                    DATABASE.ref("centros/" + vm.getUser().codcentro + "/tipos/").set(vm.tipologias);
                    vm.ntipo = "";
                } else {
                    vm.error(errorFactory.getError("noTipo"));
                }
            } else {
                vm.error(errorFactory.getError("campoVacio"));
            }
        };

        /**
         * borra un recurso
         */
        vm.borrarRecurso = function (recurso) {
            var funcion = function () {
                DATABASE.ref("centros/" + vm.getUser().codcentro + "/recursos/" + recurso).remove();
            };
            vm.confirmacion("¿Borrar el recurso " + recurso + "?", funcion);
        };

        /**
         * carga los recursos
         */
        function cargarRecursos() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/recursos/").on("value", function (snapshot) {
                $timeout(function () {
                    try {
                        vm.recursos = Object.keys(snapshot.val()).map(function (key) {
                            return {
                                recurso: key,
                                tipo: snapshot.val()[key].tipo,
                                value: key
                            };
                        });
                    } catch (err) {}
                    if (vm.recursos.length == 0) {
                        vm.recursos.push({
                            recurso: "No hay recursos",
                            value: null
                        })
                    }
                    vm.recursoRP = vm.recursos[0].value;

                }, 0);
            });
        }

        /**
         * Carga de usuario
         */
        function cargarUsuarios() {
            DATABASE.ref("user/").orderByChild("codcentro").equalTo(vm.getUser().codcentro).once("value", function (snapshot) {
                $timeout(function () {
                    vm.usuarios = Object.keys(snapshot.val()).map(function (key) {
                        return {
                            id: snapshot.val()[key].id,
                            code: key,
                            nombre: snapshot.val()[key].nombre + ' ' + snapshot.val()[key].apellido,
                            verificado: snapshot.val()[key].verificado,
                            tel_fijo: snapshot.val()[key].tel_fijo,
                            email: snapshot.val()[key].email,
                            tipo: snapshot.val()[key].tipo,
                            tel_movil: snapshot.val()[key].tel_movil,
                            baneo: snapshot.val()[key].baneo
                        };
                    });
                    vm.usuarioRP = vm.usuarios[0];
                }, 0);
            });
        }

        /** 
         *devuelve el numero de recursos segun el tipo
         * @param tip: tipo
         * @return numero de tipos
         */
        vm.filtrar = function (tip) {
            return vm.recursos.filter(function (x) {
                return x.tipo == tip;
            }).length;
        };

        /**
         * Hace una reserva permanente
         */
        vm.hacerReservaPermanente = function () {
            vm.mytimeRP.setDate(parseInt(vm.dayRP));
            var existe = false,
                i = 0;

            while (i < vm.RP.length && !existe) {
                if (vm.RP[i].recurso == vm.recursoRP && new Date(vm.RP[i].fecha).getDay() == vm.mytimeRP.getDay() && new Date(vm.RP[i].fecha).getHours() == vm.mytimeRP.getHours() && new Date(vm.RP[i].fecha).getMinutes() == vm.mytimeRP.getMinutes()) {
                    existe = true;
                }
                i++;
            }

            if (vm.recursoRP != null) {
                if (!existe) {
                    var funcion = function () {
                        DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").orderByChild("recurso").equalTo(vm.recursoRP).once("value", function (snapshot) {

                            for (var data in snapshot.val()) {
                                if (new Date(snapshot.val()[data].fecha).getDay() == vm.mytimeRP.getDay() && new Date(snapshot.val()[data].fecha).getHours() == vm.mytimeRP.getHours() && new Date(snapshot.val()[data].fecha).getMinutes() == vm.mytimeRP.getMinutes()) {
                                    DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/" + data).remove();
                                }
                            }
                            var rp = {
                                fecha: vm.mytimeRP.getTime(),
                                recurso: vm.recursoRP,
                                usuario: vm.usuarioRP.id,
                                nombre: vm.usuarioRP.nombre,
                                curso: vm.cursoRP == null ? '' : vm.cursoRP,
                                perm: true
                            };
                            var key = DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").push(rp).key;
                            rp.hora = (vm.mytimeRP.getHours() < 10 ? '0' + vm.mytimeRP.getHours() : vm.mytimeRP.getHours()) + ':' + (vm.mytimeRP.getMinutes() != 0 ? vm.mytimeRP.getMinutes() : vm.mytimeRP.getMinutes() + '0') + "-" + (new Date(vm.mytimeRP.getTime() + 3600000).getHours() < 10 ? '0' + new Date(vm.mytimeRP.getTime() + 3600000).getHours() : new Date(vm.mytimeRP.getTime() + 3600000).getHours()) + ':' + (vm.mytimeRP.getMinutes() != 0 ? vm.mytimeRP.getMinutes() : vm.mytimeRP.getMinutes() + '0')
                            rp.code = key;
                            $timeout(function () {
                                vm.RP.push(rp);
                            }, 0);
                        })

                    }
                    vm.confirmacion("Se borraran todas las reservas normales que coincidan con esta reserva ¿Está seguro?", funcion);
                } else {
                    vm.error(errorFactory.getError("existeRP"));
                }
            } else {
                vm.error(errorFactory.getError("debeRecurso"));
            }
        };

        /**
         * Carga la lista de cursos
         */
        function cargarCursos() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/cursos/").once("value", function (snapshot) {
                $timeout(function () {
                    try {
                        vm.cursos = snapshot.val();
                        vm.cursosRP = snapshot.val().map(function (key) {
                            return {
                                label: key,
                                value: key
                            }
                        });
                        vm.cursosRP.unshift({
                            label: 'Seleccione el curso (Opcional)',
                            value: null
                        });
                        vm.cursoRP = vm.cursosRP[0].value;
                    } catch (err) {
                        vm.cursos = []
                    }
                }, 0)
            });
        }

        /**
         * Añade un curso
         */
        vm.addCurso = function () {
            if (vm.nCurso != 0 && vm.nCurso != null) {
                if (vm.cursos.length == 0 || !vm.cursos.includes(vm.nCurso)) {
                    vm.cursosRP.push({
                        label: vm.nCurso,
                        value: vm.nCurso
                    });
                    vm.cursos.push(vm.nCurso);
                    DATABASE.ref("centros/" + vm.getUser().codcentro + "/cursos/").set(vm.cursos);
                } else {
                    vm.error(errorFactory.getError("noCurso"));
                }
            } else {
                vm.error(errorFactory.getError("campoVacio"));
            }
        }

        /**
         * Borra un curso
         * @param index: posicion
         * @param curso: curso
         */
        vm.borrarCurso = function (index, curso) {
            var funcion = function () {
                vm.cursosRP.splice(index + 1, 1);
                vm.cursos.splice(index, 1);
                DATABASE.ref("centros/" + vm.getUser().codcentro + "/cursos/").set(vm.cursos);
                DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").orderByChild("curso").equalTo(curso).once("value", function (snapshot) {
                    var reservas = snapshot.val();
                    for (var data in reservas) {
                        DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/" + data).update({
                            curso: ''
                        })
                    }
                });
                for (var i = 0; i < vm.usuarios; i++) {
                    DATABASE.ref("horarios/").orderByChild("usuario").equalTo(vm.usuarios[i].id).once("value", function (data) {
                        var horarios = data.val();
                        for (var data1 in horarios) {
                            DATABASE.ref("horarios/" + data1).remove();
                        }
                    })
                }
            }
            vm.confirmacion("¿Borrar el curso " + curso + "? eso también borrará el curso de las reservas y de los horarios", funcion);
        }

        /**
         * Carga las reservas permanentes
         */
        function cargarRP() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").orderByChild("perm").equalTo(true).once("value", function (snapshot) {
                $timeout(function () {
                    try {
                        vm.RP = Object.keys(snapshot.val()).map(function (key) {
                            var date = new Date(snapshot.val()[key].fecha);

                            function day(key) {
                                switch (parseInt(key)) {
                                    case 1:
                                        return "Lunes";
                                    case 2:
                                        return "Martes";
                                    case 3:
                                        return "Miercoles";
                                    case 4:
                                        return "Jueves";
                                    case 5:
                                        return "Viernes";
                                }
                            }
                            return {
                                fecha: date,
                                code: key,
                                dia: day(date.getDay()),
                                nombre: snapshot.val()[key].nombre,
                                recurso: snapshot.val()[key].recurso,
                                hora: (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() != 0 ? date.getMinutes() : date.getMinutes() + '0') + "-" + (new Date(date.getTime() + 3600000).getHours() < 10 ? '0' + new Date(date.getTime() + 3600000).getHours() : new Date(date.getTime() + 3600000).getHours()) + ':' + (date.getMinutes() != 0 ? date.getMinutes() : date.getMinutes() + '0'),
                                perm: true,
                                curso: snapshot.val()[key].curso
                            }
                        });
                    } catch (err) {}
                }, 0)
            });
        }

        /**
         * Borra una reserva permanente
         * @param rp: reserva permanente
         */
        vm.borrarRP = function (rp) {
            funcion = function () {
                vm.RP.splice(vm.RP.indexOf(rp), 1);
                DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/" + rp.code).remove();
            }
            vm.confirmacion("¿Borrar esta reserva permanente?", funcion);
        };

        /**
         * Cambia el tipo de usuario de administrador a estandar y viceversa
         * @param user: usuario con los datos 
         */
        vm.cambiarTipo = function (user) {
            if (user.tipo != 'administrador') {
                DATABASE.ref("user/" + user.code).update({
                    tipo: "administrador"
                });
                user.tipo = "administrador";
            } else {
                DATABASE.ref("user/" + user.code).update({
                    tipo: "estandar"
                });
                user.tipo = "estandar";
            }
        }


        /**
         * Cambia el nombre del centro
         */
        vm.cambiarNombreCentro = function () {
            if (vm.nCentro != 0 && vm.nCentro != null) {
                DATABASE.ref("centros/" + vm.getUser().codcentro).update({
                    nombre: vm.nCentro
                });
                vm.error("Nombre del centro cambiado", 1)
                vm.datos = !vm.datos;
            } else {
                vm.error(errorFactory.getError("campoVacio"));
            }
        }

        /**
         * Cancela el nombre del centro
         */
        vm.cancelarNombreCentro = function () {
            vm.nCentro = centro;
            vm.datos = !vm.datos;
        }

        /**
         * Cambia la hora del centro
         */
        vm.cambiarHora = function () {
            if (vm.inicio >= vm.fin || vm.fin - vm.inicio < 7200000) {
                vm.error(errorFactory.getError("errorHoraRegistro"));
            } else {
                var funcion = function () {
                    vm.progressBar();
                    progressBarFactory.initProgress();
                    DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").once("value", function (snapshot) {
                        var reservas = snapshot.val();
                        DATABASE.ref("centros/" + vm.getUser().codcentro).update({
                            horas: vm.inicio.getHours() + ':' + (vm.inicio.getMinutes() != 0 ? vm.inicio.getMinutes() : vm.inicio.getMinutes() + '0') + '-' + vm.final.getHours() + ':' + (vm.final.getMinutes() != 0 ? vm.final.getMinutes() : vm.final.getMinutes() + '0'),
                            rango_horas: vm.final.getHours() - vm.inicio.getHours()
                        });
                        progressBarFactory.sumProgress(35);
                        for (var data in reservas) {
                            if (new Date(reservas[data].fecha).getHours() < vm.inicio.getHours() || new Date(reservas[data].fecha).getHours() >= vm.final.getHours() && new Date(reservas[data].fecha).getMinutes() >= vm.final.getMinutes()) {
                                DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/" + data).remove();
                            }
                        }
                        progressBarFactory.sumProgress(35);
                        vm.hora = !vm.hora;
                    });
                    for (var i = 0; i < vm.usuarios.length; i++) {
                        DATABASE.ref("horarios/").orderByChild("usuario").equalTo(vm.usuarios[i].id).once("value", function (snapshot) {
                            for (var data in snapshot.val()) {
                                if (snapshot.val()[data].hora > vm.final.getHours() - vm.inicio.getHours()) {
                                    DATABASE.ref("horarios/" + data).remove();
                                }
                            }
                        })
                    }
                    progressBarFactory.sumProgress(30);
                }
                vm.confirmacion("Se borraran los horarios y reservas fuera del horario¿Esta seguro?", funcion);
            }
        };

        /**
         * Cancela el cambio de hora del centro
         */
        vm.cancelarCambiarHora = function () {
            vm.hora = !vm.hora;
            vm.inicio = vm.min;
            vm.final = vm.max + 3600000;
        }

        /**
         * Banea o quita el baneo a un usuario
         * @param usuario usuario a banear
         */
        vm.banearUsuario = function (usuario) {
            if (usuario.baneo) {
                DATABASE.ref("user/" + usuario.code).update({
                    baneo: false
                });
                usuario.baneo = false;
            } else {
                DATABASE.ref("user/" + usuario.code).update({
                    baneo: true
                });
                usuario.baneo = true;
            }
        }
    }

})();