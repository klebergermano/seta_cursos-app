ImportHtml("./components/controle_aula/formAddAula.html", "#bg_forms_add", "./modules/controle_aula/formAddAluno.js");
function changeCSSDisplay(targetName, displayValue) {
  document.querySelector(targetName).style.display = displayValue;
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

function blockAula(aula) {
  let num = 0;
  let block = `
<div id='b1_aula_${num}' class="aulas aula_feita">
   <span class='btn_open_close_aulas'>&#706;</span>
   <p>Aula: ${num} - ${aula.tema}</p>
   <div class='aula_data'>
   <p>Data: 25/02/2021</p>
   </div>
   <div class='aula_detalhes'>
      <p>
         Detalhes: ${aula.detalhes}
      </p>
   </div>"
</div>
`;
  return block;
}
//Insere as aulas na página

function InsertBlockAulas(alunoData) {
  let a_bimestres;
  //dados do firerstore
  alunoData.forEach((res) => {
    res = res.data();
    let curso_nome = res.curso;
    a_bimestres = res.bimestres;
    let aulas_bimestre = `<h1>${curso_nome}</h1>`;
    let num_bimestre = 1;

    for (key in a_bimestres) {
      let aula;
      let counter = 1;
      //cria a div bimestres
      aulas_bimestre += "<div class='bimestres'>";
      //numero de bimestres
      //TODO alterar o numero generico para o numero do bimestre que vem do DB
      aulas_bimestre += `<h2>Bimestre ${num_bimestre}</h2>`;
      num_bimestre++;
      for (aulaKey in a_bimestres[key]) {
        aula = a_bimestres[key][aulaKey];
        if (counter === 1) {
          aulas_bimestre += "<div class='columns'>";
        }
        //carrega as aulas chamando a função blockAula
        aulas_bimestre += blockAula(aula);
        counter++;
        if (counter === 5) {
          aulas_bimestre += "</div>";
          counter = 1;
        }
      }
      //caso não haja aulas suficientes para terminar a columa a condição fecha a div 'columns'
      if (counter > 1) {
        aulas_bimestre += "</div>";
      }
      //fecha a div bimestres
      aulas_bimestre += "</div>";
    }
    document
      .querySelector("#bg_bimestres")
      .insertAdjacentHTML("afterbegin", aulas_bimestre);
  });
  //-------------------------------------------------------
  //carrega a função de click
  addEventListenerClickAulas();
}


async function selectAluno() {
  let RA = document.querySelector("#select_aluno");
  let x = RA.selected;
  console.log(x);
  const alunoDB = await alunoHistoricoDB("RA01");
  InsertBlockAulas(alunoDB);
}


(async function InsertSelectAlunos() {
  let alunos = db.collection("aluno_historico").get();
  alunos.then((res) => {
    let selectAluno = ``;
    res.forEach((item) => {
      selectAluno += `<option value='${item.id}'>${item.id} - ${
        item.data().nome
      }</option>`;
    });
    document.querySelector("#select_aluno").innerHTML = selectAluno;
  });
})();

//--------------------Firerbase----------------------------
function alunoHistoricoDB(RA) {
  let alunoHistorico = db
    .collection("aluno_historico")
    .doc(RA)
    .collection("cursos")
    .get();
  return alunoHistorico;
}

//--------------------Carrega funções----------------------------

(async function loadDocuments() {
   const alunoDB = await alunoHistoricoDB('RA01');
   InsertBlockAulas(alunoDB);
  // formAddAluno();
  // formAddAula();
  //AddEventBtnCloseForm();
  //navAddFormsDisplayEvent();
  //eventFormAddAluno();

})();
//----------------------------------------------------------
