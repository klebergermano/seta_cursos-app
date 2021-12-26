
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, setDoc,  doc, getDocs, collection} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

import {insertElementHTML}  from "../../js_common/commonFunctions.js";

export function insertResumoCursosInfo() {
 insertElementHTML('#home_content', './components/cursosInfo/resumoCursosInfo.html', eventsResumoCursosInfo);    
}

function eventsResumoCursosInfo(){
     createContentResumoCursosInfo().then((bgCursosInfo)=>{
        console.log(bgCursosInfo);
        
        document.querySelector('#cursos_info .page_content').innerHTML = bgCursosInfo.innerHTML;

     }); 

}

function getCursosInfo(){
    return getDocs(collection(db, 'cursos_info'))
}

function createContentResumoCursosInfo(){

let bgCursosInfo = getCursosInfo().then((res)=>{
    let bgCursosInfo = document.createElement('div');
    res.forEach((item)=>{

        let cursoInfo = `
        <div class='curso_content color_${item.data().nome}'>
                <h2>${item.data().nome}</h2>
                <div class='categoria'>
                    <p>Categoria: ${item.data().categoria}</p>
                </div>
                <div class='modulos'>
                    <h3>Módulos</h3>
                    ${item.data().modulos}
                </div>
                <div class='div_valor'>
                    <p class='valor'>Investimento: ${item.data().valor}</p>
                </div>
                <div class='div_duracao'>
                    <p class='duracao'>Duração: ${item.data().duracao}</p>
                </div>
         
                <div class='div_carga_horaria'>
                    <p class='duracao'>C. Horária: ${item.data().carga_horaria}</p>
                </div>
            </div>
        
        `; 
        bgCursosInfo.innerHTML += cursoInfo;

    })
   
    return bgCursosInfo;

})

return bgCursosInfo;

}