import * as commonFunc from "../common/commonFunctions.js";
import * as dbAlunoHistFunc from "../common/dbAlunoHistoricoFunc.js";
import * as displayCursos from "./displayCursos.js";

function clickEditButton() {
  console.log("load");

  let btn = document.querySelectorAll(".btn_edit_aulas");
  btn.forEach((item) => {
    item.addEventListener("click", (e) => {
      showEditAula(e.target);
    });
  });
}
//-----------------------------EDIT ---------------------

function showEditAula(e) {
  let addForm = document.querySelector("#form_add_aula");
  let savePreviousHTMLForm = addForm.innerHTML;
  addForm.classList.add("edit_form");

  commonFunc.changeCSSDisplay("#form_add_aula", "block");
  commonFunc.changeCSSDisplay("#block_screen", "block");

  let select = addForm.querySelectorAll("select");
  select.forEach((item) => {
    item.setAttribute("disabled", true);
  });
  console.log(select);

  console.log(e);
}



export function insertAulasWhenAlunoChange(RA, snapshotChange){
  let changes = snapshotChange.docChanges();
  let alunoInfoGeral = dbAlunoHistFunc.getAlunoInfoGeral(RA);
  let alunoH = dbAlunoHistFunc.alunoHistoricoDB(RA);
  alunoH.then((aluno) => {
    alunoInfoGeral
      .then((res) => {
        InsertBlockAulas(aluno, res, changes);
      })
      .then(() => {
        clickEditButton();
      });
  });
}
/*
//TODO terminar função
export function realTimeDBAlunoHistoricoCursos(RA, callback) {
  db.collection("aluno_historico")
  .doc(RA)
  .collection("cursos")
  .onSnapshot((snap) => {
      callback(RA, snap);
  });
}
*/
/*
*/
/*
export function realTimeDataAlunoHistorico(RA) {
  db.collection("aluno_historico")
    .doc(RA)
    .collection("cursos")
    .onSnapshot((snap) => {
      insertAulasWhenAlunoChange(RA, snap);

    });
}
*/
function criaHtmlCursoContent(curso_nome_bd) {
  if (curso_nome_bd) {
    let id_curso = curso_nome_bd.replace(/\s+|\(|\)/g, "_").toLowerCase();
    let htmlAula = document.createElement("div");
    htmlAula.innerHTML = `
    <div class='bg_curso' id='${id_curso}'>
      <div class='title'>
        <span class='title_curso_nome ${id_curso}'>${curso_nome_bd}</span>
        </div><div id='curso_content'>
      </div>
    </div>`;
    return htmlAula;
  } else {
    return false;
  }
}

//Insere as aulas na página
export function InsertBlockAulas(alunoData, alunoInfoGeral, changes) {
  let resultHTML = "";
  //Main forEach
  alunoData.forEach((res) => {
    if (typeof res.data !== "undefined") {
      res = res.data();
    } else {
      res = res.doc.data();
    }
    let bimestres_bd = res.bimestres;
    let curso_nome_bd = res.curso;
    let id_curso;
    //evita erro por undefined no nome do curso
    if (curso_nome_bd) {
      id_curso = curso_nome_bd.replace(/\s+|\(|\)/g, "_").toLowerCase();
    }
    let html = criaHtmlCursoContent(curso_nome_bd, alunoInfoGeral);
    let curso_content = html.querySelector("#curso_content");
    let content = `<div class='bg_bimestres'>`;

    // Pega as keys reordenadas do obj bimestres_bd e usa no para
    // criar o for, eles também são utilizadas com o index do for
    // para carregar os dados ex.: "b_sortedKeys[i]"
    let bimSortedKeys = commonFunc.getReverseObjectKeys(bimestres_bd);

    for (let i = 0; i < bimSortedKeys.length; i++) {
      let aula;
      let counter = 1;
      //cria a div bimestres
      content += "<div class='bimestres'>";
      //numero de bimestres
      content += `<h2>${[bimSortedKeys[i]]}</h2>`;
      let aulaSortedKeys = commonFunc.getReverseObjectKeys(
        bimestres_bd[bimSortedKeys[i]]
      );

      for (let j = 0; j < aulaSortedKeys.length; j++) {
        //usa as keys dos dois fors, a do bimestre "ex: bimestres_1" e a key da aula
        // "ex: aula_3" para gerar o bloco aula
        aula = bimestres_bd[bimSortedKeys[i]][aulaSortedKeys[j]];
        if (counter === 1) {
          //abre a div columns quando o contador esta em 1
          content += "<div class='columns'>";
        }
        //carrega as aulas chamando a função blockAula
        //passa a key para gera o numero da aula ex: aula_1
        content += blockAula(aula, aulaSortedKeys[j], bimSortedKeys[i]);
        counter++;
        if (counter === 5) {
          content += "</div>";
          counter = 1;
        }
      } // end for
      //caso não haja aulas suficientes para terminar a columa a condição fecha a div 'columns'
      if (counter > 1) {
        content += "</div>";
      }
      //fecha a div bimestres
      content += "</div>";
      curso_content.innerHTML = content;
    }

    content += "</div>"; //fecha bg_bimestres
    resultHTML += html.innerHTML;
  });

  //adiciona o navCursos
  let navCursos = addMenuCursosAluno(alunoInfoGeral.RA, alunoInfoGeral.nome);
  navCursos
    .then((n) => {
      document
        .querySelector("#bg_cursos")
        .insertAdjacentElement("afterbegin", n);
    })
    .then(() => {
      /*Evita o bug de multiplos nav_cursos serem adicionados removendo eles 
      caso o lengh nav_cursos seja maior que 1*/
      let navC = document.querySelectorAll(".nav_cursos");
      let nLength = navC.length;
      for (let k = nLength; k > 1; k--) {
        document.querySelector("#bg_cursos").removeChild(navC[0]);
      }
      displayCursoWhenLoad();
    })
    .then(() => {
      //carrega a função de click
      addEventListenerClickAulas();
      //---------------------------------------------------------------------
      //mostra o curso que foi atualizado usando  displayCursos
      let nomeCursoAtualizado = changes[0].doc.data().curso;
      nomeCursoAtualizado = nomeCursoAtualizado
        .replace(/\s|\(|\)+/g, "_")
        .toLowerCase();
      displayCursos.displayCursoById(nomeCursoAtualizado);
      let link = document
        .querySelectorAll(".nav_cursos")[0]
        .getElementsByTagName("a");
      for (let i = 0; i < link.length; i++) {
        link[i].classList.remove("active");
      }
      let x = document.querySelectorAll(
        `[data-active="${nomeCursoAtualizado}"]`
      );
      x[0].classList.add("active");
    });

  //========================================================================

  //adiciona todo o conteúdo gerado em #bg_cursos
  document.querySelector("#bg_cursos").innerHTML = resultHTML;
}

