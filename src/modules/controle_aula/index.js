ImportHtml(
  "./components/controle_aula/formAddAula.html",
  "#bg_forms_add",
  "./modules/controle_aula/formAddAluno.js"
);

function insertAulasWhenChangeAluno() {
  let select = document.querySelector("#select_aluno");
  select.addEventListener("input", () => {
    let RA = select.options[select.selectedIndex].value;
    realTimeDataAlunoHistorico(RA);
    //carrega o primeiro curso do menu navC
    setSelectedInSelectAlunoAddAula(RA);
  });
}

function setSelectedInSelectAlunoAddAula(RA) {
  //Remove o select das options "select_aluno" e adiciona selected no item salvo
  let select_aluno = document.querySelector("#select_aluno_add_aula");
  let allOptions = select_aluno.options;
  //limpa o selected=true de todas as opções do select.
  for (item of allOptions) {
    item.removeAttribute("selected");
  }
  //Readiciona os mesmos options no select para garantir que a option com
  //selected=true funcione
  select_aluno.innerHTML = select_aluno.innerHTML;

  //adiciona o select=true na opção com o RA que acabou de ser salvo
  let option = select_aluno.querySelector(`option[value='${RA}']`);
  option.setAttribute("selected", true);
}

function addEventListenerClickAulas() {
  let btn_open_close_aulas = document.querySelectorAll(".btn_open_close_aulas");

  btn_open_close_aulas.forEach((element) => {
    element.addEventListener("click", (e) => {
      let parent = element.parentElement;
      //let children = Array.from(parent.children);
      parent.classList.toggle("open_aula");
      if (parent.classList.contains("open_aula")) {
        e.target.innerHTML = "&#709;";
      } else {
        e.target.innerHTML = "&#706;";
      }
    });
  });
}

function blockAula(aulaDados, n_aula, n_bimestre) {
  //substitui espaços em branco pelo underscore e passa para minúsculas as letras
  let id_aula = n_aula.replace(/\s+/g, "_").toLowerCase();
  let id_bimestre = n_bimestre.replace(/\s+/g, "_").toLowerCase();
  let block = `
  <div id='${id_bimestre}_${id_aula}' class="aulas aula_feita">
   <span class='btn_open_close_aulas'>&#706;</span>
   <p>${n_aula} - ${aulaDados.tema}</p>
   <div class='aula_data'>
   <p>Data: 25/02/2021</p>
   </div>
   <div class='aula_detalhes'>
      <p>
         Detalhes: ${aulaDados.detalhes}
      </p>
   </div>
</div>
`;
  return block;
}


async function addMenuCursosAluno(RA, nomeAluno = 'Fulano de Talzes') {
  let nomeA = document.createElement('span');
  nomeA.innerHTML = RA +': Fulano de Talzes'; 
  let cursos = arrayCursosAluno(RA);
  let nav = document.createElement("nav");
  let ul = document.createElement("ul");
  let id_curso;
  let menuNav = cursos
    .then((res) => {
      nav.classList.add("nav_cursos");

      res.forEach((item) => {
        id_curso = item.replace(/\s+/g, "_").toLowerCase();
        ul.innerHTML += `<li><a data-active='${id_curso}' onClick='navCursosClick(event)'>${item}</a></li>`;
      });
    })
    .then(() => {
      nav.appendChild(ul);
      nav.insertAdjacentElement('afterbegin', nomeA);
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

function criaHtmlCursoContent (curso_nome_bd, alunoInfoGeral){
  id_curso = curso_nome_bd.replace(/\s+/g, "_").toLowerCase();


  let htmlAula = document.createElement("div");
  htmlAula.innerHTML = `
  <div class='bg_curso' id='${id_curso}'>
    <div class='title_info'>
    <span>
    <span class='title_aluno_nome'>${alunoInfoGeral.nome}</span> 

      <span class='title_ra'>${alunoInfoGeral.RA}:</span>
      </span>
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
      id_curso = curso_nome_bd.replace(/\s+/g, "_").toLowerCase();
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
  let navCursos = addMenuCursosAluno(alunoInfoGeral.RA);
  navCursos.then((n)=>{
    document
    .querySelector("#bg_cursos")
    .insertAdjacentElement("afterbegin", n);
  }).then(()=>{
    displayCursoWhenLoad();


  }).then(()=>{
     //carrega a função de click
  addEventListenerClickAulas();
//---------------------------------------------------------------------
    //mostra o curso que foi atualizado usando  displayCursos
    let nomeCursoAtualizado = changes[0].doc.data().curso;
    nomeCursoAtualizado = nomeCursoAtualizado.replace(/\s+/g, "_").toLowerCase();
    displayCursos(nomeCursoAtualizado);
   let link = document.querySelectorAll('.nav_cursos')[0].getElementsByTagName('a');
    for(let i = 0; i < link.length; i++){
    link[i].classList.remove('active');
  };
    let x = document.querySelectorAll(`[data-active="${nomeCursoAtualizado}"]`);
    x[0].classList.add('active');
  });
//-------------------------------------------------------------------

  //adiciona todo o conteúdo gerado em #bg_cursos
  document.querySelector("#bg_cursos").innerHTML = resultHTML;
}

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
  });
})();

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
      alunoH.then((aluno)=>{
          alunoInfoGeral.then((res) => {
            InsertBlockAulas(aluno, res, changes);
          })
      });
    });
}

//--------------------Carrega funções----------------------------
(async function loadDocuments() {
  insertAulasWhenChangeAluno();
  realTimeDataAlunoHistorico("RA01");
})();
//----------------------------------------------------------
