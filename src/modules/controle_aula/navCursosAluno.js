//TODO: Refatorar funções.

//Cria o menu nav_cursos_aluno
import * as dbAlunoHistFunc from "../common/dbAlunoHistoricoFunc.js";
import * as commonFunc from "../common/commonFunctions.js";

export function displayCursoById(idCurso) {
    commonFunc.hideAllElementsByClassName('.bg_curso');
    commonFunc.changeCSSDisplay("#" + idCurso, 'block');
  }
async function createNavCursosAluno(alunoInfo) {
    let nomeA = document.createElement("span");
    nomeA.classList.add("title_aluno_info");
    nomeA.innerHTML = `<span class='title_info_ra'>${alunoInfo.RA}:&nbsp;</span><span class='title_info_nome_luno'>${alunoInfo.nome}</span>`;
    let cursos = arrayCursosAluno(alunoInfo.RA);
    let nav = document.createElement("nav");
    let ul = document.createElement("ul");
    let id_curso;
    let menuNav = cursos
      .then((res) => {
        nav.classList.add("nav_cursos_aluno");
        res.forEach((item) => {
          id_curso = commonFunc.stringToID(item);
          ul.innerHTML += `<li><a data-active='${id_curso}'>${item}</a></li>`;
        });
      })
      .then(() => {
        //TODO: tentar utilizar uma função genérica
        ul.querySelectorAll("a").forEach((item) => {
          item.addEventListener("click", (e) => {
            navCursosClick(e);
          });
        });
      })
      .then(() => {
        nav.appendChild(ul);
        nav.insertAdjacentElement("afterbegin", nomeA);
        return nav;
      });
    return menuNav;
  }



  function removeActiveClassNavCursosElement(){
    let a = document.querySelector(".nav_cursos_aluno").getElementsByTagName("a");
    for (let item of a) {
      item.classList.remove("active");
    }
  }

  function setSelectedCusoInAddCurso(idCurso){
    console.log(idCurso);
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
    let alunoSelectIndex = document.querySelector('#select_aluno').selectedIndex;
    let selectAlunoAddAula = document.querySelector('#form_add_aula').querySelector("#select_aluno_add_aula");
    selectAlunoAddAula.selectedIndex = alunoSelectIndex;
    

  }


  function navCursosClick(e) {
    let idCurso = e.target.dataset.active;
    setSelectedAluno()
    setSelectedCusoInAddCurso(idCurso)
    //Remove a classe "active" dos elementos a.
    removeActiveClassNavCursosElement();
    //Mostra o curso pelo id do menu clicado.
    displayCursoById(e.target.dataset.active /*id do curso a ser mostrado*/);
    //Adiciona a classe "active" no element a clicado.
    e.target.classList.add("active");
  }

  //TODO: criar método alternativo que não necessite dessa função.
  //Função usada para remover todos os '.nav_cursos_aluno' "extras"
  function removeAllNavCursos(){
    let navCursos = document.querySelectorAll(".nav_cursos_aluno");
    for (let i = navCursos.length; i > 1; i--) {
      document.querySelector("#bg_cursos").removeChild(navCursos[0]);
    }
  }

  function arrayCursosAluno(RA) {
    let aluno = dbAlunoHistFunc.alunoHistoricoDB(RA);
    let result = aluno.then((res) => {
      let cursos = [];
      res.forEach((e) => {
        cursos.push(e.data().curso);
      });
      return cursos;
    });
    return result;
  }

function removeActiveClassFromNavCursos(){
    let a = document.querySelectorAll(".nav_cursos_aluno")[0].getElementsByTagName("a");
    for (let i = 0; i < a.length; i++) {
      a[i].classList.remove("active");
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

  export function insertNavCursosInBGCursos(alunoInfo, snapChanges) {
  
    //Cria o menu nav_cursos_aluno
     createNavCursosAluno(alunoInfo)
     .then((nav) => {
      /*Evita o bug de multiplos nav_cursos serem adicionados removendo todos antes de adicionar o atual*/
      removeAllNavCursos();
      //TODO: Conferir alternativa de se usar o innerHTML para inserir o menu evitando a necessidade da função removeAllNavCursos
       //Insere o menu nav_cursos_aluno em #bg_cursos 
      document.querySelector("#bg_cursos").insertAdjacentElement("afterbegin", nav);
      })
      .then(() => {
          //mostra o curso que foi atualizado usando displayNavCursoAlunoUpdated
          displayNavCursoAlunoUpdated(snapChanges[0].doc.data().curso /*Nome do curso atualizado*/)
      }).catch((err) => { console.log(err) });
  }