
// ----------------------------DEJA LIMPIO EL FORMULARIO ---------------------------- //
document.getElementById("btn-toggle-form").addEventListener("click", function() {
    let formulario = document.querySelector(".formulario");
    
    // Limpiar los campos cuando se abre el formulario para agregar un nuevo usuario
    document.getElementById("cedusu").value = "";
    document.getElementById("emailusu").value = "";
    document.getElementById("nomusu").value = "";
    document.getElementById("usu").value = "";
    document.getElementById("password").value = "";

    formulario.style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.body.classList.add("form-open");
});


// ---------------------------- BOTON DE EDITAR, LLEMA LOS CAMPOS DEL REGISTRO AL QUE SE SELECCIONA---------------------------- //
document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", function() {
        let fila = this.closest("tr");
        let cedula = fila.cells[0].textContent;
        let nombre = fila.cells[1].textContent;
        let email = fila.cells[2].textContent;
        let usuario = fila.cells[3].textContent;

        // Llenar el formulario con los datos del usuario seleccionado
        document.getElementById("cedusu").value = cedula;
        document.getElementById("emailusu").value = email;
        document.getElementById("nomusu").value = nombre;
        document.getElementById("usu").value = usuario;
        document.getElementById("password").value = ""; // Se deja vacío por seguridad

        // Mostrar el formulario
        document.querySelector(".formulario").style.display = "block";
        document.getElementById("overlay").style.display = "block";
    });
});
