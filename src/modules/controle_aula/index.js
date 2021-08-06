import * as commonFunc from "../common/commonFunctions.js";
import * as dbFunc from "../common/dbFunctions.js";
import * as insertAulasCursosFunc from "./InsertAulasCursosFunc.js";
import * as dbAlunoHistFunc from "../common/dbAlunoHistoricoFunc.js";

//commonFunc.changeCSSDisplay
//========================================================================================================
//======================================= FORM ========================================================
//========================================================================================================

function eventFormsAdd() {
  document.querySelector("#form_add_aluno").addEventListener("submit", (e) => {
    formAddAluno(e);
  });
  document.querySelector("#form_add_aula").addEventListener("submit", (e) => {
    formAddAula(e);
  });
  document.querySelector("#form_add_curso").addEventListener("submit", (e) => {
    formAddCurso(e);
  });
}

function formAddCurso(e) {
  e.preventDefault();
  let form = e.target;
  let RA = form.select_aluno_add_curso.value;
  let alunoHistorico = db.collection("aluno_historico");
  alunoHistorico
    .doc(RA)
    .collection("cursos")
    .doc(form.add_curso_nome_curso.value)
    .set(
      {
        curso: form.add_curso_nome_curso.value,
        bimestres: {
          ["bimestre 1"]: {},
        },
      },
      { merge: true }
    )

    //Remove conteúdo do formulário e acrescenta a mensagem
    .then(() =>
      commonFunc.showMessage("form_add_aluno", "Aluno salvo com sucesso!")
    )
    //tira o diplay do formulário e block_screen
    .then(() => {
      setTimeout(() => {
        e.target.style.display = "none";
        commonFunc.changeCSSDisplay("#block_screen", "none");
      }, 500);
    })
    .then(() => {
      //seta o #select_aluno com o RA que acabou de ser atualizado
      setSelectedInASelectBasedOnRA("#select_aluno", RA);
      setSelectedInASelectBasedOnRA("#select_aluno_add_aula", RA);
    })
    .catch((error) => console.error("Error writing document: ", error));
}

//Insere os cursos do aluno quando o select_aluno_add_aula é alterado
function eventSelectAlunoAddAula() {
  let aluno = document.querySelector("#select_aluno_add_aula");
  aluno.addEventListener("input", (e) => {
    selectAlunoAddAula(e);
  });
}

function selectAlunoAddAula(e) {
  let RA = e.target.value;
  insertSelectCursosAddAula(RA);
}

insertSelectCursosAddAula("RA01");

function AddEventBtnCloseForm() {
  document.querySelectorAll(".close_form").forEach((item) => {
    item.addEventListener("click", (e) => {
      commonFunc.parenteDisplayAndBlockScreenNone(e);
    });
  });
}

function navAddFormsDisplayEvent() {
  document.querySelector("#btn_add_curso").addEventListener("click", () => {
    commonFunc.changeCSSDisplay("#form_add_curso", "block");
    commonFunc.changeCSSDisplay("#block_screen", "block");
  });
  document.querySelector("#btn_add_aluno").addEventListener("click", () => {
    commonFunc.changeCSSDisplay("#form_add_aluno", "block");
    commonFunc.changeCSSDisplay("#block_screen", "block");
  });
  document.querySelector("#btn_add_aula").addEventListener("click", () => {
    commonFunc.changeCSSDisplay("#form_add_aula", "block");
    commonFunc.changeCSSDisplay("#block_screen", "block");
  });
}

function formAddAluno(e) {
  e.preventDefault();
  let form = e.target;
  let alunoHistorico = db.collection("aluno_historico");
  alunoHistorico
    .doc(form.add_aluno_ra.value)
    .collection("cursos")
    .doc(form.curso_nome.value)
    .set({
      curso: form.curso_nome.value,
      bimestres: {
        ["bimestre 1"]: {},
      },
    })
    .then(() => {
      alunoHistorico
        .doc(form.add_aluno_ra.value)
        .set({ nome: form.nome.value }, { merge: true });
    })
    //Remove conteúdo do formulário e acrescenta a mensagem
    .then(() =>
      commonFunc.showMessage("form_add_aluno", "Aluno salvo com sucesso!")
    )
    //tira o diplay do formulário e block_screen
    .then(() => {
      setTimeout(() => {
        e.target.style.display = "none";
        commonFunc.changeCSSDisplay("#block_screen", "none");
      }, 500);
    })
    .catch((error) => console.error("Error writing document: ", error));
}

