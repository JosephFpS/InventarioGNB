
// ----------------------------DEJA LIMPIO EL FORMULARIO ---------------------------- //
document.getElementById("btn-toggle-form").addEventListener("click", function() {
    // Limpiar los campos del formulario
    document.getElementById("idEquipo").value = "";
    document.getElementById("nombreEquipo").value = "";
    document.getElementById("fechaRecepcion").value = "";
    document.getElementById("fechaSalida").value = "";
    document.getElementById("ubicacionEnvio").value = "";
    document.getElementById("ubicacionActual").value = "";
    document.getElementById("ip").value = "";
    document.getElementById("modelo").value = "";
    document.getElementById("marca").value = "";
    document.getElementById("serial").value = "";
    document.getElementById("tipoDispositivo").value = "";
    document.getElementById("observaciones").value = "";

    // Mostrar el formulario
    document.querySelector(".formulario").style.display = "block";
    document.getElementById("overlay").style.display = "block";
});


// ---------------------------- BOTON DE EDITAR, LLEMA LOS CAMPOS DEL REGISTRO AL QUE SE SELECCIONA---------------------------- //
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".btn-warning.btn-sm").forEach(button => {
        button.addEventListener("click", function () {
            let row = this.closest("tr");
            document.getElementById("idEquipo").value = row.cells[0].textContent.trim();
            document.getElementById("nombreEquipo").value = row.cells[1].textContent.trim();
            document.getElementById("fechaRecepcion").value = row.cells[2].textContent.trim();
            document.getElementById("fechaSalida").value = row.cells[3].textContent.trim();
            document.getElementById("ubicacionEnvio").value = row.cells[4].textContent.trim();
            document.getElementById("ubicacionActual").value = row.cells[5].textContent.trim();
            document.getElementById("ip").value = row.cells[6].textContent.trim();
            document.getElementById("modelo").value = row.cells[7].textContent.trim();
            document.getElementById("marca").value = row.cells[8].textContent.trim();
            document.getElementById("serial").value = row.cells[9].textContent.trim();
            document.getElementById("tipoDispositivo").value = row.cells[10].textContent.trim();
            document.getElementById("observaciones").value = row.cells[11].textContent.trim();

            document.querySelector(".formulario").style.display = "block";
            document.getElementById("overlay").style.display = "block";
        });
    });
});

