let inputPalabra = document.getElementById("palabra");
let intentar = document.getElementById("intentar");
let divResultados = document.getElementById("resultados");
let resultadoH2 = document.getElementById("resultadoH2");
let perdiste = document.getElementById("perdiste");
let textDiv = document.getElementsByClassName("textDiv");
let resultadosPalabras = document.getElementById("palabrasRes");
let reiniciar = document.getElementById("reiniciar");
let error = document.getElementById("error");
let ganaste = document.getElementById("ganaste");

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
        let pText = document.createElement("p");
        pText.classList.add("text");

        let verificar = verificarRepetidos(i, copiaPalabraArr, copiaPalabraIntento);
        if(verificar){
            pText.classList.add("contiene");
        }

        if(palabraArr[i] == palabraCorrArr[i]){
            pText.classList.add("correcto");
        }

        pText.textContent = palabraArr[i];
        divText.appendChild(pText);
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

intentar.addEventListener("click", agregaIntento)

inputPalabra.addEventListener("keypress", (e) => {
    if (e.key == "Enter") agregaIntento() 
});

reiniciar.addEventListener("click", reinicio)