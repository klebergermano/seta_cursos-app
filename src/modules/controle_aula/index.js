const { dialog } = require("electron");

ImportHtml("./components/controle_aula/formAddAula.html", "#bg_forms_add");

//Display formulário "Add Aluno"
(() => {
  document.querySelector("#btn_add_aluno").addEventListener("click", (e) => {
    document.querySelector("#form_add_aluno").style.display = "block";
    document.querySelector(".block_screen").style.display = "block";
  });
     document.querySelector("#btn_add_aula").addEventListener("click", (e) => {
    document.querySelector("#form_add_aula").style.display = "block";
    document.querySelector(".block_screen").style.display = "block";
  });
})();

function AddEventBtnCloseForm() {
  document.querySelectorAll(".close_form").forEach((item) => {
    item.addEventListener("click", (e) => {
     closeForm(e);
    });
  });
}


function closeForm(e) {
      let parent = e.target.parentElement;
      parent.style.display = "none";
      document.querySelector(".block_screen").style.display = "none";
}

function formAddAula() {
  document.querySelector("#form_add_aula").addEventListener("submit", (e) => {
    e.preventDefault();
    let form = e.target;
    try {
      aulaHistorico = db
        .collection("aluno_historico")
        .doc("RA02")
        .collection("cursos")
        .doc("IFC")
        .update({
          "bimestres.bimestre_1": "FUlano dtestse tlsket slt e",
        });
    } catch (err) {
      console.log("Houve um erro", err);
    }
  });
}

function formAddAluno() {
  document.querySelector("#form_add_aluno").addEventListener("submit", (e) => {
    e.preventDefault();
    let form = e.target;
    let alunoHistorico = db.collection("aluno_historico");
    alunoHistorico
      .doc(form.ra.value)
      .collection("cursos")
      .doc(form.curso.value)
      .set({
        bimestres: {
          bimestre_1: {},
        },
      })
      .then(function () {
       function showMessage(targetID, message){
        document.getElementById(targetID).innerHTML = `<div class='show_message'>${message}</div>`
       }
      showMessage('form_add_aluno', 'Aluno salvo com sucess!');
      }).then(()=>{
        setTimeout(()=>{
          closeForm(e);

        }, 1500);
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });

    alunoHistorico
      .doc(form.ra.value)
      .set({ nome: form.nome.value }, { merge: true });
  });
}

function formAddAula2() {
  // document.querySelector('#form_add_aula')
  // e.preventDefault();
  // let form =  e.target;
  let alunoHistorico = db
    .collection("aluno_historico")
    .doc("RA02")
    .collection("cursos")
    .doc("IFC")
    .set({
      bimestres: {
        bimestre_1: {
          aula_1: {
            data: "24/01/2021",
            horario: "8:00h às 10:00h",
            tema: "Folders e Pastas",
            detalhes: "LÇores rekr lsejrsklejr skjer sj lfjslfjlas fls f",
          },
        },
      },
    });
}
//formAddAula2();

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
}

//--------------------Firerbase
(function alunoHistoricoDB() {
  let alunoHistorico = db
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
      //form
      formAddAula();
      formAddAluno();
    })
    .then(() => {
      AddEventBtnCloseForm();
    });
})();

//----------------------------------------------------------
