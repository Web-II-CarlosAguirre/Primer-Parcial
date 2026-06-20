const pokemonList = document.getElementById("pokemonList");
const generationSelect = document.getElementById("generation");

window.onload = () => {
    cargarGeneracion(0,151);
};

generationSelect.addEventListener("change", function(){

    let valores = this.value.split(",");

    cargarGeneracion(valores[0], valores[1]);

});

function cargarGeneracion(offset, limit){

    pokemonList.innerHTML = `
        <div class="text-center">
            <div class="spinner-border"></div>
        </div>
    `;

    let xhr = new XMLHttpRequest();

    xhr.open(
        "GET",
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );

    xhr.onload = function(){

        if(xhr.status == 200){

            let data = JSON.parse(xhr.responseText);

            mostrarPokemons(data.results);

        }

    };

    xhr.send();

}

function mostrarPokemons(lista){

    pokemonList.innerHTML = "";

    lista.forEach((pokemon,index)=>{

        let nombre = pokemon.name;

        let partes = pokemon.url.split("/");

        let numero = partes[6];

        let card = document.createElement("div");

        card.className = "col-lg-2 col-md-3 col-6";

        card.innerHTML = `
        <div class="card h-100">

    <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${numero}.png"
        class="card-img-top"
    >

         <div class="card-body text-center">
          <h6>${nombre.toUpperCase()}</h6>
         </div>

    </div>
    `;

        card.addEventListener("click", ()=>{

            detallePokemon(nombre);

        });

        pokemonList.appendChild(card);



        function detallePokemon(nombre){

    let xhr = new XMLHttpRequest();

    xhr.open(
        "GET",
        `https://pokeapi.co/api/v2/pokemon/${nombre}`
    );

    xhr.onload = function(){

        if(xhr.status == 200){

            let pokemon = JSON.parse(xhr.responseText);

            document.getElementById("pokemonTitle").innerText =
                pokemon.name.toUpperCase();

            document.getElementById("pokemonImage").src =
                pokemon.sprites.other["official-artwork"].front_default;

            document.getElementById("pokemonInfo").innerHTML =
                `
                <strong>ID:</strong> ${pokemon.id}<br>
                <strong>Altura:</strong> ${pokemon.height}<br>
                <strong>Peso:</strong> ${pokemon.weight}
                `;

            let tipos = pokemon.types.map(t=>t.type.name);
            document.getElementById("pokemonTypes").innerText =
                tipos.join(" - ");

            let habilidades = pokemon.abilities.map(a=>a.ability.name);
            document.getElementById("pokemonAbilities").innerText =
                habilidades.join(" - ");

            let movimientos = pokemon.moves
                .slice(0,15)
                .map(m=>m.move.name);

            document.getElementById("pokemonMoves").innerText =
                movimientos.join(" - ");

            let modal = new bootstrap.Modal(
                document.getElementById("pokemonModal")
            );

            modal.show();

        }

    };

    xhr.send();

}

    });

}