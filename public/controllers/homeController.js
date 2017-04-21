(function () {

    angular
        .module('app')
        .home('HomeController', homeController);

    function homeController(userFactory) {
        var vm = this;
        var interval = setInterval(recarga, 1000);

        function recarga() {
            if (userFactory.getUser() != null) {
                $scope.$apply(function () {
                    vm.getUser = userFactory.getUser();
                    vm.photo = userFactory.getPhoto();
                    clearInterval(interval);
                });
            }
        }

        function RecogerMisReservas() {
            REF.ref("centros/" + vm.getUser.codcentro + "/reservas/").orderByChild("usuario").equalTo(vm.getUser.uid).on("value", function (snapshot) {
                var reser = snapshot.val();
                vm.lunes = [];
                vm.martes = [];
                vm.miercoles = [];
                vm.jueves = [];
                vm.viernes = [];
                var semana1 = new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() - 1)));
                if (vm.semana) {
                    semana1.setDate(semana1.getDate() + 7);
                }
                for (var data in reser) {
                    var fecha = reser[data].fecha;
                    if (reser[data].fecha.length > 1) {
                        var date = new Date(fecha);
                        if (semana1 < date || semana1.getDate() == date.getDate() && semana1.getMonth() == date.getMonth()) {
                            var reserva = {
                                code: data,
                                recurso: reser[data].recurso,
                                hora: reser[data].hora,
                                fecha: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
                            }
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
                                    break
                            }
                        }
                    } else {
                        var reserva = {
                            code: data,
                            recurso: reser[data].recurso,
                            hora: reser[data].hora,
                            fecha: "Permanente"
                        }
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
                                break

                        }
                    }
                }
            });
        }

        vm.borrarReserva = function () {
            var reserva = this.getAttribute("data-code");
            var reser = REF.ref("centros/" + vm.getUser.codcentro + "/reservas/" + reserva);
            reser.once("value", function (datos) {
                var a = datos.val();
                if (a.perm == null) { // si perm es null es porque no es permanente y se puede borrar
                    reser.remove();
                } else {
                    alert("No puedes borrar las asignaciones permanentes");//futuro modal
                }
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
}*/