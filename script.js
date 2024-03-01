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
let arrSecundario = ["POLVO"];
let indiceRandom = 0;
const URLFetch = "https://rrandom-word-api.herokuapp.com/word?number=1&length=5&lang=es";

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

    for(let i = 0; i < palabraArr.length; i++){
        let spanText = document.createElement("span");
        spanText.classList.add("text");

        if(repetidos.includes(i)){
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

const contarLetrasDiferentes = (string) => {
    let letrasSet = new Set();
    for (let letra of string) {
        letrasSet.add(letra);
    }
    return Array.from(letrasSet);
}

//*Esta es la funcion que verifica los repetidos y que pinte en NARANJA de forma correcta
//*Y que no pinte demas las letras
const verificarRepetidos = (palabraArr) => {
    //?Aca creo un array auxiliar donde voy a guardar los repetidos que se encuentran en 
    //?en la palabra correcta
    let arrRepetidos = [];
    let arrObjCantidadesIntento = [];
    let arrObjCantidadesCorrecto = [];
    let cadena = palabraArr.join("")

    let letrasDiferentesIntento = contarLetrasDiferentes(cadena);

    let letrasDiferentesCorrecta = contarLetrasDiferentes(palabraCorrecta);
    
    letrasDiferentesIntento.forEach((element) => {
        let cantidadRepe = palabraArr.filter((e) => e == element);
        let indices = palabraArr.map((e, i) => {
            if(e == element) return i;
        });
        arrObjCantidadesIntento.push({
            elemento: element,
            cantidad: cantidadRepe.length,
            indices: indices
        })
    })

    letrasDiferentesCorrecta.forEach((element) => {
        let cantidadRepe = palabraCorrArr.filter((e) => e == element);
        let indices = palabraCorrArr.map((e, index) => {
            if(e == element){
                return index
            };
        });
        arrObjCantidadesCorrecto.push({
            elemento: element,
            cantidad: cantidadRepe.length,
            indices: indices
        })
    })

    console.log(arrObjCantidadesCorrecto);
    console.log(arrObjCantidadesIntento);

    arrObjCantidadesIntento.forEach(ele => {
        let elemento = ele.elemento;
        let indices = ele.indices.filter(e => e != undefined);
        let indicesCorrectos = [];
        
        arrObjCantidadesCorrecto.forEach((e, i) => {
            if(e.elemento == elemento){
                e.indices.forEach(e => {
                    if(e != undefined) indicesCorrectos.push(e);
                });
            }
        });

        let cantidadIndicesIguales = indices.filter(e => indicesCorrectos.includes(e));
        
        let cantidadCorrecta = arrObjCantidadesCorrecto.map(e => {
            if(e.elemento == elemento) return e.cantidad;
        });
        cantidadCorrecta = cantidadCorrecta.filter(e => e != undefined);

        let indicesDesiguales = indices.filter(e => !indicesCorrectos.includes(e));

        if(cantidadCorrecta != cantidadIndicesIguales.length){
            if(cantidadCorrecta[0]){
                let cantidadFaltante = cantidadCorrecta[0] - cantidadIndicesIguales.length;
                for (let index = 0; index < cantidadFaltante; index++) {
                    arrRepetidos.push(indicesDesiguales[index]);
                }
            }
        }
    });

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