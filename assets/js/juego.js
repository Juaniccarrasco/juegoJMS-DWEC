/**
 * Vamos a crear dos montones de tarjetas, uno de películas y otro de recursos relacionados:
 * 
 */
const NMOVIES = 5
const NELEMENTSPMOVIE = 3
let draggedElement= null
let turnos = 3
let draggedImg = null
let aciertos = 0

const btnMovieConfiguration = () => {
    const btnMovie = document.querySelector('#btnMovie')
    const divPelicula = document.querySelector("#pelicula-caratula")
    
    btnMovie.addEventListener('click', () => {
        turnos = 3
        iniciar()
        
        movieSelected = getElement(movieDeck)

        
        //Borramos la película antigua
        let oldMovie = document.querySelector("#pelicula-caratula img")
        if(oldMovie != null){
            divPelicula.removeChild(oldMovie)
            
        }
        let oldDianas = document.querySelectorAll('#pelicula-caratula .diana')
        if (oldDianas !=null){
            oldDianas.forEach (diana=> {
            divPelicula.removeChild(diana)
            })
        }
        
        //Borramos los elementos que haya desplegados de la película antigua
        const elementsDiv = document.querySelector('#elementos-pelicula')
        while(elementsDiv.firstChild) {
            elementsDiv.removeChild(elementsDiv.firstChild)
        }

        //Creamos de nuevo el montón de elementos
        elementDeck = getElementsDeck()
        //Creamos el elemento de la película
        const imgMovie = document.createElement('img');
        imgMovie.src = `assets/movies/${movieSelected}.jpg`
        imgMovie.classList.add('elemento')
        divPelicula.append(imgMovie)

        for (let index = 0; index < 3; index++) {
            let dianas = document.createElement('div')
            dianas.classList.add('diana')
            divPelicula.appendChild(dianas) 
              

            dianas.addEventListener('dragover', (e)=>{
                e.preventDefault();
            
            });
            
            dianas.addEventListener('drop', (e) => {
                e.preventDefault();
    
//*************************************************************** */                
                if (draggedElement) {
                    
                    // Comprobar si el contenedor dropable ya tiene un hijo con la clase 'dragable'
                    const existingDragable = dianas.querySelector('.elemento');
                    const elementos = document.querySelectorAll(".elemento")
                    if (!existingDragable) {
                        
                        let img = draggedElement.querySelector('img')
                        let elementName = img.src.split('/').pop() //Cojo el nombre de la imagen del elemento, sin la ruta completa
                        if (isElementOfMovie(elementName, movieSelected)){
                            // if (dianas.removeEventListener('drop'))
                            if (dianas.innerHTML.trim() === ""){
                                dianas.appendChild(draggedImg);
                                //draggedElement.setAttribute('draggable',false);
                                draggedElement.classList.remove('elemento')
                                draggedElement = null;
                                aciertos++
                                if(aciertos === NELEMENTSPMOVIE){
                                    const message = document.createElement('h1');
                                    message.textContent = '¡Has ganado el juego!';
                                    message.classList.add('detectableMessage')
                                    //document.header.appendChild(message);
                                    document.body.insertBefore(message, document.body.firstChild)
                                }
                                    
                                    //alert('Has ganado')
                            }
                        } 
                        else {
                            turnos--
                            gameOver()
                            
                        }
                        
                    }
                }
            
                
            });

        }

    })
}

