//formAddAuluno.js utiliza funções disponivéis no index.js
ImportHtml(
  "./components/controle_aula/formAddAula.html",
  "#bg_forms_add",
  "./modules/controle_aula/formAddAluno.js"
);

(async function InsertSelectAlunos() {
  db.collection("aluno_historico").onSnapshot((snap) => {
    let selectAluno = ``;
    snap.forEach((item) => {
      selectAluno += `<option value='${item.id}'>${item.id} - ${
        item.data().nome
      }</option>`;
    });
    document.querySelector("#select_aluno").innerHTML = selectAluno;
    //insere options do select no "select_aluno_add_aula"
    document.querySelector("#select_aluno_add_aula").innerHTML = selectAluno;
    //insere options do select no "select_aluno_add_curso"
    document.querySelector("#select_aluno_add_curso").innerHTML = selectAluno;
  });
})();

function insertOptionsAddAlunoRA() {
  let dataList = document.querySelector("#add_aluno_datalist_ra");
  let options = createOptionsRA();
  options.then((res) => {
    dataList.innerHTML = res;
  });
}
function blockSubmitForm(form) {
  form.querySelector("input[type='submit']").setAttribute("disabled", true);
}
function removeblockSubmitForm(form) {
  form.querySelector("input[type='submit']").removeAttribute("disabled");
}
function createOptionsRA() {
  let array = "";
  let listAlunoRA = getAlunosListRA();
  let options = listAlunoRA.then((listRA) => {
    listRA.forEach((list) => {
      console.log(list);
      array += `<option value='${list}' />`;
    });
    return array;
  });

  return options;
}
function validaSelectOptionsAddAluno() {
  form = document.querySelector("#form_add_aluno");
  document.querySelector("#add_aluno_ra").addEventListener("input", (e) => {
    let inputRA = e.target.value;
    let listAlunoRA = getAlunosListRA();
    let valida = listAlunoRA.then((listRA) => {
      for (let i = 0; i <= listRA.length - 1; i++) {
        if (inputRA.toUpperCase() === listRA[i]) {
          e.target.classList.add("blocked");
          blockSubmitForm(form);
          return false;
        } else {
          removeblockSubmitForm(form);
          e.target.classList.remove("blocked");
        }
      }
    });
    return valida;
  });
}

function getAlunosListRA() {
  let alunosList = db.collection("aluno_historico").get();
  let IDs = [];
  let alunoListRA = alunosList.then((res) => {
    res.forEach((item) => {
      IDs.push(item.id);
    });
    return IDs.reverse();
  });
  return alunoListRA;
}

function eventSelectAlunoAddCurso() {
  let aluno = document.querySelector("#select_aluno_add_curso");
  aluno.addEventListener("input", (e) => {
    validaSelectOptionsAddCurso();
  });
}

