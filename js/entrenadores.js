// entrenadores.js — carga y muestra la lista de entrenadores desde IndexedDB

document.addEventListener("DOMContentLoaded", () => {
    abrirDB().then(() => cargarEntrenadores());
});

function cargarEntrenadores() {
    obtenerEntrenadores().then(lista => {
        const contenedor = document.getElementById("listaEntrenadores");

        if (lista.length === 0) {
            contenedor.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-muted fs-5">No hay entrenadores registrados todavía.</p>
                    <a href="agregar-entrenador.html" class="btn btn-warning fw-bold mt-2">
                        + Agregar primer entrenador
                    </a>
                </div>`;
            return;
        }

        contenedor.innerHTML = "";

        lista.forEach(e => {
            const col = document.createElement("div");
            col.className = "col-lg-3 col-md-4 col-sm-6";
            col.innerHTML = `
                <div class="card h-100 shadow-sm trainer-card">
                    <img src="${e.foto || 'https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/normal/pikachu.png'}"
                         class="card-img-top trainer-img" alt="${e.nombre}">
                    <div class="card-body text-center">
                        <h5 class="card-title mb-1">${e.nombre}</h5>
                        <span class="badge ${e.sexo === 'M' ? 'bg-primary' : 'bg-danger'} mb-2">
                            ${e.sexo === 'M' ? '♂ Masculino' : '♀ Femenino'}
                        </span>
                        <p class="text-muted small mb-0">
                            <i class="bi bi-geo-alt-fill"></i> ${e.residencia}
                        </p>
                    </div>
                </div>`;
            contenedor.appendChild(col);
        });
    }).catch(err => {
        console.error("Error cargando entrenadores:", err);
    });
}
