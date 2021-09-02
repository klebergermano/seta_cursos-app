import * as commonFunc from "../common/commonFunctions.js";
import * as dbAlunoHistFunc from "../common/dbAlunoHistoricoFunc.js";
import * as formAddAluno from "./formAddAluno.js";
import * as formEditAulas from "./formEditAula.js";

export async function insertFormAddAulaHTML() {
  commonFunc.insertElementHTML('#page_content',
    './components/controle_aula/formAddAula.html', eventsFormAddAula);
}

 export function eventsFormAddAula(form) {
  form.querySelector('.btn_close_form').addEventListener('click', (e) => {
    commonFunc.removeElementChild('#page_content', '#form_add_aula', () => {
      commonFunc.changeCSSDisplay('#block_screen', 'none')
    });
  })
  form.addEventListener("submit", (e) => {
    submitformAddAula(e);
   });
  //Bloqueia o fundo com o "#block_screen".
  commonFunc.changeCSSDisplay('#block_screen', 'block')
  //Copia as opções do "#main_select_aluno" e insere no select_aluno
  insertOptionsInSelectAluno(form)
  //insere as opções de curso e seta o selecionado.
  insertOptionsInSelectCurso(form)
  form.querySelector('#select_bimestre').addEventListener('change', (e) => {
    form.querySelector('#select_aula').removeAttribute('disabled');
    validaSelectAula(form)
  });;
}

function insertOptionsInSelectAluno(form) {
  let select = form.querySelector('#select_aluno');
  let mainSelect = document.querySelector('#main_select_aluno');
  select.innerHTML = mainSelect.innerHTML;
  select.selectedIndex = mainSelect.selectedIndex;
  select.setAttribute('disabled', true);
}

//Seta as opções de cursos em select_curso_add_aluno;
function insertOptionsInSelectCurso(form) {
  let select = form.querySelector('#select_aluno');
  let RA = select.options[select.selectedIndex].value;
  let aluno = dbAlunoHistFunc.getAlunoHistCursosDB(RA);
  let option = ``;
  aluno.then((res) => {
    res.forEach((item) => {
      option += `<option value='${item.data().curso}'>${item.data().curso}</option>`;
    });
  })
    .then(() => {
      form.querySelector("#select_curso").innerHTML = option;
    }).then(() => {
      setSelectedInCurso(form)
    })
}
function setSelectedInCurso(form) {
  let navCursos = document.querySelector('.nav_cursos_aluno');
  let activeCurso = navCursos.querySelector('.active').dataset.active;
  let select = form.querySelector('#select_curso');
  select.setAttribute('disabled', true);
  for (let i = 0; i <= select.options.length - 1; i++) {
    if (commonFunc.stringToID(select.options[i].value) === activeCurso) {
      select.options[i].setAttribute('selected', true);
    };
  }
}

function validaSelectAula(form) {
  let infoAula;
  infoAula = getInfoFormAddAula(form);
  blockSelectOptionsAddAulas(infoAula.RA, infoAula.curso, infoAula.bimestre);
}

function getInfoFormAddAula(form) {
  console.log(form);
  let infoAddAula = {};
  let selectAluno = form.querySelector("#select_aluno");

  let RA = selectAluno.options[selectAluno.selectedIndex].value;
  console.log(RA);

  let selectCurso = form.querySelector("#select_curso");
  let curso = selectCurso.options[
    selectCurso.selectedIndex
  ].value;

  let selectBimestre = form.querySelector("#select_bimestre");
  let bimestre = selectBimestre.options[
    selectBimestre.selectedIndex
  ].value;

  infoAddAula.RA = RA;
  infoAddAula.curso = curso;
  infoAddAula.bimestre = bimestre;
  return infoAddAula;
}
function blockSelectOptionsAddAulas(RA, curso, bimestre) {
  //Bloqueia as options do select #aula_numero no formulário form_add_aula
  let select = document.querySelector("#select_aula");
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

function blocoAddAula(dados) {
  let aula = {
    [dados.select_bimestre.value]: {
      [dados.select_aula.value]: {
        tema: dados.tema.value,
        data: dados.data.value,
        horario: dados.horario.value,
        detalhes: dados.detalhes.value,
      },
    },
  };
  return aula;
}

function submitformAddAula(e) {
  e.preventDefault();
  let form = e.target;
  let RA = form.select_aluno.value;
  let aulaHistorico;
  aulaHistorico = db
    .collection("aluno_historico")
    .doc(RA)
    .collection("cursos")
    .doc(form.select_curso.value)
    .set(
      {
        bimestres: blocoAddAula(form)
      },
      { merge: true }
    )
    .then(() =>
      commonFunc.showMessage("form_add_aula", "Aula adicionada com sucesso!")
    )
    .then(() => {
      setTimeout(() => {
        commonFunc.removeElementChild('#page_content', '#form_add_aula',()=>{
          commonFunc.changeCSSDisplay('#block_screen', 'none')
        });
      }, 1500);
    }).catch((error) => console.error("Error writing document: ", error));
}

function getKeysAulas(RA, idCurso, bimestre) {
  let aluno = dbAlunoHistFunc.getAlunoHistCursosDB(RA);
  let keysAulas = [];
  let nomeCursoBD;
  let keys = aluno.then((res) => {
    res.forEach((e) => {
      //nomeCursoBD = commonFunc.stringToID(e.data().curso);
      if (e.data().curso === idCurso) {
        if (e.data().bimestres[bimestre]) {
          keysAulas = Object.keys(e.data().bimestres[bimestre]);
        }
      }
    });
  }).then(() => {
    return keysAulas;
  }).catch((err) => { console.log(err) });
  return keys;
}