function blockAula(aulaDados, n_aula, n_bimestre) {
  //substitui espaços em branco pelo underscore e passa para minúsculas as letras
  let id_aula = n_aula.replace(/\s+/g, "_").toLowerCase();
  let id_bimestre = n_bimestre.replace(/\s+/g, "_").toLowerCase();
  let block = `
    <div id='${id_bimestre}_${id_aula}' class="aulas aula_feita">
     <span class='btn_open_close_aulas'>
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
     <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
   </svg>
     </span>
     <div class='menu_top_block_aulas'>
     </div>
     <p>
     <span class='aula_numero'>${n_aula}</span> - 
     <span class='aula_tema'>Tema: ${aulaDados.tema}</span>
     </p>
     <div class='aula_data'>
      <p>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar3" viewBox="0 0 16 16">
            <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"/>
            <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
          </svg> ${aulaDados.data}  
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16">
            <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"/>
            <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"/>
            <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>
          </svg> ${aulaDados.horario}
       </p>
     </div>
      <div class='aula_detalhes'>
    
          <p>
            ${aulaDados.detalhes}
          </p>
      </div>
     <span class='btn_deletar_aula'>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg>
     </span>
  <span class=' btn_edit_aulas'>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
  </svg>
  </span>
  </div>
  `;
  return block;
}

function navCursosClick(event) {
  let a = document.querySelector(".nav_cursos").getElementsByTagName("a");
  for (let item of a) {
    item.classList.remove("active");
  }
  console.log(event.target.dataset.active);
  event.target.classList.add("active");
  let idCurso = event.target.dataset.active;
  console.log(idCurso);
  displayCursos.displayCursoById(idCurso);
}

async function addMenuCursosAluno(RA, nomeAluno) {
  let nomeA = document.createElement("span");
  nomeA.classList.add("title_aluno_info");
  nomeA.innerHTML = `<span class='title_info_ra'>${RA}:&nbsp;</span><span class='title_info_nome_luno'>${nomeAluno}</span>`;
  let cursos = arrayCursosAluno(RA);
  let nav = document.createElement("nav");
  let ul = document.createElement("ul");
  let id_curso;
  let menuNav = cursos
    .then((res) => {
      nav.classList.add("nav_cursos");
      res.forEach((item) => {
        id_curso = item.replace(/\s+|\(|\)/g, "_").toLowerCase();
        ul.innerHTML += `<li><a data-active='${id_curso}'>${item}</a></li>`;
      });
    })
    .then(() => {
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

function displayCursoWhenLoad() {
  //adiciona class "active" no primeiro elemento do navCursos
  let navCursos = document
    .querySelector(".nav_cursos")
    .getElementsByTagName("a")[0];
  navCursos.classList.add("active");
  //mostra o primeiro curso do menu navCursos
  displayCursos.displayCursoById(navCursos.dataset.active);
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

function addEventListenerClickAulas() {
  let btn_open_close_aulas = document.querySelectorAll(".btn_open_close_aulas");

  btn_open_close_aulas.forEach((element) => {
    element.addEventListener("click", (e) => {
      let parent = element.parentElement;
      let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

      svg.setAttribute("width", "16");
      svg.setAttribute("height", "16");
      svg.setAttribute("fill", "currentColor");
      svg.setAttribute("viewBox", "0 0 16 16");
      svg.classList.add("bi", "bi-chevron-down");

      let pathCloseIcon =
        '<path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>';
      let pathOpenIcon =
        '<path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>';
      e.target.innerHTML = "";

      parent.classList.toggle("open_aula");
      if (parent.classList.contains("open_aula")) {
        //shows when it wast open
        svg.innerHTML = pathOpenIcon;
      } else {
        //e.target.classList.remove('icon_open_aula')
        svg.innerHTML = pathCloseIcon;
      }
      e.target.appendChild(svg);
    });
  });
}
