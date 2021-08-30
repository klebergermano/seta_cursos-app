import * as commonFunc from "../common/commonFunctions.js";
import * as  dbAlunoHistFunc from "../common/dbAlunoHistoricoFunc.js";

//=====================================================================================
export function eventsFormAddAluno(){
  document.querySelector('#btn_add_aluno').addEventListener('click', (e)=>{
    
     insertFormAddAlunoHTML()
    });
}


function insertFormAddAlunoHTML(){

  let pageContent = document.querySelector('#page_content');

  fetch('./components/controle_aula/formAddAluno.html')
  .then((res)=> res.text())
  .then((htmlString)=>{
    console.log(htmlString);
       return new DOMParser().parseFromString(htmlString, 'text/html').body.firstElementChild;
  })
  .then((formAddAluno)=>{
    pageContent.appendChild(formAddAluno);

   return formAddAluno;
  }).then((formAddAluno)=>{
    onloadFormAddAluno(formAddAluno)
  })
  .catch((err)=> console.log(err));
}

function onloadFormAddAluno(form){
  let input_ra = form.querySelector('#add_aluno_ra');
  let btn_close_form = form.querySelector('.close_form');
      btn_close_form.addEventListener('click', (e)=>{ removeFormFromPageContent(e.target) })
  input_ra.addEventListener('input', (e)=>{
    validaSelectOptionsAddAluno(e);
  });   
      commonFunc.changeCSSDisplay('#block_screen', 'block');
      document.querySelector("#form_add_aluno").addEventListener("submit", (e) => {
        formAddAluno(e);
      });

      //Insere as os RAs ja cadastrados como opções do datalist
      insertOptionsAddAlunoRA()


}

function removeFormFromPageContent(btn){
  let page_content = document.querySelector('#page_content');
     let form = btn.closest('.forms');
     page_content.removeChild(form);
     commonFunc.changeCSSDisplay('#block_screen', 'none');
 }


//------------------------------------ADD ALUNO---------------------------------------
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

  function insertOptionsAddAlunoRA() {
    let dataList = document.querySelector("#add_aluno_datalist_ra");
    let options = createOptionsRA();
    options.then((res) => {
      dataList.innerHTML = res;
    })
  }

  function formAddAluno(e) {
    e.preventDefault();
    let form = e.target;
    let alunoHistorico = db.collection("aluno_historico");
    alunoHistorico
      .doc(form.add_aluno_ra.value)
      .collection("cursos")
      .doc(form.curso_nome.value)
      .set({
        curso: form.curso_nome.value,
        bimestres: {
        },
      })
      .then(() => {
        alunoHistorico
          .doc(form.add_aluno_ra.value)
          .set({ nome: form.nome.value }, { merge: true });
      })
      //Remove conteúdo do formulário e acrescenta a mensagem
      .then(() =>
        commonFunc.showMessage("form_add_aluno", "Aluno salvo com sucesso!")
      )
      //tira o diplay do formulário e block_screen
      .then(() => {
        setTimeout(() => {
          e.target.style.display = "none";
          commonFunc.changeCSSDisplay("#block_screen", "none");
        }, 500);
      })
      .catch((error) => console.error("Error writing document: ", error));
  }
    
