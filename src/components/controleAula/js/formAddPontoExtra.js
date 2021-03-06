
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, setDoc, doc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import { insertAlunoNomeValue, insertCursoNomeValue } from "./formAddAula.js";
import { removeBugExtraBgFormBLockScreen} from "../../jsCommon/commonFunctions.js";
import { btnCloseForm, defaultEventsAfterSubmitForm } from "../../jsCommon/formsFunc.js";
import insertElementHTML from "../../jsCommon/insertElementHTML.js";
import { addLogInfo } from "../../logData/js/logFunctions.js";
//---------------------------------------------------------------//

export function insertFormAddPontoExtra() {
  let form = insertElementHTML('#page_content',
    './components/controleAula/formAddAula.html');
  form.then((form) => {
    eventsFormAddPontoExtra(form)
  });
}

function eventsFormAddPontoExtra(form) {
  removeBugExtraBgFormBLockScreen();
  btnCloseForm("#form_add_aula");
  form.addEventListener("submit", (e) => {
    submitformAddPontoExtra(e);
  });
  insertAlunoNomeValue(form)
  insertCursoNomeValue(form).then((res) => {
  })
  displayAlunoCursoNome(form)
  removeFieldFormAddAula(form)
}

function removeFieldFormAddAula(form) {
  form.querySelector("h3").textContent = "Adicionar Ponto Extra";
  form.querySelector("#select_aula").removeAttribute("required");
  form.querySelector("#horario").removeAttribute("required");
  form.querySelector("#tema").removeAttribute("required");
  form.querySelector("#aula_categoria").removeAttribute("required");

  form.querySelector("#div_status_aula").style.display = "none";
  form.querySelector("#div_horario").style.display = "none";
  form.querySelector("#div_select_aula").style.display = "none";
  form.querySelector("#div_tema").style.display = "none";
}
function displayAlunoCursoNome(form) {
  setTimeout(() => {
    let selectAluno = form.querySelector('#select_aluno');
    let selectCurso = form.querySelector('#select_curso');
    let aluno = selectAluno.options[selectAluno.selectedIndex].innerHTML;
    let curso = selectCurso.options[selectCurso.selectedIndex].innerHTML;
    form.querySelector('#aluno_nome').innerHTML = '<span>Aluno: </span>' + aluno;
    form.querySelector('#curso_nome').innerHTML = '<span>Curso: </span>' + curso;
  }, 100)
}

function submitformAddPontoExtra(e) {
  e.preventDefault();
  let form = e.target;
  let RA = form.querySelector("#select_aluno").value;
  let curso = form.querySelector("#select_curso").value;
  let pontoExtra = "ponto extra " + form.querySelector("#data").value;
  let bimestre = form.select_bimestre.value;
  setDoc(doc(db, 'alunato', RA, 'cursos', curso),
    {
      bimestres: {
        [form.select_bimestre.value]: {
          [pontoExtra]: {
            categoria: 'ponto extra',
            data: form.data.value,
            descricao: form.detalhes.value
          }
        }
      }
    }, { merge: true }
  )
    .then(() => {
      defaultEventsAfterSubmitForm("#form_add_aula", "Ponto extra adicionado com sucesso!")

    }).then(() => {
      addLogInfo('log_alunato', 'update', `ponto_extra - ${RA} - ${curso} - ${bimestre}`);
    })
    .catch((error) => {
      console.log(error);
      addLogInfo('log_alunato', 'error', `ponto_extra - ${RA} - ${curso} - ${bimestre}`, error);
    });

  ;
}