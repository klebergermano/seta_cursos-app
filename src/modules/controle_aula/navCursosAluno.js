
//Cria o menu nav_cursos_aluno
import * as dbAlunoHistFunc from "../common/dbAlunoHistoricoFunc.js";
import * as commonFunc from "../common/commonFunctions.js";
import * as formAddCurso from "./formAddCurso.js";


export function displayCursoById(idCurso) {
    commonFunc.hideAllElementsByClassName('.bg_curso');
    commonFunc.changeCSSDisplay("#" + idCurso, 'block');
  }
async function createNavCursosAluno(RA) {
    let cursos = arrayCursosAluno(RA);
    let ul = document.createElement("ul");
    let id_curso;
    let menuNavUl = cursos
      .then((res) => {
        res.forEach((item) => {
          id_curso = commonFunc.stringToID(item);
          ul.innerHTML += `<li><a data-active='${id_curso}'>${item}</a></li>`;
        });
      }).then(()=>{
        let btn_add_curso = `<button title='Adicionar Curso' id='btn_add_curso' class="btn btn_add_curso" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal-plus" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/>
          <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
          <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
        </svg>
      </button>`;
      ul.innerHTML += btn_add_curso;

      })
      .then(() => {
        //TODO: conferir a possibilidade de se usar uma função genérica
        ul.querySelectorAll("a").forEach((item) => {
          item.addEventListener("click", (e) => {
            navCursosClick(e);
          });
        });
      })
      .then(() => {
        return ul;
      });
    return menuNavUl;
  }

  function removeActiveClassNavCursosElement(){
    let a = document.querySelector(".nav_cursos_aluno").getElementsByTagName("a");
    for (let item of a) {
      item.classList.remove("active");
    }
  }

  function setSelectedCusoInAddCurso(idCurso){
      let selectCurso = document.querySelector('#form_add_aula').querySelector("#select_curso_add_aluno");
      for(let i = 0; i <= selectCurso.options.length - 1; i++){
        if(commonFunc.stringToID(selectCurso.options[i].value) === idCurso){
        selectCurso.options[i].setAttribute('selected', true);
        }else{
        selectCurso.options[i].removeAttribute('selected');
        }
      }
  }
  function setSelectedAluno(){
    let alunoSelectIndex = document.querySelector('#main_select_aluno').selectedIndex;
    let selectAlunoAddAula = document.querySelector('#form_add_aula').querySelector("#select_aluno_add_aula");
    selectAlunoAddAula.selectedIndex = alunoSelectIndex;
  }

  function navCursosClick(e) {
    let idCurso = e.target.dataset.active;
    //Remove a classe "active" dos elementos a.
    removeActiveClassNavCursosElement();
    //Mostra o curso pelo id do menu clicado.
    displayCursoById(e.target.dataset.active /*id do curso a ser mostrado*/);
    //Adiciona a classe "active" no element a clicado.
    e.target.classList.add("active");
  }

  function arrayCursosAluno(RA) {
    let alunoHistCurso = dbAlunoHistFunc.getAlunoHistCursosDB(RA);
    let result = alunoHistCurso.then((res) => {
      let cursos = [];
      res.forEach((e) => {
        cursos.push(e.data().curso);
      });
      return cursos;
    });
    return result;
  }

function removeActiveClassFromNavCursos(){
  let nav = document.querySelectorAll(".nav_cursos_alunoHistCurso")[0];
  if(nav){
    let a = nav.getElementsByTagName("a");
    for (let i = 0; i < a.length; i++) {
      a[i].classList.remove("active");
    }
  }
  }

  function displayNavCursoAlunoUpdated(nomeCurso){
    let nomeCursoAtualizado = commonFunc.stringToID(nomeCurso);
    displayCursoById(nomeCursoAtualizado);
    removeActiveClassFromNavCursos()
    //Adiciona class "active" no navCursos a[data-active='nomecurso']
    let a = document.querySelectorAll(`[data-active="${nomeCursoAtualizado}"]`);
    a[0].classList.add("active");
  }

  export function insertNavCursosInBGCursos(RA, nomeDoCurso) {
    //Cria o menu nav_cursos_aluno
     createNavCursosAluno(RA)
     .then((navUL) => {
       //Insere o conteúdo no menu nav_cursos_aluno. 
      let navCursos = document.querySelector('.nav_cursos_aluno');
      navCursos.innerHTML = ''; //remove o menu anterior;
     navCursos.appendChild(navUL);
      })
      .then(() => {
        
          //mostra o curso que foi atualizado usando displayNavCursoAlunoUpdated
         document.querySelector("#btn_add_curso")
          .addEventListener("click", (e) => {
     
        formAddCurso.insertFormAddCursoHTML();
          });

             displayNavCursoAlunoUpdated(nomeDoCurso);
      }).catch((err) => { console.log(err) });
  }