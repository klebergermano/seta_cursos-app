import * as commonFunc from "../common/commonFunctions.js";
import * as  dbAlunoHistFunc from "../common/dbAlunoHistoricoFunc.js";

export function insertFormAddAlunoHTML(){
  commonFunc.insertElementHTML('#page_content',
  './components/controle_aula/formAddAluno.html',
  eventsFormAddAluno
  );
}

function eventsFormAddAluno(){
  let form = document.querySelector('#form_add_aluno');
  form.querySelector('.btn_close_form').addEventListener('click', (e)=>{ 
    commonFunc.removeElementChild('#page_content', '#form_add_aluno',()=>{
    commonFunc.changeCSSDisplay('#block_screen', 'none')
    } 
    );
  })

  form.querySelector('#add_aluno_ra').addEventListener('input', (e)=>{
    validaSelectOptionsAddAluno(e);
  });   

 form.addEventListener("submit", (e) => {
    formAddAluno(e);
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
      //Remove conteúdo do formulário e acrescenta a mensagem.
      .then(() =>
        commonFunc.showMessage("form_add_aluno", "Aluno salvo com sucesso!")
      )
      //tira o diplay do formulário e block_screen.
      .then(() => {
        setTimeout(() => {
          e.target.style.display = "none";
          commonFunc.changeCSSDisplay("#block_screen", "none");
        }, 500);
      })
      .catch((error) => console.error("Error writing document: ", error));
  }
    