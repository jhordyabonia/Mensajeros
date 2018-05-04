function BodyOnLoad() {

    //alert(window.localStorage.getItem("UsuarioID"));

}
//Funcion para consumir servicio para el envio del PIN al correo electronico del cliente o un mensaje de texto.
function EnviarPinDeRegistro() {

    alert("Inicio");
    $.showLoading();

    console.log("Enviando");
    var i = 0;
    while (i >= 20000000) { i++; }

    alert("Finalizo");
    $.hideLoading();

}
function OnKeyPressEmail(input) {
    //if (validar_email(input)) { //metodo anterior; no valida caraccteres especiales en el correo 
    if (validateEmail(input)) {
        document.getElementById("error-popover-correo").style.display = 'none';
    } else {
        document.getElementById("error-popover-correo").style.display = 'block';
    }

}

function ValidarUsuario(email, clave) {

    if (!validar_email(email)) {
        $('#myModal').modal('show');
        $('#modal-mensaje').html("El usuario ingresado no es un correo electronico valido. Debes ingresar tu usuario en un formato como este: info@msn.com");
    }
    else {
        var Url = "http://hermesapi2018.azurewebsites.net/api/usuario/ValidarUsuario?user=" + email + "&pass=" + clave;
        $.showLoading();
        $.ajax({
            url: Url,
            type: "GET",
            success: function (data) {
                if (data.Usuario === null)
                {
                    $('#myModal').modal('show');
                    $('#modal-mensaje').html("Usuario o contraseña incorrectas. Modifique la información e intente nuevamente.");
                }
                else {
                    window.localStorage.setItem("UsuarioID", data.IdCliente);
                    window.location.replace("servicio-solicitud.html");
                }
                $.hideLoading();
            },
            error: function (jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'No se pudo establecer conexión con el Servidor';
                } else if (jqXHR.status == 404) {
                    msg = 'Activity no econtrado [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Error interno del servidor [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Solicitud a JSON fallo.';
                } else if (exception === 'timeout') {
                    msg = 'Tiempo de espera agotado';
                } else if (exception === 'abort') {
                    msg = 'Solicitud de Ajax terminada.';
                } else {
                    msg = 'Error no identificado' + jqXHR.responseText;
                }
                $('#myModal').modal('show');
                $('#modal-mensaje').html(msg);

                //console.log('error: ' + exception);
                //console.log(msg);

                $.hideLoading();
            }
        });
    }
};