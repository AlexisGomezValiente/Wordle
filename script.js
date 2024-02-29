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

let palabraCorrecta = "HOGAR";
let palabraCorrArr = palabraCorrecta.split("");
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
                resultadoH2.style.display = "block";
                error.style.display = "block";
            }
        }
    }else{
        perdio();
    }
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
    let elementoBuscado = copiaPalabraIntento[indice];
    if(copiaPalabraArr.includes(elementoBuscado) && copiaPalabraIntento[indice] != copiaPalabraArr[indice]){
        let indiceEncontrado = copiaPalabraArr.indexOf(elementoBuscado);
        if(copiaPalabraIntento[indiceEncontrado] != copiaPalabraArr[indiceEncontrado]){

            copiaPalabraIntento.splice(indiceEncontrado, 1)
            copiaPalabraArr.splice(indiceEncontrado, 1);

            return true;
        }
    }

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