const btnElementConfiguration = () => {
    const btnElement = document.querySelector('#btnElement')
    const divGlobal = document.querySelector("#elementos-pelicula")
    //const divTarjetas = document.querySelector('#pelicula-caratula')
    btnElement.addEventListener('click', () => {
        let element = getElement(elementDeck)
        //Creamos el elemento 
        const divElement = document.createElement('div')
        divElement.classList.add('elemento')

        const imgElement = document.createElement('img')
        imgElement.src = `assets/characters/${element}.jpg`
        imgElement.classList.add('recurso')
        divElement.append(imgElement)
        divGlobal.appendChild(divElement)

        imgElement.draggable = false;

        divElement.addEventListener('mouseup', selectEventListener)

        divElement.setAttribute('draggable',true);
        divElement.addEventListener('dragstart', (e)=>{
            e.dataTransfer.effectAllowed = "move";
            divElement.classList.add('dragging');
            draggedElement= divElement;
/* ///// */           draggedImg= imgElement;
            
        });

        divElement.addEventListener('dragend', () => {
            divElement.classList.remove('dragging');
        });

    });

    
        
};

    

const gameOver = () => {
     if (turnos == 0){

        const anulables = document.querySelector('#btnElement');
        anulables.disabled = true; // Desactivar el botón
        anulables.removeEventListener('mouseup', selectEventListener)
        anulables.classList.add('disabled')
        console.log('he llegado aqui')

        if(!document.querySelector('.detectableMessage')){
            
            const message = document.createElement('h1');
            message.textContent = '¡Has perdido el juego!';
            message.classList.add('detectableMessage')
            //document.header.appendChild(message);
            document.body.insertBefore(message, document.body.firstChild)
        }

        //alert('HAS PERDIDO <br> suerte la próxima vez ')

    }

}

const iniciar = ()=>{

    const message = document.querySelector('.detectableMessage');
    if (message) message.remove();
    
    aciertos=0
    const reanudar = document.querySelector ('#btnElement')
    reanudar.classList.remove('disabled')
    reanudar.disabled = false
    reanudar.addEventListener('mouseup', selectEventListener)
    }

const selectEventListener = (e) => {
    //Obtenemos el src de la img
    //Si pinchamos puede que estemos pinchando en el div o en la imagen, debemos obtener el src de la imagen
    let img = (e.target.tagName === 'DIV') ? e.target.querySelector('img') : e.target
    let elementName = img.src.split('/').pop() //Cojo el nombre de la imagen del elemento, sin la ruta completa
    
    if(turnos>0){
        if (isElementOfMovie(elementName, movieSelected)){
            let dianas = document.querySelector('.diana')
            let elementos = document.querySelector('.elemento')
            img.parentElement.classList.add('ok')
            
            dianas.appendChild(img)
            
//*************************************************************** */            
            
            //dianas.appendChild(img.parentElement)
            //dianas.addEventListener('mouseup', dropear)

        }else {
            img.parentElement.classList.add('fail')
            
            turnos --

        }
            
        if (turnos ==0) {
            gameOver(); // Desactivamos el juego
        }
    }
    return 
}

const getMoviesDeck = () => {
    let movieDeck = []
    for(let i = 1; i <= NMOVIES; i++) {
        movieDeck.push("0"+i+"M")
    }
    //Barajamos con un método de la librería Underscore. Esta librería ofrece muchas funciones,
    //en este caso uso shuffle que recibe un arrayy lo devuelve de forma aleatoria
    movieDeck = _.shuffle(movieDeck)
    return movieDeck;
}

const getElementsDeck = () => {
    let elementDeck = []
    for(let i = 1; i <= NMOVIES; i++) {
        for(let j = 0; j < NELEMENTSPMOVIE; j++) {
            elementDeck.push("0"+i+"C"+j)
        } 
    }
    //Barajamos
    elementDeck = _.shuffle(elementDeck)
    return elementDeck;
}

const getElement = (elementDeck) => {
    if(elementDeck.length === 0)
        throw 'No hay más tarjetas'
    const tarjeta = elementDeck.pop()
    return tarjeta;
}

const isElementOfMovie = (element, movie) => element.substring(0,2) === movie.substring(0,2) ? true : false

let movieDeck = getMoviesDeck()
let elementDeck = getElementsDeck()
let movieSelected;
btnMovieConfiguration()
btnElementConfiguration()
