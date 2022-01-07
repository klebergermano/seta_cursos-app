import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, setDoc,  doc, getDocs, getDoc, collection} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);


import insertComboTextarea from "./insertComboTextarea.js";
import insertInputValorTotal from "./insertInputValorTotal.js";

function getCursoInfo(e){
  let idCurso = e.target.options[e.target.selectedIndex].getAttribute('name'); 
 
 return getDoc(doc(db, 'cursos_info', idCurso));
}

export default function InsertCursoInfo(e) {
 
  let selectCurso = document.getElementById("curso_nome");

  let nomeCurso = selectCurso.options[selectCurso.selectedIndex].getAttribute("name");
  //let cursoInfo = selectCursoInfo(nomeCurso);
  let cursosSelect2 = document.querySelector("#combo_curso_2");
  let selectOptions = cursosSelect2.querySelectorAll("option");
  let cursoInfo = getCursoInfo(e);
  selectOptions.forEach((e) => {  
    e.removeAttribute("disabled"); 
  });

  let option = cursosSelect2.querySelectorAll(`[name='${nomeCurso}']`)[0];
  option.setAttribute("disabled", "true");

cursoInfo.then((cursoInfo)=>{
  document.querySelector("#curso_valor").value = cursoInfo.data().valor;
  document.querySelector("#curso_duracao").value = cursoInfo.data().duracao;
  document.querySelector("#curso_carga_horaria").value = cursoInfo.data().carga_horaria;
  document.querySelector("#curso_parcelas").value = cursoInfo.data().parcelas;
  document.querySelector("#curso_modulos").value = cursoInfo.data().modulos;
  document.querySelector("#combo_curso_1").value = cursoInfo.data().nome;
  insertInputValorTotal();
  insertComboTextarea();
})

}






