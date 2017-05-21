(function () {

    angular
        .module('app')
        .controller('HomeController', homeController);

    function homeController(userFactory, $timeout, DATABASE, $log) {
        var vm = this;
        var interval = function(){$timeout(recarga, 1000)};
        interval();
        vm.lunes = [];
        vm.martes = [];
        vm.miercoles = [];
        vm.jueves = [];
        vm.viernes = [];
        vm.semana=0;
        function recarga() {
            if (userFactory.getUser() != null) {
                $timeout(function () {
                    vm.getUser = userFactory.getUser();
                    vm.photo = userFactory.getPhoto();
                    recogerMisReservas();
                    recogerCentro();
                }, 0);
            }else{
                interval();
            }
        }

        vm.refrecarCalendario = function () {
            recogerMisReservas();
        };

        function recogerCentro(){
            DATABASE.ref("centros/" + vm.getUser.codcentro + "/nombre").once("value", function (snapshot) {
                $timeout(function(){vm.centro=snapshot.val()},0);
            });
        }


        function recogerMisReservas() {
            DATABASE.ref("centros/" + vm.getUser.codcentro + "/reservas/").orderByChild("usuario").equalTo(vm.getUser.id).once("value", function (snapshot) {
                var reser = snapshot.val();
                vm.lunes = [];
                vm.martes = [];
                vm.miercoles = [];
                vm.jueves = [];
                vm.viernes = [];
                var semana1 = new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() - 1)));
                var fsemana1 = new Date(new Date().setDate(semana1.getDate() + 6));
                semana1.setHours(0,0);
                fsemana1.setHours(0,0);
                if (vm.semana == 1) {
                    semana1.setDate(semana1.getDate() + 7);
                    fsemana1.setDate(fsemana1.getDate() + 7);
                } 
                            
                $timeout(function () {
                    for (var data in reser) {
                        if (reser[data].fecha > 10) {                         
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
                                    actual: actu
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
                            if (new Date('1/1/1 ' + new Date().getHours() + ':' + new Date().getMinutes()) < new Date('1/1/1 ' + reser[data].hora) && new Date('1/1/1 ' + new Date(new Date() + 3600000).getHours() + ':' + new Date(new Date() + 3600000).getMinutes()) > new Date('1/1/1 ' + reser[data].hora)) {
                                actu = true;
                            }
                            var date = new Date('1/1/1 '+ reser[data].hora);
                            var reserva = {
                                code: data,
                                recurso: reser[data].recurso,
                                hora: (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() != 0 ? date.getMinutes() : date.getMinutes() + '0') + "-" + (new Date(date.getTime() + 3600000).getHours() < 10 ? '0' + new Date(date.getTime() + 3600000).getHours() : new Date(date.getTime() + 3600000).getHours()) + ':' + (date.getMinutes() != 0 ? date.getMinutes() : date.getMinutes() + '0'),
                                fecha: "Permanente",
                                activo: true,
                                actual: actu
                            };
                            switch (parseInt(reser[data].fecha)) {
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

        vm.borrarReserva = function (reserva, array, index) {
            if(reserva.activo){
            var reser = DATABASE.ref("centros/" + vm.getUser.codcentro + "/reservas/" + reserva.code);
            reser.once("value", function (datos) {               
                var a = datos.val();
                if (a.perm == null) { // si perm es null es porque no es permanente y se puede borrar
                    reser.remove();
                    $timeout(function(){array.splice(index,1);},0)
                } else {
                    alert("No puedes borrar las asignaciones permanentes"); //futuro modal
                }
            });
            }
        };

        //CAMBIAR
        function rellenarTablaHorarios() {
            DATABASE.ref("centros/" + vm.getUser.codcentro + "/horas").once("value", function (horas) {
                DATABASE.ref("horarios/").orderByChild("usuario").equalTo(vm.getUser.id).once("value", function (snapshot) {
                    vm.filas = [];
                    var data = snapshot.val();
                    for (var i = 1; i <= horas.val(); i++) { //filas                                     
                        var columnas = [];
                        for (var j = 1; j <= 5; j++) { //columnas
                            var valor = "";
                            for (var data1 in data) {
                                if (data[data1].dia == j && data[data1].hora == i) { // si existe un registro del horario en ese dia y hora se le pone como valor al input
                                    valor = data[data1].nombre;
                                }
                            }
                            var celda = {
                                fila: i,
                                columna: j,
                                curso: valor
                            };
                            columnas.push(celda);
                        }
                        vm.filas.push({
                            hora: i,
                            columna: columnas
                        });
                    }
                });
            });
        }
    }
})();


/*function RecogerMisReservas(lunes, martes, miercoles, jueves, viernes) {
    REF.ref("centros/" + cod + "/reservas/").orderByChild("usuario").equalTo(getCurrentUser().uid).on("value", function (data) { //filtramos las reservas por los usuarios

        for (var data1 in reser) {
            var hijo = document.createElement("li");//creamos elemento li
            hijo.setAttribute("value", data1); //añadir atributos
            hijo.setAttribute("class", "list-group-item dias");
            hijo.addEventListener("click", function () { //añadimos listener y funcion las cual sera el borrado de la reserva

                REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function (sna) {
                    var a = sna.val(),
                        cod;
                    for (var i in a) {
                        cod = a[i].codcentro;
                    }
                    var reser = REF.ref("centros/" + cod + "/reservas/" + reserva);
                    reser.once("value", function (datos) {
                        var a = datos.val();
                        if (a.perm == null) { // si perm es null es porque no es permanente y se puede borrar
                            reser.remove();
                        } else {
                            alert("No puedes borrar las asignaciones permanentes");
                        }
                    });
                });
            });

            var fecha = reser[data1].fecha;
            if (fecha.length > 1) { //si la fecha es mayor que uno es una reserva normal si no la fecha es el dia de la semana solo y por tanto es permanente
                var date = new Date(fecha);
                if (new Date() < date || new Date().getDate() == date.getDate() && new Date().getMonth() == date.getMonth()) {
                    hijo.innerHTML = reser[data1].recurso + "<p></p>Fecha: " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " Hora: " + reser[data1].hora;//texto
                    if (date.getDay() == 1) { //filtramos a que lista lo vamos a añadir
                        lunes.appendChild(hijo);
                    } else if (date.getDay() == 2) {
                        martes.appendChild(hijo);
                    } else if (date.getDay() == 3) {
                        miercoles.appendChild(hijo);
                    } else if (date.getDay() == 4) {
                        jueves.appendChild(hijo);
                    } else {
                        viernes.appendChild(hijo);
                    }
                }
            } else {
                hijo.innerHTML = reser[data1].recurso + "<p></p> Hora: " + reser[data1].hora + " Permanente";
                if (fecha == 1) { //filtramos
                    lunes.appendChild(hijo);
                } else if (fecha == 2) {
                    martes.appendChild(hijo);
                } else if (fecha == 3) {
                    miercoles.appendChild(hijo);
                } else if (fecha == 4) {
                    jueves.appendChild(hijo);
                } else {
                    viernes.appendChild(hijo);
                }
            }
        }
    });
}


------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------


function rellenarTablaHorarios(tabla) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(sna) {
        var a = sna.val(),
            cod;
        for (var i in a) {
            cod = a[i].codcentro;
        }
        REF.ref("centros/" + cod + "/horas").once("value", function(horas) {
            REF.ref("horarios/").orderByChild("usuario").equalTo(getCurrentUser().uid).once("value", function(snapshot) {
                var data = snapshot.val();
                while (tabla.hasChildNodes()) {
                    tabla.removeChild(tabla.firstChild);
                }
                for (var i = 1; i <= horas.val(); i++) { //filas
                    var fila = document.createElement("tr");//creamos la fila
                    fila.setAttribute("name", "fila");
                    var columnahora = document.createElement("th");//primera columna que es la hora
                    columnahora.textContent = i;
                    fila.appendChild(columnahora);
                    for (var j = 1; j <= 5; j++) { //columnas
                        var columna = document.createElement("td"),// creamos la columna
                            input = document.createElement("input");// creamos el input de dentro de la columna
                        input.setAttribute("type", "text");
                        input.setAttribute("maxlength", "20");
                        input.setAttribute("class", "form-control");
                        input.setAttribute("id", i + "-" + j);//le ponemos de id la fila y la columna
                        input.disabled = true;// lo ponemos no editable
                        for (var data1 in data) {
                            if (data[data1].dia == j && data[data1].hora == i) {// si existe un registro del horario en ese dia y hora se le pone como valor al input
                                input.value = data[data1].nombre;
                            }
                        }
                        columna.appendChild(input);
                        fila.appendChild(columna);
                        tabla.appendChild(fila);
                    }
                }
            });
        });
    });
}*/