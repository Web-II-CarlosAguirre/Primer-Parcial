// equipos.js — lista los equipos y muestra el detalle en un modal

document.addEventListener("DOMContentLoaded", () => {
    abrirDB().then(() => cargarEquipos());
});

function cargarEquipos() {
    obtenerEquipos().then(equipos => {
        const contenedor = document.getElementById("listaEquipos");

        if (equipos.length === 0) {
            contenedor.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-muted fs-5">No hay equipos registrados todavía.</p>
                    <a href="agregar-equipo.html" class="btn btn-warning fw-bold mt-2">
                        + Crear primer equipo
                    </a>
                </div>`;
            return;
        }

        contenedor.innerHTML = "";

        equipos.forEach(eq => {
            const col = document.createElement("div");
            col.className = "col-lg-3 col-md-4 col-sm-6";
            col.innerHTML = `
                <div class="card h-100 shadow-sm team-card" style="cursor:pointer"
                     data-id="${eq.id}">
                    <img src="${eq.imagen || 'https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/normal/pokeball.png'}"
                         class="card-img-top team-img" alt="${eq.nombre}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${eq.nombre}</h5>
                        <p class="text-muted small">${eq.pokemons.length} Pokémon(s)</p>
                        <button class="btn btn-sm btn-outline-warning">Ver detalle</button>
                    </div>
                </div>`;

            col.addEventListener("click", () => mostrarDetalleEquipo(eq));
            contenedor.appendChild(col);
        });
    });
}

function mostrarDetalleEquipo(equipo) {
    // Buscar el entrenador en IndexedDB
    obtenerEntrenadorPorId(Number(equipo.entrenadorId)).then(entrenador => {

        document.getElementById("modalEquipoNombre").textContent = equipo.nombre;

        // Info del entrenador
        const seccionEntrenador = document.getElementById("modalEntrenadorInfo");
        if (entrenador) {
            seccionEntrenador.innerHTML = `
                <div class="d-flex align-items-center gap-3 mb-3">
                    <img src="${entrenador.foto}" class="rounded-circle"
                         style="width:64px;height:64px;object-fit:cover"
                         alt="${entrenador.nombre}">
                    <div>
                        <strong>${entrenador.nombre}</strong><br>
                        <span class="badge ${entrenador.sexo === 'M' ? 'bg-primary' : 'bg-danger'}">
                            ${entrenador.sexo === 'M' ? '♂ Masculino' : '♀ Femenino'}
                        </span>
                        <span class="ms-2 text-muted small">${entrenador.residencia}</span>
                    </div>
                </div>`;
        } else {
            seccionEntrenador.innerHTML = `<p class="text-muted">Entrenador no encontrado.</p>`;
        }

        // Lista de Pokémons con imagen
        const listaPk = document.getElementById("modalPokemonLista");
        listaPk.innerHTML = `<div class="text-center"><div class="spinner-border spinner-border-sm"></div></div>`;

        // Cargar imágenes de cada Pokémon vía XMLHttpRequest
        listaPk.innerHTML = "";
        equipo.pokemons.forEach(nombre => {
            const item = document.createElement("div");
            item.className = "col-4 col-sm-3 col-md-2 text-center";
            item.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonNumber(nombre)}.png"
                     class="img-fluid mb-1" style="height:80px;object-fit:contain"
                     alt="${nombre}"
                     onerror="this.src='https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/normal/${nombre}.png'">
                <p class="small text-capitalize mb-0">${nombre}</p>`;
            listaPk.appendChild(item);
        });

        const modal = new bootstrap.Modal(document.getElementById("equipoModal"));
        modal.show();
    });
}

// Pequeño helper: si el usuario guardó el número lo usamos directo, si no cargamos por nombre
function getPokemonNumber(nombreONumero) {
    // Si es numérico retorna el número, si no retorna el nombre para la URL alternativa
    return isNaN(nombreONumero) ? nombreONumero : String(nombreONumero).padStart(3, "0");
}
