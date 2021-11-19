import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, setDoc,  doc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

import * as dbAlunoHistFunc from "../../js_common/dbAlunoHistoricoFunc.js";
import {displayBlockScreen, insertElementHTML, btnCloseForm, defaultEventsAfterSubmitForm} from "../../js_common/commonFunctions.js";

export function insertFormAddCursoHTML(RA, alunoNome){
  insertElementHTML('#page_content', 
  './components/alunos/formAddCurso.html', ()=>{
    eventsFormAddCurso(RA, alunoNome)
  });
}

function eventsFormAddCurso(RA, alunoNome) {
  document.querySelector("#aluno_ra").value = RA;
  document.querySelector("#aluno_nome").value = alunoNome;
  displayBlockScreen();
  btnCloseForm("#form_add_curso");
}

  function submitformAddCurso(e) {
    e.preventDefault();
    let form = e.target;
    let RA = form.select_aluno.value;
    let curso = form.select_curso.value; 
    setDoc(doc(db, 'alunato', RA, 'cursos', curso),
    { curso: form.select_curso.value,
      bimestres: {},
    }).then(() =>{
      defaultEventsAfterSubmitForm("#form_add_curso", "Curso adicionado com sucesso!");
     }).catch((error) => console.error("Erro ao adicionar curso: ", error));;
  }
