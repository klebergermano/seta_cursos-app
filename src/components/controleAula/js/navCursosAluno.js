
//Components
import { stringToID } from "../../jsCommon/commonFunctions.js";
import { getAlunoHistCursosDB } from "../../jsCommon/dbAlunoHistoricoFunc.js";
//---------------------------------------------------------------//


export function insertNavCursosInBGCursos(RA, nomeDoCurso) {
  console.log('NAV:', RA, nomeDoCurso )
  //Cria o menu nav_cursos_aluno
  createNavCursosAluno(RA)
    .then((navUL) => {
      document.querySelector(".nav_cursos_aluno").innerHTML = navUL.outerHTML;
    })
    .then(() => {
      document.querySelectorAll(".nav_cursos_aluno a").forEach((item) => {
        item.addEventListener("click", (e) => {
          navCursosClick(e);
        });
      });
    }).then(() => {
      displayNavCursoAlunoUpdated(nomeDoCurso);
    })
    .catch((err) => { console.log(err) });
}

async function createNavCursosAluno(RA) {
  let cursos = arrayCursosAluno(RA);
  let ul = document.createElement("ul");
  let id_curso;
  let menuNavUl = cursos
    .then((res) => {
      res.forEach((item) => {
        id_curso = stringToID(item);
        ul.innerHTML += `<li><a data-active='${id_curso}'>${item}</a></li>`;
      });
    })
    .then(() => {
      return ul;
    });
  return menuNavUl;
}

export function displayFirstCursoAluno() {
  let id = document.querySelectorAll('.bg_curso')[0].id;
  displayNavCursoAlunoUpdated(id)
}

function displayCursoById(idCurso) {
  hideAllElementsByClassName('.bg_curso');
  document.querySelector('#' + idCurso).style.display = 'block';
}
function removeActiveClassNavCursosElement() {
  let a = document.querySelector(".nav_cursos_aluno").getElementsByTagName("a");
  for (let item of a) {
    item.classList.remove("active");
  }
}

function navCursosClick(e) {
  //Remove a classe "active" dos elementos a.
  removeActiveClassNavCursosElement();
  //Mostra o curso pelo id do menu clicado.
  displayCursoById(e.target.dataset.active /*id do curso a ser mostrado*/);
  //Adiciona a classe "active" no element a clicado.
  e.target.classList.add("active");
}

function arrayCursosAluno(RA) {
  let alunoHistCurso = getAlunoHistCursosDB(RA);
  let result = alunoHistCurso.then((res) => {
    let cursos = [];
    res.forEach((e) => {
      cursos.push(e.data().curso_info.nome);
    });
    return cursos;
  });
  return result;
}

function displayNavCursoAlunoUpdated(nomeCurso) {
  let nomeCursoAtualizado = stringToID(nomeCurso);
  displayCursoById(nomeCursoAtualizado);
  removeActiveClassFromNavCursos()
  //Adiciona class "active" no navCursos a[data-active='nomecurso']
  let a = document.querySelectorAll(`[data-active="${nomeCursoAtualizado}"]`);
  a[0].classList.add("active");
}

function removeActiveClassFromNavCursos() {
  let nav = document.querySelectorAll(".nav_cursos_aluno")[0];
  if (nav) {
    let a = nav.getElementsByTagName("a");
    for (let i = 0; i < a.length; i++) {
      a[i].classList.remove("active");
    }
  }
}

function hideAllElementsByClassName(className) {
  document.querySelectorAll(className).forEach((item) => {
    item.style.display = "none";
  });
}


