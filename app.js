// Pour stocker les pokemon
let allPokemon = [];
// Pour stocker les pokemon avec un nom français et une image
let tableauFIn = [];
const searchInput = document.querySelector('.recherche-poke input');
const listePoke = document.querySelector('.liste-poke');
const chargement = document.querySelector('.loader');

const types = {
    grass: '#78c850',
	ground: '#E2BF65',
	dragon: '#6F35FC',
	fire: '#F58271',
	electric: '#F7D02C',
	fairy: '#D685AD',
	poison: '#966DA3',
	bug: '#B3F594',
	water: '#6390F0',
	normal: '#D9D5D8',
	psychic: '#F95587',
	flying: '#A98FF3',
	fighting: '#C25956',
    rock: '#B6A136',
    ghost: '#735797',
    ice: '#96D9D6'
};

// On va faire un appelle a l'api et recup les donné (avec la fonction fetch)
function fetchPokemonBase(){
        // Premiere requête
    fetch("https://pokeapi.co/api/v2/pokemon?limit=251")
    // une fois que celle ci est résolut je fait une autre je passe ces donné en format json
    .then(reponse => reponse.json())
    // 3eme promesse on va les logué 
    .then((allPoke)=> {
        console.log(allPoke);
        // Pour chaque element du tableau faut appeller une méthode
        allPoke.results.forEach((pokemon) =>{
            fetchPokemonComplet(pokemon);
        })
    })
}
fetchPokemonBase();
// une fois qu'on a chaque élément du tableau avec la méthode on créer une fonction (function)
function fetchPokemonComplet(pokemon){
    // on créer un objet vide qui contient le tout
    let objPokemonFull = {}
    //  On mais dans une variable ce qu'on a obtenue dans le log 
    let url = pokemon.url;
    let nameP = pokemon.name;
// On fait un apelle a l'api pour recup toute les caratèristique des pokemon 
    fetch(url)
    // on fait une promesse pour afficher notre apelle en format json
    .then(reponse => reponse.json())
    // puis une deuxieme pour les afficher dans notre console
    .then((pokeData) => {
        // console.log(pokeData)
        // On stock l'image dans notre objet vide créer plus haut
        objPokemonFull.pic = pokeData.sprites.front_default;
        // On stock le type du pokemon dans notre objet vide créer plus haut 
        objPokemonFull.type = pokeData.types[0].type.name;
        // On récupérer l'id des pokemon pour pouvoir les classer dans l'ordre
        objPokemonFull.id = pokeData.id;
        // On va faire un apelle a l'api pour chercher le nom en fr
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameP}`)
        .then(reponse => reponse.json())
        .then((pokeData) =>{
            // console.log(pokeData);
            objPokemonFull.name=pokeData.names[4].name;
            // On remplis notre tableau avec le nom des pokemon en fr
            allPokemon.push(objPokemonFull);
            
            if(allPokemon.length === 251 ){
                // console.log(allPokemon);
               
                // pour trier le tableau par id 
                tableauFIn = allPokemon.sort((a,b) => {
                    return a.id - b.id; 
                }).slice(0,21); //on découpe le tableau pour afficher juste les 21 premier pokemon
                console.log(tableauFIn);

                creatCard(tableauFIn);
                chargement.style.display ="none";

            }
        })
        

    })
}

// creation de carte 

function creatCard(arr){
    for(let i = 0 ; i <arr.length; i++){
        // Manip de dom on créer un élément au dom (ici li)
        const carte = document.createElement('li')
        // 
        let couleur = types[arr[i].type];
        carte.style.background = couleur;
        const textCarte = document.createElement('h5');
        textCarte.innerText = arr[i].name;
        const idCarte = document.createElement('p');
        idCarte.innerText = `ID# ${arr[i].id}`;
        const imgCarte = document.createElement('img')
        imgCarte.src = arr[i].pic;

        // rajoute des enfant a notre li
        carte.appendChild(imgCarte);
        carte.appendChild(textCarte);
        carte.appendChild(idCarte);
        // puis injecte le tout 
        listePoke.appendChild(carte);

    }
}

// Scroll infini
// on écoute un évenement sur notre page (window)
window.addEventListener('scroll', () => {

    // scrollTop différence de se qu'on a scroller depuis le top , scrollHeigth la hauteur total de notre site, clienHeigth la hauteur de ce qu'on vois
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

    console.log(scrollTop, scrollHeight,clientHeight);
    if(clientHeight + scrollTop >= scrollHeight - 20) {
        addPoke(6);
    }
})

let index = 21;
// on affiche 6 nouveau pokemon quand scroll ver le bas pour se faire on prend les 21 premiere carte et on ajoute 6 
function addPoke(nb) {
    if(index > 251) {
        return;
    }
    const arrToAdd = allPokemon.slice(index, index + nb);
    // On apelle notre fonction qui créer des carte avec la fonction qui ajoute les 6 suivants 
    creatCard(arrToAdd);
    // pour que index s'actualise a chaque fois 
    index += nb; 

}

// Recherche 
// On va écouter un evenement 
searchInput.addEventListener('keyup', recherche);

// si on veut utiliser le bouton recherche 
// const formRecherche = document.querySelector('form');

// formRecherche.addEventListener('submit', (e) => {
//     e.preventDefault();
//     recherche();
// })

function recherche(){

    if(index < 251) {
        addPoke(230);
    }

    let filter, allLi, titleValue, allTitles;
    filter = searchInput.value.toUpperCase();
    allLi = document.querySelectorAll('li');
    allTitles = document.querySelectorAll('li > h5');
    
    
    for(i = 0; i < allLi.length; i++) {

        titleValue = allTitles[i].innerText;

        if(titleValue.toUpperCase().indexOf(filter) > -1) {
            allLi[i].style.display = "flex";
        } else {
            allLi[i].style.display = "none";
        }

    }

}






// animation de l'input 
searchInput.addEventListener('input', function(e) {

    if(e.target.value !== "") {
        e.target.parentNode.classList.add('active-input');
    } else if (e.target.value === "") {
        e.target.parentNode.classList.remove('active-input');
    }
})
