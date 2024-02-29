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

    let copiaPalabraArr = palabraCorrArr.map(e => e);
    let copiaPalabraIntento = palabraArr.map(e => e);

    for(let i = 0; i < palabraArr.length; i++){
        let spanText = document.createElement("span");
        spanText.classList.add("text");

        let verificar = verificarRepetidos(i, copiaPalabraArr, copiaPalabraIntento);
        if(verificar){
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

const verificarRepetidos = (indice, copiaPalabraArr, copiaPalabraIntento) => {
    //?Aqui lo que hago es guardar el elemento en el indice recibido por parametro
    //?Lo busco en la palabra del intento
    let elementoBuscado = copiaPalabraIntento[indice];

    //?Pregunto si la palabra correcta incluye el elementoBuscado y si el contenido
    //?del intento y la correcta en ese indice recibido por parametro son diferentes
    if(copiaPalabraArr.includes(elementoBuscado) && copiaPalabraIntento[indice] != copiaPalabraArr[indice]){

        //?Guardo el indice donde se encuentra la coincidencia en la palabra correcta
        //?Osea en que indice encuentra el elementoBuscado en la palabra correcta
        let indiceEncontrado = copiaPalabraArr.indexOf(elementoBuscado);

        //?Pregunto si el contenido del intento y la correcta en el indice donde se
        //?encuentro el elementoBuscado en la palabra correcta son diferentes 
        if(copiaPalabraIntento[indiceEncontrado] != copiaPalabraArr[indiceEncontrado]){

            //?Entonces elimino ese elemento para que luego no lo vuelva a encontrar
            //?Y no lo pinte devuelta en NARANJA
            copiaPalabraArr.splice(indiceEncontrado, 1);

            //?Si entro hasta aqui significa que encontro coincidencias y las elimino
            //?Y retorna true para su posterior verificacion en la funcion crearDivText()
            return true;
        }
    }

    //?Retorna false si la palabra correcta no incluye el elementoBuscado O si el elemento
    //?en la palabra correcta y la palabra intento son iguales(significa que es correcto)
    return false;
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