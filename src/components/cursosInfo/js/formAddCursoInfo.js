//Firebase
const { ipcRenderer } = require("electron");
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, setDoc,  doc, getDocs, collection} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

//-----------------------------------------------------------------------
//Components
import {insertElementHTML, btnCloseForm, defaultEventsAfterSubmitForm} from "../../js_common/commonFunctions.js";
import { insertViewTableCursosInfoHTML } from "./viewTableCursosInfo.js";

//Firebase

//Others libraries
const VMasker = require("vanilla-masker");
//-------------------------------------------------------------------------
export function insertFormAddCursosInfoHTML(){
  insertElementHTML('#cursos_info_content',
  './components/cursosInfo/formAddCursoInfo.html', eventsFormAddCursosInfo
  );


}



function setCargaHoraria(){
  let duracao = document.querySelector('#form_add_curso_info #duracao').value;
  let cargaHorariaInput = document.querySelector('#carga_horaria');
  cargaHorariaInput.value = parseInt(duracao) * 16 // duração * 8 aulas por mês * 2 horas por aula.
}

export function eventsFormAddCursosInfo(){
  insertOptionslistIdCursosInfo();
  VMasker(document.querySelector('#valor_mes')).maskMoney();
  btnCloseForm('#form_add_curso_info');

  //Listeners
  document.querySelector('#id_curso').addEventListener('change', ()=>{
    
    checkInputIDCurso();


  });

  document.querySelector('#form_add_curso_info #duracao').addEventListener('input', ()=>{
    setCargaHoraria()
  });
  let form = document.querySelector('#form_add_curso_info');
  form.addEventListener("submit", (e)=>{
   e.preventDefault();

    if(form.classList.contains('form_edit_curso_info')){
      submitFormEditCursoInfo(e)

    }else{
      submitFormAddCursoInfo(e)

    }
  });
}



function insertOptionslistIdCursosInfo() {
  let listIdCursosInfo = document.querySelector("#list_id_cursos_info");
  getIdCursosInfo()
      .then((idCursos) => {
          let options = '';
          idCursos.forEach((item) => {
              options += `<option>${item}</option>`;
          });
          listIdCursosInfo.innerHTML = options;
      });

}
function invalidateInputIDCursoInfo(){
  let idInput = document.querySelector("#form_add_curso_info #id_curso");
  idInput.setCustomValidity("ID em uso ou inválida");
  idInput.classList.add('input_invalido');
} 
function validateInputIDCursoInfo(){
  let idInput = document.querySelector("#form_add_curso_info #id_curso");
  idInput.classList.remove('input_invalido');
  idInput.setCustomValidity("");
} 

function checkInputIDCurso() {
  let idCursoInput = document.querySelector("#id_curso").value;
  getIdCursosInfo()
      .then((ids) => {
 
          let valida = true; 
        ids.forEach((idCurso) => {
              if (idCurso === idCursoInput) {
                 valida = false;
              }
          })
          if(!valida){
          invalidateInputIDCursoInfo()
          } 
          else {
           validateInputIDCursoInfo();
          }
      });
}


function getIdCursosInfo() {
  let cursos_info_ids = getDocs(collection(db, 'cursos_info'))
      .then((cursos_info) => {
          let ids = [];
          cursos_info.forEach((item) => {
              ids.push(item.id)
          })
          return ids;
      })
  return cursos_info_ids;
}


export function submitFormEditCursoInfo(e){
  let form = e.target;
  setDoc(doc(db, "cursos_info", form.id_curso.value), 
  { 
    cod: form.id_curso.value, 
    categoria: form.categoria.value, 
    nome: form.nome.value, 
    modulos: form.modulos.value, 
    duracao: form.duracao.value, 
    parcelas: form.parcelas.value, 
    valor: form.valor_mes.value, 
    carga_horaria: form.carga_horaria.value, 
  metadata:{
    modified: new Date()
  }
  }, { merge: true}
  ).then(()=>{
    defaultEventsAfterSubmitForm('#form_add_curso_info', 'Curso adicionado com sucesso!');
  }).then(()=>{
    insertViewTableCursosInfoHTML();
  })
  .catch(err => console.log(err)); 
}


export function submitFormAddCursoInfo(e){
    let form = e.target;
    setDoc(doc(db, "cursos_info", form.id_curso.value), 
    { 
      cod: form.id_curso.value, 
      categoria: form.categoria.value, 
      nome: form.nome.value, 
      modulos: form.modulos.value, 
      duracao: form.duracao.value, 
      parcelas: form.parcelas.value, 
      valor: form.valor_mes.value, 
      carga_horaria: form.carga_horaria.value, 
      metadata:{
        created: new Date(),
        modified: new Date()
      }
    }, { merge: true}
    ).then(()=>{
      defaultEventsAfterSubmitForm('#form_add_curso_info', 'Curso adicionado com sucesso!');
    }).then(()=>{
      insertViewTableCursosInfoHTML();
    })
    .catch(err => console.log(err)); 
}

