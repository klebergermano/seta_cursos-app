
//Cria o menu nav_cursos_aluno
import * as dbAlunoHistFunc from "../../js_common/dbAlunoHistoricoFunc.js";
import * as commonFunc from "../../js_common/commonFunctions.js";



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
      //remove os nav_cursos_extras
      removeExtraNavCursosAluno();

      //mostra o curso que foi atualizado usando displayNavCursoAlunoUpdated

      displayNavCursoAlunoUpdated(nomeDoCurso);
    }).catch((err) => { console.log(err) });
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

function removeActiveClassNavCursosElement() {
  let a = document.querySelector(".nav_cursos_aluno").getElementsByTagName("a");
  for (let item of a) {
    item.classList.remove("active");
  }
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
      cursos.push(e.data().curso_info.nome);
    });
    return cursos;
  });
  return result;
}

function removeActiveClassFromNavCursos() {
  let nav = document.querySelectorAll(".nav_cursos_alunoHistCurso")[0];
  if (nav) {
    let a = nav.getElementsByTagName("a");
    for (let i = 0; i < a.length; i++) {
      a[i].classList.remove("active");
    }
  }
}

function displayCursoById(idCurso) {
  commonFunc.hideAllElementsByClassName('.bg_curso');
  document.querySelector('#'+idCurso).style.display='block';
}

export function displayFirstCursoAluno(){
  let id = document.querySelectorAll('.bg_curso')[0].id;
  displayNavCursoAlunoUpdated(id)
}

function displayNavCursoAlunoUpdated(nomeCurso) {
  let nomeCursoAtualizado = commonFunc.stringToID(nomeCurso);
  displayCursoById(nomeCursoAtualizado);
  removeActiveClassFromNavCursos()
  //Adiciona class "active" no navCursos a[data-active='nomecurso']
  let a = document.querySelectorAll(`[data-active="${nomeCursoAtualizado}"]`);
  a[0].classList.add("active");
}

function removeExtraNavCursosAluno() {
  //remove os nav_cursos_extras
  let aluno_content = document.querySelector('#aluno_content');
  let navCursosAluno = document.querySelectorAll('.nav_cursos_aluno');
  for (let i = 0; i < navCursosAluno.length; i++) {
    if (i > 0) {
      aluno_content.removeChild(navCursosAluno[i]);
    }
  }
}