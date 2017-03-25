//añadirlistener
window.onload = function() {
    var id = document.getElementById("idpage").className;
    switch (parseInt(id)) {
        case 1:
            document.getElementById("registrar_admin").addEventListener("click", recogerFormularioAdmin);
            document.getElementById("registrar_user").addEventListener("click", recogerFormularioUser);
            document.getElementById("id_entrar").addEventListener("click", entrar);
            document.getElementById("cancela_admin").addEventListener("click", cancelarAdmin);
            document.getElementById("cancela_user").addEventListener("click", cancelarUser);
            document.getElementById("cancela_entrar").addEventListener("click", cancelarEntrar);
            break;
        case 2:
            document.getElementById("salir").addEventListener("click", cerrarSesion);
            document.getElementById("ir_reserva").addEventListener("click", function() {
                window.location = "reservar.html";
            });
            document.getElementById("cambiar_horario").addEventListener("click", habilitarTablaHorarios);
            document.getElementById("guardar_horario").addEventListener("click", function() {
                deshabilitarTablaHorarios();
                guardarTablaHorarios();
            })
            break;
        case 3:
            document.getElementById("salir").addEventListener("click", cerrarSesion);
            document.getElementById("combo_tipo_reserva").addEventListener("change", function() {
                montarRecursosReserva();
                limpiarListaHoras();
            });
            document.getElementById("combo_fecha").addEventListener("change", limpiarListaHoras);
            break;
        case 4:
            document.getElementById("salir").addEventListener("click", cerrarSesion);
            document.getElementById("cambiar_foto").addEventListener("change", function(file) {
                file.preventDefault();
                var archivo = file.target.files[0];
                actualizarFoto(archivo);
            });
            document.getElementById("cambiar_datos").addEventListener("click", cambiarDatosUser);
            document.getElementById("cambiar_centro").addEventListener("click", cambiarCodigoCentro);
            break;
        case 5:
            document.getElementById("salir").addEventListener("click", cerrarSesion);
            document.getElementById("guardar_recurso").addEventListener("click", recogerDatosRecurso);
            document.getElementById("guardar_reserva").addEventListener("click", recogerReservaPermanante);
            break;
    }
};

/*
 * borra el formulario de entrar
 */
function cancelarEntrar() {
    var email = document.getElementById("email_entrar").value = "",
        pass = document.getElementById("pass_entrar").value = "";
}

/*
 * borra los datos del formulario de registro de administrador
 */
function cancelarAdmin() {
    var nombre = document.getElementById("nombre_admin").value = "",
        apellido = document.getElementById("apellido_admin").value = "",
        email = document.getElementById("email_admin").value = "",
        pass1 = document.getElementById("pass1").value = "",
        pass2 = document.getElementById("pass2").value = "",
        centro = document.getElementById("nombre_centro").value = "";

}

/*
 * borra los campos del formulario de registro de usuarios
 */
function cancelarUser() {
    var nombre = document.getElementById("nombre_user").value = "",
        apellido = document.getElementById("apellido_user").value = "",
        email = document.getElementById("email_user").value = "",
        pass1 = document.getElementById("pass1_u").value = "",
        pass2 = document.getElementById("pass2_u").value = "",
        centro = document.getElementById("id_centro").value = "";
}

/**
 * limipia la lista de las horas
 */
function limpiarListaHoras() {
    lista = document.getElementById("lista_horas"); //recogemos la lista a rellenar
    while (lista.hasChildNodes()) { //borramos los nodos q tenga dentro si los tuviera
        lista.removeChild(lista.firstChild);
    }
    document.getElementById("recurso").textContent = "";
    var t = document.createElement("li");//creamos y añadimos el primer elemento de lista
    t.setAttribute("class", "list-group-item lista_hora");
    t.setAttribute("style", "font-family:'Verdana',sans-serif;font-size:20px;background-color:skyblue;");
    t.setAttribute("data-toggle", "tooltip");
    t.setAttribute("data-placement", "top");
    t.setAttribute("title", 'LISTA DE HORAS DISPONIBLES');
    t.innerHTML = "<u><strong>HORAS</strong></u>";
    lista.appendChild(t);
    $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
    });
}

/**
 * validar formulario de registro de un usuario administrador
 */