function blocoAddAula(dados) {
  let aula = {
    [dados.select_bimestre_add_aluno.value]: {
      [dados.aula_numero.value]: {
        tema: dados.tema.value,
        data: dados.data.value,
        horario: dados.horario.value,
        detalhes: dados.detalhes.value,
      },
    },
  };
  return aula;
}
function formAddAula(e) {
  e.preventDefault();
  let form = e.target;
  let RA = form.select_aluno_add_aula.value;
  aulaHistorico = db
    .collection("aluno_historico")
    .doc(RA)
    .collection("cursos")
    .doc(form.select_curso_add_aluno.value)
    .set(
      {
        bimestres: blocoAddAula(form),
      },
      { merge: true }
    )
    //Remove conteúdo do formulário e acrescenta a mensagem
    .then(() =>
      commonFunc.showMessage("form_add_aluno", "Aula adicionada com sucesso!")
    )
    .then(() => {
      setTimeout(() => {
        e.target.style.display = "none";
        commonFunc.changeCSSDisplay("#block_screen", "none");
      }, 500);
    })
    .then(() => {
      //seta o #select_aluno com o RA que acabou de ser atualizado
      setSelectedInASelectBasedOnRA("#select_aluno_add_aula", RA);
      setSelectedInASelectBasedOnRA("#select_aluno_add_curso", RA);
    })
    .catch((error) => console.error("Error writing document: ", error));
}

//========================================================================================================
//======================================= INDEX ========================================================
//========================================================================================================

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

//---------------------------------------------------------

function insertOptionsAddAlunoRA() {
  let dataList = document.querySelector("#add_aluno_datalist_ra");
  let options = createOptionsRA();
  options.then((res) => {
    dataList.innerHTML = res;
  });
}

function createOptionsRA() {
  let array = "";
  let listAlunoRA = dbAlunoHistFunc.getAlunosListRA();
  let options = listAlunoRA.then((listRA) => {
    listRA.forEach((list) => {
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
    let listAlunoRA = dbAlunoHistFunc.getAlunosListRA();
    let valida = listAlunoRA.then((listRA) => {
      for (let i = 0; i <= listRA.length - 1; i++) {
        if (inputRA.toUpperCase() === listRA[i]) {
          e.target.classList.add("blocked");
          commonFunc.blockSubmitForm(form);
          return false;
        } else {
          commonFunc.removeblockSubmitForm(form);
          e.target.classList.remove("blocked");
        }
      }
    });
    return valida;
  });
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
  let aluno = dbAlunoHistFunc.alunoHistoricoDB(RA);
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
  if (select) {
    select.addEventListener("input", () => {
      let RA = select.options[select.selectedIndex].value;
      
     // dbAlunoHistFunc.realTimeDataAlunoHistorico(RA);
     dbAlunoHistFunc.dbRealTimeAlunoHistCursos(RA, insertAulasCursosFunc.insertAulasWhenAlunoChange);
      
      //carrega o primeiro curso do menu navC

      setSelectedInASelectBasedOnRA("#select_aluno_add_aula", RA);
      setSelectedInASelectBasedOnRA("#select_aluno_add_curso", RA);
      //quando o select_aluno é alterado chama a função para carregar as opções
      //de cursos em select_aluno_add_aula
      insertSelectCursosAddAula(RA);
    });
  }
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

//--------------------Carrega funções----------------------------
(async function loadDocuments() {
  insertAulasWhenChangeAluno();
  //insertAulasCursosFunc.realTimeDataAlunoHistorico("RA01");
  dbAlunoHistFunc.dbRealTimeAlunoHistCursos('RA01', insertAulasCursosFunc.insertAulasWhenAlunoChange);


  //FORMS
  AddEventBtnCloseForm();
  navAddFormsDisplayEvent();
  eventFormsAdd();
  eventSelectAlunoAddAula();
  eventSelectAlunoAddCurso();
  validaSelectOptionsAddAluno();
  insertOptionsAddAlunoRA();
})();
//----------------------------------------------------------
