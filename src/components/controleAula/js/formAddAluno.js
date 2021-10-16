

import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, setDoc,  doc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

import * as commonFunc from "../../js_common/commonFunctions.js";
import * as  dbAlunoHistFunc from "../../js_common/dbAlunoHistoricoFunc.js";

export function insertFormAddAlunoHTML(){
  commonFunc.insertElementHTML('#page_content',
  './components/controleAula/formAddAluno.html',
  eventsFormAddAluno
  );
}

function eventsFormAddAluno(){
  let form = document.querySelector('#form_add_aluno');
commonFunc.btnCloseForm('#form_add_aluno');

  form.querySelector('#add_aluno_ra').addEventListener('input', (e)=>{
    validaSelectOptionsAddAluno(e);
  });   

 form.addEventListener("submit", (e) => {
    submitFormAddAluno(e);
  });

  //Mostra a tela de bloqueio de fundo "block_screen".
  commonFunc.changeCSSDisplay('#block_screen', 'block');
  //Insere as os RAs ja cadastrados como opções do datalist.
  insertOptionsAddAlunoRA()
  
}



//Função de validação do valor inserido no campoo RA, 
//caso esse valor ja exista bloqueia a inserção.
function validaSelectOptionsAddAluno(e) {
  let form = document.querySelector("#form_add_aluno");
      let inputRA = e.target.value;
      let listAlunoRA = dbAlunoHistFunc.getAlunosListRA();
      let valida = listAlunoRA.then((listRA) => {
        for (let i = 0; i <= listRA.length - 1; i++) {
          if (inputRA.toUpperCase() === listRA[i]) {
           
            e.target.classList.add("blocked");
            commonFunc.blockSubmitForm(form);
            return false;
          } else {
            commonFunc.removeblockSubmitForm(form);
            e.target.classList.remove("blocked");
          }
        }
      });
      return valida;
  }

  //Insere os RAs dos alunos como opção do datalist.
  function insertOptionsAddAlunoRA() {
    let dataList = document.querySelector("#add_aluno_datalist_ra");
    let options = createOptionsRA();
    options.then((res) => {
      dataList.innerHTML = res;
    })
  }
//cria as options com o valor dos RAs dos alunos.
  function createOptionsRA() {
    let array = "";
    let listAlunoRA = dbAlunoHistFunc.getAlunosListRA();
    let options = listAlunoRA.then((listRA) => {
      listRA.forEach((list) => {
        array += `<option value='${list}' />`;
      });
      return array;
    });
    return options;
  }

  //Salva o aluno no banco de dados.
  async function submitFormAddAluno(e) {
    let form = e.target;
    e.preventDefault();
     setDoc(doc(db, "aluno_historico", form.add_aluno_ra.value, "cursos", form.curso_nome.value),
    { curso: form.curso_nome.value,
      bimestres: {}
    }).then(()=>{
      setDoc(doc(db, "aluno_historico", form.add_aluno_ra.value), 
      { nome: form.nome.value}, { merge: true}); 
    }).then(()=>{
      commonFunc.defaultEventsAfterSubmitForm("#form_add_aluno", "Aluno salvo com sucesso!");

    }).catch((error) => console.error("Erro ao adicionar Aluno:", error));
  }



    
