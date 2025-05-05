document.getElementById("btn-toggle-form").addEventListener("click", function() {
    document.querySelector(".formulario").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    // Bloquear el scroll de la página y permitirlo solo en el formulario
    document.body.classList.add("form-open");
});

document.getElementById("close-form").addEventListener("click", function() {
    document.querySelector(".formulario").style.display = "none";
    document.getElementById("overlay").style.display = "none";

    // Restaurar el scroll de la página al cerrar el formulario
    document.body.classList.remove("form-open");
});

document.getElementById("btn-close-form").addEventListener("click", function() {
    document.querySelector(".formulario").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    document.body.classList.remove("form-open");
    document.body.classList.remove("force-scroll");
});



// ---------------------------- BUSCAR UN DATO EN LA PAGINA ---------------------------- // 
function normalizeString(str) {
    // Normaliza la cadena eliminando las tildes y convirtiendo a minúsculas
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}


document.getElementById("searchInput").addEventListener("input", function() {
    let searchValue = normalizeString(this.value);  // Normaliza el texto de búsqueda
    let rows = document.querySelectorAll("#userTableBody tr");
    
    rows.forEach(function(row) {
        let cells = row.getElementsByTagName("td");
        let showRow = false;

        // Verifica si algún campo en la fila coincide con el valor de búsqueda
        for (let i = 0; i < cells.length; i++) {
            if (normalizeString(cells[i].textContent).includes(searchValue)) {
                showRow = true;
                break;
            }
        }

        // Mostrar u ocultar la fila dependiendo de la búsqueda
        if (showRow) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});

// ---------------------------- BUSCAR UN DATO EN LA PAGINA ---------------------------- // 