// agregar-equipo.js — formulario para crear un equipo Pokémon

const pokemonesSeleccionados = [];  // máx 6

document.addEventListener("DOMContentLoaded", () => {
    abrirDB().then(() => {
        cargarEntrenadoresEnSelect();
        inicializarBuscador();
    });

    document.getElementById("formEquipo").addEventListener("submit", guardarEquipo);
});

// ─── SELECT DE ENTRENADORES ───────────────────────────────────────────────────

function cargarEntrenadoresEnSelect() {
    obtenerEntrenadores().then(lista => {
        const sel = document.getElementById("entrenadorSelect");
        sel.innerHTML = `<option value="">-- Seleccioná un entrenador --</option>`;
        lista.forEach(e => {
            const opt = document.createElement("option");
            opt.value = e.id;
            opt.textContent = e.nombre;
            sel.appendChild(opt);
        });
        if (lista.length === 0) {
            sel.innerHTML = `<option value="">No hay entrenadores — creá uno primero</option>`;
        }
    });
}

// ─── BUSCADOR DE POKÉMON ──────────────────────────────────────────────────────

function inicializarBuscador() {
    const input    = document.getElementById("buscarPokemon");
    const sugerido = document.getElementById("sugerenciasPokemon");

    input.addEventListener("input", () => {
        const query = input.value.trim().toLowerCase();
        sugerido.innerHTML = "";
        if (query.length < 2) return;

        // Buscar en la API
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `https://pokeapi.co/api/v2/pokemon/${query}`);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const pk = JSON.parse(xhr.responseText);
                agregarSugerencia(pk.name, pk.id);
            } else {
                sugerido.innerHTML = `<small class="text-muted">Pokémon no encontrado.</small>`;
            }
        };
        xhr.onerror = () => {
            sugerido.innerHTML = `<small class="text-danger">Error de conexión.</small>`;
        };
        xhr.send();
    });
}

function agregarSugerencia(nombre, id) {
    const contenedor = document.getElementById("sugerenciasPokemon");
    contenedor.innerHTML = "";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-outline-secondary btn-sm d-flex align-items-center gap-2";
    btn.innerHTML = `
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png"
             style="width:40px;height:40px;object-fit:contain">
        <span class="text-capitalize">${nombre}</span>
        <span class="badge bg-warning text-dark ms-auto">+ Agregar</span>`;

    btn.addEventListener("click", () => {
        if (pokemonesSeleccionados.length >= 6) {
            alert("El equipo ya tiene el máximo de 6 Pokémon.");
            return;
        }
        if (pokemonesSeleccionados.find(p => p.nombre === nombre)) {
            alert(`${nombre} ya está en el equipo.`);
            return;
        }
        pokemonesSeleccionados.push({ nombre, id });
        actualizarListaSeleccionados();
        document.getElementById("buscarPokemon").value = "";
        contenedor.innerHTML = "";
    });

    contenedor.appendChild(btn);
}

function actualizarListaSeleccionados() {
    const lista = document.getElementById("pokemonesElegidos");
    lista.innerHTML = "";

    pokemonesSeleccionados.forEach((pk, i) => {
        const item = document.createElement("div");
        item.className = "d-flex align-items-center gap-2 mb-2 p-2 border rounded bg-light";
        item.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pk.id}.png"
                 style="width:48px;height:48px;object-fit:contain">
            <span class="text-capitalize flex-grow-1 fw-semibold">${pk.nombre}</span>
            <button type="button" class="btn btn-sm btn-outline-danger"
                    data-index="${i}">✕ Quitar</button>`;

        item.querySelector("button").addEventListener("click", () => {
            pokemonesSeleccionados.splice(i, 1);
            actualizarListaSeleccionados();
        });

        lista.appendChild(item);
    });

    document.getElementById("contadorPk").textContent =
        `${pokemonesSeleccionados.length}/6 Pokémon seleccionados`;
}

// ─── GUARDAR ──────────────────────────────────────────────────────────────────

function guardarEquipo(e) {
    e.preventDefault();

    if (pokemonesSeleccionados.length === 0) {
        alert("Agregá al menos un Pokémon al equipo.");
        return;
    }

    const entrenadorId = document.getElementById("entrenadorSelect").value;
    if (!entrenadorId) {
        alert("Seleccioná un entrenador.");
        return;
    }

    const equipo = {
        nombre:       document.getElementById("nombreEquipo").value.trim(),
        imagen:       document.getElementById("imagenEquipo").value.trim(),
        entrenadorId: Number(entrenadorId),
        pokemons:     pokemonesSeleccionados.map(p => p.nombre)
    };

    agregarEquipo(equipo).then(() => {
        document.getElementById("alertaExito").classList.remove("d-none");
        setTimeout(() => window.location.href = "equipos.html", 1500);
    }).catch(err => {
        console.error(err);
        alert("Error al guardar el equipo.");
    });
}
