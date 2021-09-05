import * as dbAlunoHistFunc from "../../js_common/dbAlunoHistoricoFunc.js";
import * as commonFunc from "../../js_common/commonFunctions.js";

export function insertFormAddCursoHTML(){
  commonFunc.insertElementHTML('#page_content', 
  './components/controle_aula/formAddCurso.html', eventsFormAddCurso);
}

function eventsFormAddCurso(form) {

  form.querySelector("#select_aluno")
  .addEventListener("input", (e) => {
    validaSelectOptionsAddCurso(form);
  });
  
  form.querySelector('.btn_close_form').addEventListener('click', (e)=>{ 
    commonFunc.removeElementChild('#page_content', '#form_add_curso',()=>{
    commonFunc.changeCSSDisplay('#block_screen', 'none')
    });
  })
  //Copia as opções do "#main_select_aluno" e insere no select_aluno
  insertOptionsInSelectAlunoCurso(form)

  form.addEventListener("submit", (e) => {
    submitformAddCurso(e);
   });

//Bloqueia o fundo com o "#block_screen".
commonFunc.changeCSSDisplay('#block_screen', 'block')
}

function insertOptionsInSelectAlunoCurso(form){
  let select = form.querySelector('#select_aluno');
  let mainSelect = document.querySelector('#main_select_aluno');
  select.innerHTML = mainSelect.innerHTML;
  select.selectedIndex = mainSelect.selectedIndex;
  select.setAttribute('disabled', true);
  validaSelectOptionsAddCurso(form)

}
//=====================================================================================
//------------------------------------ADD CURSOS---------------------------------------
function validaSelectOptionsAddCurso(form) {
    let selectAluno = form.querySelector("#select_aluno");
    let RA = selectAluno.options[selectAluno.selectedIndex].value;
    let cursos = getKeysCursos(RA);
    cursos.then((cursos) => {
      blockSelectOptionsAddCurso(form, cursos);
    });
  }

  function getKeysCursos(RA) {
    let aluno = dbAlunoHistFunc.getAlunoHistCursosDB(RA);
    let cursos = [];
    let keys = aluno.then((res) => {
      res.forEach((item) => {
        cursos.push(item.data().curso);
      });
      return cursos;
    });
    return keys;
  }

  function blockSelectOptionsAddCurso(form, cursos) {
   let selectCurso = form.querySelector("#select_curso");
    //Remove os atributes "disabled" setados anteriormente
    for (let k = 0; k <= selectCurso.options.length - 1; k++) {
      if (selectCurso.options[k].value !== "") {
        selectCurso.options[k].removeAttribute("disabled");
      }
    }
    //Adiciona disabled nas options que ja existirem no array cursos
    for (let j = 0; j <= cursos.length - 1; j++) {
      for (let i = 0; i <= selectCurso.options.length - 1; i++) {
        if (selectCurso.options[i].value === cursos[j]) {
          selectCurso.options[i].setAttribute("disabled", true);
        }
      }
    }
  }

  function submitformAddCurso(e) {
    e.preventDefault();
    let form = e.target;

    let RA = form.select_aluno.value;
    let alunoHistorico = db.collection("aluno_historico");
    alunoHistorico
      .doc(RA)
      .collection("cursos")
      .doc(form.select_curso.value)
      .set(
        {
          curso: form.select_curso.value,
          bimestres: {
          },
        },
        { merge: true }
      )
      //Remove conteúdo do formulário e acrescenta a mensagem
      .then(() =>
        commonFunc.showMessage("form_add_curso", "Curso adicionado com sucesso!")
      )
      //tira o diplay do formulário e block_screen
      .then(() => {
        setTimeout(() => {
          commonFunc.removeElementChild('#page_content', '#form_add_curso',()=>{
          commonFunc.changeCSSDisplay('#block_screen', 'none')
        });
        }, 2000);
      })
  
      .catch((error) => console.error("Error writing document: ", error));
  }

