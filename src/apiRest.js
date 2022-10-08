/*Elements HTML */
/*span error */
const span = document.getElementById("error");
/*Spawn button */
const button = document.querySelector("div button");
button.addEventListener("click", showCatPicture);
/*Spawn cats container*/
const randomSection = document.querySelector(".show-random-container");
/*Favorite cats container*/
const favoriteSection = document.querySelector(".show-favorites-container");
//Select img to favorites
const selectedImgFavorite = [];

/* global queary variable */
let data;

/*API variables*/

const API = "https://api.thecatapi.com/v1/images/search?limit=4";
const APIFavorite = "https://api.thecatapi.com/v1/favourites";
const APIFavoriteDelete = "https://api.thecatapi.com/v1/favourites/";
const API_key ="live_swlCiQ2zrjigeFch1ZiFXdEQyNIU7wWze8fQxpSLVPRKXHWktuQ9Y9Zq18yUQgRL";


async function showCatPicture(){
    const btnSaveFavorite = document.getElementById("saveFavorite");

    //Se crea agrega un evento al botón para ejecutar la acción de guardar favoritos
    btnSaveFavorite.onclick = () => saveFavorite();
    /* buttonRemove.classList.toggle("button--disabled"); */
    try{
        const response = await fetch(API);
        data = await response.json();
        btnSaveFavorite.classList.replace("button--disabled", "button--enabled");
        console.log("gatos cargados")
        console.log(data);
        
        //Si ya hay imágenes de gatos cargadas las reemplazará por otras
        if(randomSection.childNodes.length > 1){
            //Se obtienen todas las etiquetas img de la sección random
            const replaceImgId = document.querySelectorAll(".show-random-container img");
           
            //Luego reemplazamos la url de cada una de ella por las nuevas url obtenidas
           
            data.forEach((element, index) => {               
                replaceImgId[index].src = element.url;
                replaceImgId[index].id = element.id;
                console.log("reemplazo", replaceImgId);
            });
                
        }
        //Si no hay imágenes de gatos cargadas anteriormente, las creará desde cero.
        else{
            const fragment = new DocumentFragment();
            for(const item of data){
                //Elemet creation
                const article = document.createElement("article");
                article.addEventListener("click", selectImgRandom);
                const img = document.createElement("img");
                //Add nodes and attributes
                img.src = item.url;
                img.id = item.id;
                article.appendChild(img);   
                fragment.append(article);      
            }
            randomSection.append(fragment);
        }              
    }  
    catch(e){
        span.innerText = e;
    }
}
//Seleccionamos las imágenes a las que demos click
function selectImgRandom(event){
    if(selectedImgFavorite.length){

        const imgAdded = event.path[0];
        //Valida si la nueva imagen seleccionada concuerda con la selección actual o no
        if( selectedImgFavorite[0].src === imgAdded.src){
            console.log("entre despues1");
            //Si ya existe una imagen seleccionada será eliminada del array
            selectedImgFavorite.shift();
            //Eliminamos el marco de selección actual
            imgAdded.classList.toggle("show-random-container__img--selected");  
            console.log( selectedImgFavorite);
        }
        else{
            selectedImgFavorite[0].classList.toggle("show-random-container__img--selected");
            selectedImgFavorite.shift();
            //Agregamos al array nuestras imágenes seleccionadas
            selectedImgFavorite.push(imgAdded);
            imgAdded.classList.toggle("show-random-container__img--selected");
            console.log("gato seleccionado", selectedImgFavorite[0])
        }

    }
    else{
        console.log("Primera elección")
        //Guardamos la imagen seleccionada
        const imgAdded = event.path[0];
        console.log(imgAdded);
        //Agregamos la clase que pone el marco de selección al darle click
        imgAdded.classList.toggle("show-random-container__img--selected");    
        //Agregamos al array nuestra imagen seleccionada
        selectedImgFavorite.push(imgAdded);
        console.log(selectedImgFavorite);
           
    }
   
}