function validaSelectOptionsAddCurso() {
  let selectAluno = document.querySelector("#select_aluno_add_curso");
  let RA = selectAluno.options[selectAluno.selectedIndex].value;
  let cursos = getKeysCursos(RA);
  cursos.then((res) => {
    blockSelectOptionsAddCurso(res);
  });
}
function blockSelectOptionsAddCurso(cursos) {
  let selectCurso = document.querySelector("#add_curso_nome_curso");
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

function getKeysCursos(RA) {
  let aluno = alunoHistoricoDB(RA);
  let cursos = [];
  let keys = aluno.then((res) => {
    res.forEach((item) => {
      cursos.push(item.data().curso);
    });
    return cursos;
  });
  return keys;
}

function validaFormAddAulaOptionsAulaNumero() {
  let infoAula;
  infoAula = getInfoFormAddAula();
  blockSelectOptionsAddAulas(infoAula.RA, infoAula.curso, infoAula.bimestre);
}

function enableSelectAulaNumeroWhenBimestreChange() {
  document.querySelector("#aula_numero").removeAttribute("disabled");
  setSelectAulaDefaultWhenBimestreChange();
}
function setSelectAulaDefaultWhenBimestreChange() {
  let select = document.querySelector("#aula_numero");
  select.selectedIndex = 0;
}

function getInfoFormAddAula() {
  let infoAddAula = {};
  let selectAluno = document.querySelector("#select_aluno_add_aula");
  let ra = document.querySelector("#select_aluno_add_aula").options[
    selectAluno.selectedIndex
  ].value;

  let selectCurso = document.querySelector("#select_curso_add_aluno");
  let curso = document.querySelector("#select_curso_add_aluno").options[
    selectCurso.selectedIndex
  ].value;

  let selectBimestre = document.querySelector("#select_bimestre_add_aluno");
  let bimestre = document.querySelector("#select_bimestre_add_aluno").options[
    selectBimestre.selectedIndex
  ].value;

  infoAddAula.RA = ra;
  infoAddAula.curso = curso;
  infoAddAula.bimestre = bimestre;
  return infoAddAula;
}

function blockSelectOptionsAddAulas(RA, curso, bimestre) {
  //Bloqueia as options do select #aula_numero no formulário form_add_aula
  let select = document.querySelector("#aula_numero");
  let aulasKeys = getKeysAulas(RA, curso, bimestre);
  aulasKeys.then((res) => {
    //if evita o primeira execução do código desnecessária caso o array seja vazio.
    if (res) {
      //options[i] são as options do select
      for (let i = 0; i <= select.options.length - 1; i++) {
        //remove o attributo disable setado anteriormente
        if (select.options[i].value !== "") {
          select.options[i].removeAttribute("disabled");
        }
        //res[j] são as aulas ja feitas
        for (let j = 0; j <= res.length; j++) {
          if (res[j] === select.options[i].value) {
            select.options[i].setAttribute("disabled", "true");
          }
        }
      }
    }
  });
}
function getKeysAulas(RA, curso, bimestre) {
  let aluno = alunoHistoricoDB(RA);

  let keysAulas = [];
  let keys = aluno.then((res) => {
    res.forEach((e) => {
      if (e.data().curso === curso) {
        if (e.data().bimestres[bimestre]) {
          keysAulas = Object.keys(e.data().bimestres[bimestre]);
        } else {
          return false;
        }
      }
    });
    return keysAulas;
  });
  return keys;
}

function eventChangeSelectAlunoAddCurso() {
  document
    .querySelector("#select_curso_add_aluno")
    .addEventListener("input", (e) => {
      validaFormAddAulaOptionsAulaNumero();
    });
  document
    .querySelector("#select_bimestre_add_aluno")
    .addEventListener("input", (e) => {
      validaFormAddAulaOptionsAulaNumero();
      enableSelectAulaNumeroWhenBimestreChange();
    });
}

function insertAulasWhenChangeAluno() {
  let select = document.querySelector("#select_aluno");
  select.addEventListener("input", () => {
    let RA = select.options[select.selectedIndex].value;
    realTimeDataAlunoHistorico(RA);
    //carrega o primeiro curso do menu navC
    // setSelectedInSelectAlunoAddAulaAndAddCurso(RA);

    setSelectedInASelectBasedOnRA("#select_aluno_add_aula", RA);
    setSelectedInASelectBasedOnRA("#select_aluno_add_curso", RA);
    //quando o select_aluno é alterado chama a função para carregar as opções
    //de cursos em select_aluno_add_aula
    insertSelectCursosAddAula(RA);
  });
}
//Seta as opções de cursos em select_curso_add_aluno;
function insertSelectCursosAddAula(RA) {
  let aluno = db
    .collection("aluno_historico")
    .doc(RA)
    .collection("cursos")
    .get();
  let option = ``;
  aluno
    .then((al) => {
      al.forEach((item) => {
        option += `<option>${item.data().curso}</option>`;
      });
    })
    .then(() => {
      document.querySelector("#select_curso_add_aluno").innerHTML = option;
    })
    .then(() => {
      eventChangeSelectAlunoAddCurso();
    })
    .then(() => {
      validaFormAddAulaOptionsAulaNumero();
    });
}

function setSelectedInASelectBasedOnRA(idSelectTarget, RA) {
  //Remove o select das options "select_aluno" e adiciona selected no item salvo
  let select = document.querySelector(idSelectTarget);
  let allOptions = select.options;

  //limpa o selected=true de todas as opções do select.
  for (item of allOptions) {
    item.removeAttribute("selected");
  }
  //Readiciona os mesmos options no select para garantir que a option com
  //selected=true funcione
  select.innerHTML = select.innerHTML;
  //adiciona o select=true na opção com o RA que acabou de ser salvo
  let option = select.querySelector(`option[value='${RA}']`);
  option.setAttribute("selected", true);
}

function addEventListenerClickAulas() {
  let btn_open_close_aulas = document.querySelectorAll(".btn_open_close_aulas");

  btn_open_close_aulas.forEach((element) => {
    element.addEventListener("click", (e) => {
      let parent = element.parentElement;
      let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      svg.setAttribute('width', '16' );
      svg.setAttribute('height', '16' );
      svg.setAttribute('fill', 'currentColor' );
      svg.setAttribute('viewBox', '0 0 16 16' );
      svg.classList.add('bi', 'bi-chevron-down');

let pathCloseIcon = '<path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>';
let pathOpenIcon = '<path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>';
e.target.innerHTML = '';
     
      
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
//&#709;
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
        ul.innerHTML += `<li><a data-active='${id_curso}' onClick='navCursosClick(event)'>${item}</a></li>`;
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
  displayCursos(navCursos.dataset.active);
}

function displayCursos(idCurso) {
  document.querySelectorAll(".bg_curso").forEach((item) => {
    item.style.display = "none";
  });
  document.querySelector("#" + idCurso).style.display = "block";
}

function navCursosClick(e) {
  let a = document.querySelector(".nav_cursos").getElementsByTagName("a");
  for (let item of a) {
    item.classList.remove("active");
  }

  e.target.classList.add("active");
  idCurso = e.target.dataset.active;
  displayCursos(idCurso);
}

function sortObjectKeys(obj) {
  let objKeys = Object.keys(obj);
  let sortedObjKeys = objKeys.sort();
  sortedObjKeys.reverse();
  return sortedObjKeys;
}

function criaHtmlCursoContent(curso_nome_bd) {
  id_curso = curso_nome_bd.replace(/\s+|\(|\)/g, "_").toLowerCase();

  let htmlAula = document.createElement("div");
  htmlAula.innerHTML = `
  <div class='bg_curso' id='${id_curso}'>
    <div class='title'>
      <span class='title_curso_nome ${id_curso}'>${curso_nome_bd}</span>
      </div><div id='curso_content'>
    </div>
  </div>`;
  return htmlAula;
}

//Insere as aulas na página
function InsertBlockAulas(alunoData, alunoInfoGeral, changes) {
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
    let bimSortedKeys = sortObjectKeys(bimestres_bd);

    for (let i = 0; i < bimSortedKeys.length; i++) {
      let aula;
      let counter = 1;
      //cria a div bimestres
      content += "<div class='bimestres'>";
      //numero de bimestres
      content += `<h2>${[bimSortedKeys[i]]}</h2>`;
      let aulaSortedKeys = sortObjectKeys(bimestres_bd[bimSortedKeys[i]]);

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
      displayCursos(nomeCursoAtualizado);
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
  //-------------------------------------------------------------------

  //adiciona todo o conteúdo gerado em #bg_cursos
  document.querySelector("#bg_cursos").innerHTML = resultHTML;
}

async function getAlunoInfoGeral(RA) {
  let alunoInfo = await db
    .collection("aluno_historico")
    .doc(RA)
    .get()
    .then((res) => {
      return res.data();
    });
  alunoInfo.RA = RA;
  return alunoInfo;
}

function arrayCursosAluno(RA) {
  let aluno = alunoHistoricoDB(RA);
  let result = aluno.then((res) => {
    let cursos = [];
    res.forEach((e) => {
      cursos.push(e.data().curso);
    });
    return cursos;
  });
  return result;
}

//--------------------Firerbase----------------------------
function alunoHistoricoDB(RA) {
  let alunoHistorico = db
    .collection("aluno_historico")
    .doc(RA)
    .collection("cursos")
    .get();

  return alunoHistorico;
}

function realTimeDataAlunoHistorico(RA) {
  db.collection("aluno_historico")
    .doc(RA)
    .collection("cursos")
    .onSnapshot((snap) => {
      let changes = snap.docChanges();
      let alunoInfoGeral = getAlunoInfoGeral(RA);
      let alunoH = alunoHistoricoDB(RA);
      alunoH.then((aluno) => {
        alunoInfoGeral.then((res) => {
          InsertBlockAulas(aluno, res, changes);
        });
      });
    });
}

//--------------------Carrega funções----------------------------
(async function loadDocuments() {
  insertAulasWhenChangeAluno();
  realTimeDataAlunoHistorico("RA01");
})();
//----------------------------------------------------------
