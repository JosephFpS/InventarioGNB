document.addEventListener("DOMContentLoaded", function () {
    initMenuToggle();
    initSubmenuToggle();
});

function initMenuToggle() {
    let menuToggle = document.getElementById("menu-toggle");

    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            document.body.classList.toggle("sidebar-active");
        });
    }
}



function initSubmenuToggle() {
    document.querySelectorAll(".submenu-toggle").forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();

            let parent = this.parentElement;
            let submenu = parent.querySelector(".submenu");
            let icon = this.querySelector(".submenu-icon i");

            // Cerrar todos los submenús activos excepto el seleccionado
            document.querySelectorAll(".submenu-active").forEach(activeItem => {
                if (activeItem !== parent) {
                    activeItem.classList.remove("submenu-active");
                    let activeSubmenu = activeItem.querySelector(".submenu");
                    let activeIcon = activeItem.querySelector(".submenu-icon i");

                    if (activeSubmenu) {
                        activeSubmenu.style.display = "none";
                    }
                    if (activeIcon) {
                        activeIcon.style.transform = "rotate(0deg)";
                    }
                }
            });

            // Alternar el submenú actual
            parent.classList.toggle("submenu-active");

            if (submenu.style.display === "block") {
                submenu.style.display = "none";
                icon.style.transform = "rotate(0deg)";
            } else {
                submenu.style.display = "block";
                icon.style.transform = "rotate(180deg)";
            }
        });
    });
}