function recogerFormularioAdmin() {
    var nombre = document.getElementById("nombre_admin").value,
        apellido = document.getElementById("apellido_admin").value,
        email = document.getElementById("email_admin").value,
        pass1 = document.getElementById("pass1").value,
        pass2 = document.getElementById("pass2").value,
        centro = document.getElementById("nombre_centro").value,
        horas = document.getElementById("id_horas").value;
    var span = document.getElementById("error_reg_admin");

    if (nombre == 0 || apellido == 0 || email == 0 || pass1 == 0 || pass2 == 0 || centro == 0 || horas == 0) {
        span.textContent = "Rellene todos los campos";
    } else if (isNaN(horas)) {
        span.textContent = "El numero de horas debe ser numero";
    } else if (horas < 2 || horas > 8) {
        span.textContent = "Las horas deben estar entre 2 y 8";
    } else if (pass1 != pass2) {
        span.textContent = "Las contraseñas no son iguales";
    } else {
        registrarUserAdmin(nombre, apellido, centro, horas, email, pass1);
    }
}

/**
 * Valida el formulario de registro de un usuario estandar
 */
function recogerFormularioUser() {
    var nombre = document.getElementById("nombre_user").value,
        apellido = document.getElementById("apellido_user").value,
        email = document.getElementById("email_user").value,
        pass1 = document.getElementById("pass1_u").value,
        pass2 = document.getElementById("pass2_u").value,
        centro = document.getElementById("id_centro").value;
    var span = document.getElementById("error_reg_user");
    if (nombre == 0 || apellido == 0 || email == 0 || pass1 == 0 || pass2 == 0 || centro == 0) {
        span.textContent = "Rellene todos los campos";
    } else if (pass1 != pass2) {
        span.textContent = "Las contraseñas no son iguales";
    } else {
        comprobarCentro(span, nombre, apellido, centro, email, pass1);
    }
}

/**
 *rellena el combobox de la fecha
 */
function rellenarComboFecha() {
    var combo = document.getElementById("combo_fecha");
    for (var i = 0; i < 14; i++) {
        var date = new Date();
        date.setDate(date.getDate() + i);
        if (date.getDay() != 0 && date.getDay() != 6) {//descartamos sabado y domingo
            var fecha = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear(),
                dia;
            switch (date.getDay()) { //segun el dia tomara un valor
                case 1:
                    dia = "Lunes";
                    break;
                case 2:
                    dia = "Martes";
                    break;
                case 3:
                    dia = "Miercoles";
                    break;
                case 4:
                    dia = "Jueves";
                    break;
                case 5:
                    dia = "Viernes";
                    break;
            }
            var option = document.createElement("option");
            option.setAttribute("class", "opcion_combo");
            option.setAttribute("value", fecha);
            option.textContent = dia + " " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
            combo.appendChild(option);
        }
    }
}

/**
 * recoge los datos del recurso
 */
function recogerRecurso() {
    var nom = document.getElementById("nombre_recurso").value,
        tipo = document.getElementById("tipo_recurso").value;
    if (nom == 0) {
        alert("Campo nombre no pude ser vacio");
    } else {
        crearRecurso(nom, tipo);
    }
}

/**
 * Inicia la sesion de un usuario ya creado
 */
function entrar() {
    var email = document.getElementById("email_entrar").value,
        pass = document.getElementById("pass_entrar").value;
    iniciarSesion(email, pass);
}

/**
 * muestra los datos del usuario en el HTML
 */
function montarDatosUsuarioHome() {
    var nombre = document.getElementById("foto_nombre"),
        foto = document.getElementById("foto_home"),
        centro = document.getElementById("foto_centro"),
        codigo = document.getElementById("foto_codigo"),
        cod = document.getElementById("codigo");
    recogerDatosUsuarioHome(nombre, foto, centro, codigo, cod);
}

/**
 * Monta los datos del usuario en la pantalla de configuracion
 */
function montarDatosUsuariosConfig() {
    var nombre = document.getElementById("config_nombre"),
        apellido = document.getElementById("config_apellido"),
        foto = document.getElementById("config_foto");
    recogerDatosUsuariosConfig(nombre, apellido, foto);
}
/**
 * Monta la lista de recursos del HTML
 */
function montarRecursosReserva() {
    var tipo = document.getElementById("combo_tipo_reserva").value,
        listarecursos = document.getElementById("recurso_reserva"),
        listahoras = document.getElementById("lista_horas"),
        fecha = document.getElementById("combo_fecha"),
        recurso = document.getElementById("recurso");
    cargarRecursosDisponibleYReservar(tipo, listarecursos, listahoras, fecha, recurso);
}

