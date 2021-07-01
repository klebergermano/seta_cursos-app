const { rmSync } = require("original-fs");

function addEventListenerClickAulas() {
  let aulas = document.querySelectorAll(".aulas");
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

function InsertBlockAulas(alunoData) {
  console.log(alunoData);
  let a_bimestres;

  //data do db
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
      num_bimestre ++;
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
      if(counter > 1){
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


}

//--------------------Firerbase
const alunoHistorico = db
  .collection("aluno_historico")
  .doc("RA01")
  .collection("cursos")
  .get();

alunoHistorico
  .then((data) => {
    //chama a função que insere os cursos/bimestres/aulas
    InsertBlockAulas(data);
  })
  .then(() => {
    //carrega a função de click 
    addEventListenerClickAulas();
  });
//----------------------------------------------------------