async function saveFavorite(){
   
    try{
        const replaceImg = document.querySelectorAll(".show-favorites-container article img");
        if(replaceImg.length >= 6){
            console.log("más de 6")
            span.innerText = "You can only save six cats";
        }
        else{
            console.log("Está trolleando")
            if(selectedImgFavorite.length){
                for (const item of data) {
                    if(item.id === selectedImgFavorite[0].id){
                        const response = await fetch(APIFavorite, {
                            method : "POST",
                            mode: "cors",
                            headers:{
                                "Content-Type" : "application/json",
                                "X-API-KEY": "live_swlCiQ2zrjigeFch1ZiFXdEQyNIU7wWze8fQxpSLVPRKXHWktuQ9Y9Zq18yUQgRL",
                            },
                            body:JSON.stringify({image_id : selectedImgFavorite[0].id})
                        });
                        let dataSent = await response.json();
                        console.log(dataSent);
                        console.log(response);
                        console.log("gato mandado a guardar", item);
                        span.innerText = dataSent.message;
                        
                    }         
                }  
                showFavorite(); 
                //La imagen que se solicitó guardar en favoritos debe ser des-seleccionada y sacada de la lista
                selectedImgFavorite[0].classList.toggle("show-random-container__img--selected");
                 
            }
            else{
                span.innerText = "You must select a cat to send";
            }   
        }
    }
    catch(e){
        console.log(e);
    }
}
//Aquí se consulta los gatos favoritos que fueron enviados al backend, el backend reconoce al usuario por su key
//de autenticación y guarda la información enviada por POST
async function showFavorite(){
    try{
        const fragment = new DocumentFragment();
        const response = await fetch(APIFavorite, {
            method: "GET",
            headers: {
                "X-API-KEY": "live_swlCiQ2zrjigeFch1ZiFXdEQyNIU7wWze8fQxpSLVPRKXHWktuQ9Y9Zq18yUQgRL", 
            }
        });  
        let dataQuery = await response.json();
        console.log("gatos traido para el show", dataQuery)

        if(favoriteSection.childNodes.length > 1){
            
            let replaceImg = document.querySelectorAll(".show-favorites-container article img");
            const article = document.querySelectorAll(".show-favorites-container article");
            const img = document.createElement("img");
            const newArticle = document.createElement("article");
            newArticle.addEventListener("click", selectImgRandom);
            //mostrar luego de eliminar un gato
            replaceImg.forEach((img, index)=> {
                
                if(img.id === selectedImgFavorite[0].id){
                    console.log("antes de eliminar", replaceImg);
                    console.log("este es el gatoq ue eliminaste", replaceImg[index]);
                    /* article[index].removeChild(replaceImg[index]); */
                    favoriteSection.removeChild(article[index]);  
                    replaceImg = document.querySelectorAll(".show-favorites-container article img");  
                    console.log("Como quedó luego de eliminar", replaceImg);
                }
            });
            selectedImgFavorite.shift(); 
            //Mostrar al agregar un gato
            dataQuery.forEach((item, index) => {
                
                replaceImg[index] ? 
                (
                    //Si existe una etiqueta img en la posición dle index, entonces reemplazará la información de cada una 
                    replaceImg[index].src = item.image.url,
                    replaceImg[index].id = item.id    
                )
                :
                (   
                    //Si no existe otra etiqueta img en la posición del index, entonces creará agregará una nueva con
                    //información del gato enviado a favoritos     
                    img.src = item.image.url,
                    img.id = item.id,
                    newArticle.append(img),                
                    favoriteSection.append(newArticle)       
                );
                     

            });
        }
         //Mostrar apenas cargue la página
        else{
            //Se creará el botón de remove para agregarlo como hijo a la section contenedora de favoritos
            const favoriteSectionContainer = document.querySelector(".favorite-cats-container");
            const btnRemove = document.createElement("button");
            btnRemove.classList.add("remove-button");
            btnRemove.innerText = "Remove cat";
            //Se crea el evento escuchador para mostrar
            btnRemove.onclick = () => deleteFavorite();
          
            for (const item of dataQuery) {
                //Elemet creation           
                const article = document.createElement("article");
                article.addEventListener("click", selectImgRandom);
                const img = document.createElement("img");
                //Add nodes and attributes
                img.src = item.image.url;
                img.id = item.id ;
                article.appendChild(img);   
                fragment.append(article);     
            }
            console.log(fragment.children);
            favoriteSection.append(fragment);
            favoriteSectionContainer.appendChild(btnRemove);
        }  
    }
    catch(e){
        console.log(e);
    }   
}
//Aquí se eliminan de favoritos las imágenes de gatos que el usuario elija
async function deleteFavorite(){
    console.log("id de gato mandado a borrar", selectedImgFavorite[0].id)
    try{
        replaceImg = document.querySelectorAll(".show-favorites-container article img");
        //Se comienzan 
        if(selectedImgFavorite.length){
            const response = await fetch(APIFavoriteDelete+selectedImgFavorite[0].id, {
                method : "DELETE",
                mode : "cors", 
                headers: {
                    "X-API-KEY": "live_swlCiQ2zrjigeFch1ZiFXdEQyNIU7wWze8fQxpSLVPRKXHWktuQ9Y9Zq18yUQgRL",
                }
            });
            let dataSent = await response.json();
            console.log(dataSent.message);
            //La imagen que se solicitó eliminar en favoritos debe ser des-seleccionada y sacada de la lista
            selectedImgFavorite[0].classList.toggle("show-random-container__img--selected");
            showFavorite();     
                
        }
        else{
            span.innerText = "You must select a cat to remove";
        }
        
    }
    catch(e){
        span.innerText = "error occurred "+e;
    }
}
showCatPicture()
showFavorite();

	