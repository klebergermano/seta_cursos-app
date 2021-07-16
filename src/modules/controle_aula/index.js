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
  // displayCursoWhenLoad(); //TODO CONFERIR NECESSIDADE
  });
}
/*
function insertAulasWhenChangeAlunoXXXXXXXXXXXXXXXX() {
  let select = document.querySelector("#select_aluno");
  select.addEventListener("input", () => {
    let RA = select.options[select.selectedIndex].value;
    const alunoDB = alunoHistoricoDB(RA);

    alunoDB
      .then((data) => {
        InsertBlockAulas(data);
      })
      .then(() => {
        //carrega o primeiro curso do menu navC
        displayCursoWhenLoad();
      });
  });
}
*/
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

function displayCursoWhenLoad() {
  //adiciona class "active" no primeiro elemento do navCursos
  let navElement = document
    .querySelector(".nav_cursos")
    .getElementsByTagName("a")[0];
  navElement.classList.add("active");
  //mostra o primeiro curso do menu navCursos
  displayCursos(navElement.dataset.active);
}

function displayCursos(idCurso) {
  document.querySelector(".bg_curso").style.display = "none";
  document.getElementById(idCurso).style.display = "block";
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
//Insere as aulas na página
function InsertBlockAulas(alunoData) {
  //dados do firerstore
  let resultHTML = "";
  navCursos = document.createElement("nav");
  navCursos.classList.add("nav_cursos");
  navCursos.appendChild(document.createElement("ul"));

  alunoData.forEach((res) => {

if(typeof res.data !== 'undefined'){ 
res = res.data()
}else{
res = res.doc.data()
}
    let bimestres_bd = res.bimestres;
    let curso_nome_bd = res.curso;
    let id_curso;
    //evita erro por undefined no nome do curso
    if (curso_nome_bd) {
      id_curso = curso_nome_bd.replace(/\s+/g, "_").toLowerCase();
    }

    let html = document.createElement("div");
    html.innerHTML = `<div class='bg_curso' id='${id_curso}'><h3>${curso_nome_bd}</h3><div id='curso_content'></div></div>`;
    navCursos.getElementsByTagName(
      "ul"
    )[0].innerHTML += `<li><a data-active='${id_curso}' onClick='navCursosClick(event)'>${curso_nome_bd}</a></li>`;
    let curso_content = html.querySelector("#curso_content");
    let content = `<div class='bg_bimestres'>`;
    for (bimestreKey in bimestres_bd) {
      let aula;
      let counter = 1;
      //cria a div bimestres
      content += "<div class='bimestres'>";
      //numero de bimestres
      //TODO alterar o numero generico para o numero do bimestre que vem do DB
      content += `<h2>${bimestreKey}</h2>`;
      for (aulaKey in bimestres_bd[bimestreKey]) {
        //usa as keys dos dois fors, a do bimestre "ex: bimestres_1" e a key da aula
        // "ex: aula_3" para gerar o bloco aula
        aula = bimestres_bd[bimestreKey][aulaKey];
        if (counter === 1) {
          //abre a div columns quando o contador esta em 1
          content += "<div class='columns'>";
        }
        //carrega as aulas chamando a função blockAula
        //passa a key para gera o numero da aula ex: aula_1
        content += blockAula(aula, aulaKey, bimestreKey);
        counter++;
        if (counter === 5) {
          content += "</div>";
          counter = 1;
        }
      }
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
  //adiciona todo o conteúdo gerado em #bg_cursos
  document.querySelector("#bg_cursos").innerHTML = resultHTML;
  document
    .querySelector("#bg_cursos")
    .insertAdjacentElement("afterbegin", navCursos);

  //-------------------------------------------------------
  //carrega a função de click
  addEventListenerClickAulas();

  //carrega o primeiro curso do navCursos
  displayCursoWhenLoad();
}

(async function InsertSelectAlunos() {
 
 db.collection("aluno_historico").onSnapshot((snap)=>{
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

(async function InsertSelectAlunosXXXXXXXXX() {
  let alunos = db.collection("aluno_historico").get();
  alunos.then((res) => {
    let selectAluno = ``;
    res.forEach((item) => {
      selectAluno += `<option value='${item.id}'>${item.id} - ${
        item.data().nome
      }</option>`;
    });
    document.querySelector("#select_aluno").innerHTML = selectAluno;
    //insere optolns no select no "select_aluno_add_aula"
    document.querySelector("#select_aluno_add_aula").innerHTML = selectAluno;
  });
})();

//--------------------Firerbase----------------------------
function alunoHistoricoDB(RA) {

  let alunoHistorico = db
    .collection("aluno_historico")
    .doc(RA)
    .collection("cursos")
    .get();
     console.log(alunoHistorico);
    return alunoHistorico;
}

function realTimeDataAlunoHistorico(RA){
  db.collection("aluno_historico")
  .doc(RA)
  .collection("cursos")
  .onSnapshot((snap) => {
    let changes = snap.docChanges();
    InsertBlockAulas(changes); 
  });
}

//--------------------Carrega funções----------------------------
(async function loadDocuments() {
  //const alunoDB = await alunoHistoricoDB("RA01");
  //InsertBlockAulas(alunoDB);
  insertAulasWhenChangeAluno();
  realTimeDataAlunoHistorico("RA01")

  // formAddAluno();
  // formAddAula();
  //AddEventBtnCloseForm();
  //navAddFormsDisplayEvent();
  //eventFormAddAluno();
})();
//----------------------------------------------------------




