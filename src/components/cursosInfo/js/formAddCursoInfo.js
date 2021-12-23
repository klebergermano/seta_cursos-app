//Firebase
const { ipcRenderer } = require("electron");
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, setDoc,  doc} = require("firebase/firestore") 
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
  VMasker(document.querySelector('#valor_mes')).maskMoney();
  btnCloseForm('#form_add_curso_info');

  //Listeners
  document.querySelector('#form_add_curso_info #duracao').addEventListener('input', ()=>{
    setCargaHoraria()
  });
  document.querySelector('#form_add_curso_info').addEventListener("submit", (e)=>{
   e.preventDefault();
    submitFormAddCursoInfo(e)
  });
}


export function submitFormAddCursoInfo(e){
    let form = e.target;
    setDoc(doc(db, "cursos_info", form.nome.value), 
    { 
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

