const accederDom = (id) => {
    return document.getElementById(id);
};

let inputPalabra = accederDom("palabra");
let intentar = accederDom("intentar");
let divResultados = accederDom("resultados");
let resultadoH2 = accederDom("resultadoH2");
let perdiste = accederDom("perdiste");
let textDiv = accederDom("textDiv");
let resultadosPalabras = accederDom("palabrasRes");
let reiniciar = accederDom("reiniciar");
let error = accederDom("error");
let ganaste = accederDom("ganaste");

let palabraCorrecta = "";
let palabraCorrArr = [];
let arrSecundario = ["HOGAR", "BUENO", "HORNO", "JARRO", "LAPIZ"];
let indiceRandom = 0;
const URLFetch = "https://random-word-api.herokuapp.com/word?number=1&length=5&lang=es";

const cambioPalabra = () => {
    fetch(URLFetch)
    .then(res => res.json())
    .then(data => {
        palabraCorrecta = data[0].toUpperCase();
        palabraCorrArr = palabraCorrecta.split("");
        console.log(palabraCorrecta);
    })
    .catch(err => {
        console.log(err);
        indiceRandom = Math.floor(Math.random() * arrSecundario.length); 
        palabraCorrecta = arrSecundario[indiceRandom].toUpperCase();
        palabraCorrArr = palabraCorrecta.split("");
        console.log(palabraCorrecta)
    });
}

cambioPalabra();

let intentos = 0;
let gano = false;

const agregaIntento = () => {
    resultadoH2.style.display = "none";

    if(intentos <= 5){
        if(gano == false){
            let palabra = inputPalabra.value;
        
            if(palabra.length == 5){
                intentos += 1;
                error.style.display = "none";
                let palabraMayus = palabra.toUpperCase()

                if(palabraMayus == palabraCorrecta){
                    gana();
                }

                let palabraArr = palabraMayus.split("");
                let divText = crearDivText(palabraArr);
            
                resultadosPalabras.appendChild(divText);
            }else{
                error.style.display = "block";
            }
        }
    }else{
        perdio();
    }

    inputPalabra.value = "";
}

const crearDivText = (palabraArr) => {
    let divText = document.createElement("div");
    divText.classList.add("textDiv");

    let repetidos = verificarRepetidos(palabraArr);
    let indicesDeRepetidos = repetidos.map(e => e.indice);

    for(let i = 0; i < palabraArr.length; i++){
        let spanText = document.createElement("span");
        spanText.classList.add("text");

        if(indicesDeRepetidos.includes(i)){
            spanText.classList.add("contiene");
        }

        if(palabraArr[i] == palabraCorrArr[i]){
            spanText.classList.add("correcto");
        }

        spanText.textContent = palabraArr[i];
        divText.appendChild(spanText);
    }

    return divText;
}

//*Esta es la funcion que verifica los repetidos y que pinte en NARANJA de forma correcta
//*Y que no pinte demas las letras
const verificarRepetidos = (palabraArr) => {
    //?Aca creo un array auxiliar donde voy a guardar los repetidos que se encuentran en 
    //?en la palabra correcta
    let arrRepetidos = [];

    //?Recorro la palabra ingresada por el usuario
    palabraArr.forEach((element, i) => {
        //?Verifico cuantos repetidos existen sobre este ELEMENT en la palabra correcta
        let cantidadRepe = palabraCorrArr.filter(e => e == element).length;

        //?Verifico cuantos repetidos existen sobre este ELEMENT en la palabra ingresada
        let cantidadRepeActual = arrRepetidos.filter(e => e.elemento == element).length;

        //?Si la palabra correcta incluye este elemento y en ese indice no son iguales
        //?las letras respecto al ingresado por el usuario y la correcta y por ultimo
        //?Si la cantidad de este ELEMENT(Por ejemplo la letra H) es mayor que la cantidad 
        //?repetida actual agrega este elemento y su indice en un objeto siendo pusheado 
        //?al array auxiliar, si por ejemplo la cantidad de ELEMENT en la palabra ingresada
        //?ya no ingresara en este if
        if(palabraCorrArr.includes(element) && element != palabraCorrArr[i] && cantidadRepe > cantidadRepeActual){
            arrRepetidos.push({
                indice: i,
                elemento: element
            })
        }
    })

    //!Retorno el array de objetos para su posterior recorrido en la funcion crearDivText()
    return arrRepetidos;
}

const perdio = () => {
    resultadosPalabras.innerHTML = "";
    intentar.style.pointerEvents = "none";
    intentar.style.opacity = 0.5;
    perdiste.style.display = "block";
    reiniciar.style.pointerEvents = "auto";
    reiniciar.style.opacity = 1;
}

const reinicio = () => {
    gano = false;
    intentos = 0;
    reiniciar.style.pointerEvents = "none";
    reiniciar.style.opacity = 0.5;
    perdiste.style.display = "none";
    resultadoH2.style.display = "block";
    intentar.style.pointerEvents = "auto";
    intentar.style.opacity = 1;
    ganaste.style.display = "none";
    resultadosPalabras.innerHTML = "";
}

const gana = () => {
    gano = true;
    ganaste.style.display = "block";
    intentar.style.pointerEvents = "none";
    intentar.style.opacity = 0.5;
    reiniciar.style.pointerEvents = "auto";
    reiniciar.style.opacity = 1;
}

intentar.addEventListener("click", agregaIntento);

inputPalabra.addEventListener("keypress", (e) => {
    if (e.key == "Enter") agregaIntento(); 
});

reiniciar.addEventListener("click", reinicio);
reiniciar.addEventListener("click", cambioPalabra);