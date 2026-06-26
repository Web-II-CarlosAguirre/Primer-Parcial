// agregar-entrenador.js — maneja el formulario para crear un entrenador

document.addEventListener("DOMContentLoaded", () => {

    const form    = document.getElementById("formEntrenador");
    const alerta  = document.getElementById("alertaExito");
    const fotoUrl = document.getElementById("fotoUrl");
    const preview = document.getElementById("previewFoto");

    // Vista previa de la foto en tiempo real
    fotoUrl.addEventListener("input", () => {
        const url = fotoUrl.value.trim();
        if (url) {
            preview.src = url;
            preview.classList.remove("d-none");
        } else {
            preview.classList.add("d-none");
        }
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const entrenador = {
            nombre:     document.getElementById("nombre").value.trim(),
            sexo:       document.getElementById("sexo").value,
            residencia: document.getElementById("residencia").value.trim(),
            foto:       fotoUrl.value.trim()
        };

        agregarEntrenador(entrenador)
            .then(() => {
                alerta.classList.remove("d-none");
                form.reset();
                preview.classList.add("d-none");
                setTimeout(() => {
                    window.location.href = "entrenadores.html";
                }, 1500);
            })
            .catch(err => {
                console.error("Error guardando entrenador:", err);
                alert("Ocurrió un error al guardar. Revisá la consola.");
            });
    });
});