/**
 * Monta los select de las reservas permanentes del area de administradores
 */
function montarComboboxes() {
    var horas = document.getElementById("combo_horas"),
        recurso = document.getElementById("combo_recurso"),
        usuarios = document.getElementById("combo_usuario");
    comboHoras(horas);
    comboUsuarios(usuarios);
    comboRecursos(recurso);
}

function montarMisReservas() {
    var lunes = document.getElementById("lunes"), //recogemos las listas de los dias de la semana
        martes = document.getElementById("martes"),
        miercoles = document.getElementById("miercoles"),
        jueves = document.getElementById("jueves"),
        viernes = document.getElementById("viernes");
    RecogerMisReservas(lunes, martes, miercoles, jueves, viernes);
}
/**
 * Monta la tabla de los usuarios en el area de administradores
 */
function montarTablaUsuarios() {
    tablaUsuarios(document.getElementById("tabla_usuarios"));
}

/**
 * Recoge los datos para crear un recurso
 */
function recogerDatosRecurso() {
    var nombre = document.getElementById("nombre_recurso").value,
        tipo = document.getElementById("combo_tipo").value;
    if (nombre == 0) {
        alert("Rellene el campo nombre");
    } else {
        crearRecurso(nombre, tipo);
    }
}

/**
 * Recoge los datos para crear una reserva permanente
 */
function recogerReservaPermanante() {
    var horas = document.getElementById("combo_horas").value,
        recurso = document.getElementById("combo_recurso").value,
        usuario = document.getElementById("combo_usuario").value,
        dia = document.getElementById("combo_dia").value;
    hacerReservaPermanente(recurso, horas, dia, usuario);
}

/**
 * Recoge los elementos para rellenar el navigation
 */
function montarNavigation() {
    var nombre = document.getElementById("nav_nombre"),
        lista = document.getElementById("nav_lista"),
        salir = document.getElementById("salir");
    recogerDatosUsuarioNav(nombre, lista, salir);
}

/**
 * Recoges los valores para cambiar nombre y apellido del usuario
 */
function cambiarDatosUser() {
    var nombre = document.getElementById("config_nombre").value,
        apellido = document.getElementById("config_apellido").value;
    actualizarUser(nombre, apellido);
}

/**
 * cambiar codigo del centro
 */
function cambiarCodigoCentro() {
    var codigo = document.getElementById("config_centro").value;
    cambiarCentro(codigo);
}

/**
 * monta la lista de recursos en administrado
 */
function montarListaRecursoAdmin() {
    var lista = document.getElementById("id_recurso");
    recogerListaRecursoAdmin(lista);
}

/*
 * monta las lista de reservas permanentes en administradores
 */
function montarListaReservasPermanentes() {
    lista = document.getElementById("lista_permanentes");
    recogerListaReservasPermanentes(lista);
}

/*
 * monta la tabla de horarios
 */
function montarHorarios() {
    rellenarTablaHorarios(document.getElementById("tabla_horarios"));
}

/*
 * guarda los cambios en la tabla de horarios
 */
function guardarTablaHorarios() {
    var nfilas = document.getElementsByName("fila").length;
    guardarDatosTablaHorarios(nfilas);
}

/**
* habilita los inputs en la tabla de horarios y cambia la visibilidad de los botones
*/
function habilitarTablaHorarios() {
    var nfilas = document.getElementsByName("fila").length;
    for (var i = 1; i <= nfilas; i++) {
        for (var j = 1; j <= 5; j++) {
            document.getElementById(i + "-" + j).disabled = false;
        }
    }
    document.getElementById("guardar_horario").setAttribute("style", "display:block");
    document.getElementById("cambiar_horario").setAttribute("style", "display:none");
}

/**
* deshabilita los inputs en la tabla de horarios y cambia la visibilidad de los botones
*/
function deshabilitarTablaHorarios() {
    var nfilas = document.getElementsByName("fila").length;
    for (var i = 1; i <= nfilas; i++) {
        for (var j = 1; j <= 5; j++) {
            document.getElementById(i + "-" + j).disabled = true;
        }
    }
    document.getElementById("guardar_horario").setAttribute("style", "display:none");
    document.getElementById("cambiar_horario").setAttribute("style", "display:block");
}
