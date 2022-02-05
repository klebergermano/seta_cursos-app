//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, setDoc, deleteDoc, doc } = require("firebase/firestore")
const { getAuth } = require("firebase/auth");
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
//---------------------------------------------------------------//
//Components
import { btnCloseForm, defaultEventsAfterSubmitForm } from "../../jsCommon/formsFunc.js";
import  insertElementHTML from "../../jsCommon/insertElementHTML.js";
import { insertOptionsSelectCursos } from "./commonAlunos.js";
import { insertViewTableAlunosHTML } from "./viewTableAlunos.js";
import { addLogInfo } from "../../logData/js/logFunctions.js";
//---------------------------------------------------------------//


export function insertFormDeleteCursoHTML(RA, alunoNome, RG) {
  insertElementHTML('#page_content',
    './components/alunos/formDeleteCurso.html', () => {
      eventsFormDeleteCurso(RA, alunoNome, RG)
    });
}

function eventsFormDeleteCurso(RA, alunoNome, RG) {
  btnCloseForm("#form_delete_curso");
  setInfoFields(RA, alunoNome, RG)
  document.querySelector('#form_delete_curso').addEventListener('submit', (e) => {
    e.preventDefault();
    let curso = e.target.select_curso.value;
    confirmBoxDeleteCurso('#form_delete_curso', curso, (e) => {
      submitformDeleteCurso();
    })
  });
}

function setInfoFields(RA, alunoNome, RG) {
  document.querySelector("#aluno_ra").value = RA;
  document.querySelector("#aluno_nome").value = alunoNome;
  document.querySelector("#aluno_rg").value = RG;
  insertOptionsSelectCursos(RA)
}

//Deleta o curso associado ao aluno.
function submitformDeleteCurso(e) {
  let form = document.querySelector('#form_delete_curso');;
  let RA = form.querySelector('#aluno_ra').value;
  let selectCurso = form.querySelector('#select_curso');
  let curso = selectCurso.value;
  let idContrato = form.querySelector('#select_curso').options[selectCurso.selectedIndex].dataset.id_contrato;
  deleteDoc(doc(db, 'alunato', RA, 'cursos', curso))
    
    .then(() => {
      setDoc(doc(db, "contratos", idContrato),
        {
          metadata: {
            aluno_associado: 'pendente'
          }
        },
        { merge: true }
      );
    })
    .then(() => {
      defaultEventsAfterSubmitForm("#form_delete_curso", "Curso deletado com sucesso!");
    }).then(() => {
      setTimeout(() => {
        insertViewTableAlunosHTML();
      }, 2000)
    }).then(() => {
      addLogInfo('log_alunato', 'curso_deletado', RA + '-' + curso);
    })
    .catch((error) => {
      addLogInfo('log_alunato', 'error', RA, error);
      console.error("Erro ao adicionar curso: ", error)
    });

}


//Confirma se o usuário realmente quer deletar o curso.
 function confirmBoxDeleteCurso(target, curso, callback) {
  let elementTarget = document.querySelector(target);
  let bgMsgBox = document.createElement('div');
  bgMsgBox.className = 'block_screen';
  let msgBox = document.createElement('div');
  msgBox.className = 'confirm_box confirm_box_deletar';
  msgBox.innerHTML = `
  <span class='btn_close'>X</span>
    <p>
    <br/><span style='color:red'><b>ATENÇÂO!</b></span> 
    <br/>Todas as informações sobre o curso <b>${curso}</b> serão PERMANENTEMENTE apagadas.
    <br/>Deseja realmente <span style='color:red'>DELETAR?</span>
    <br/>Essa ação não podera ser defeita!
    </p>
  <button class='btn-default-delete'>Deletar</button><button class='btn-default-cancel' button>Cancelar</button>`;
  msgBox.querySelector('.btn-default-delete').addEventListener('click', (e) => {
    callback();
    closeConfirmBox(e)
  });
  msgBox.querySelector('.btn-default-cancel').addEventListener('click', (e) => {
    closeConfirmBox(e)
  });
  msgBox.querySelector('.btn_close').addEventListener('click', (e) => {
    closeConfirmBox(e)
  });
  bgMsgBox.appendChild(msgBox);
  elementTarget.appendChild(bgMsgBox);
}

function closeConfirmBox(e) {
  let confirmBox = e.target.closest('.confirm_box')
  parent = confirmBox.parentElement;
  parent.removeChild(confirmBox);
  if (parent.className.includes('block_screen')) {
    let block_screen = parent;
    let parent_block_screen = block_screen.parentElement;
    parent_block_screen.removeChild(block_screen);
  }
};

//------------------------------------------------------------------------