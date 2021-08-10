import * as commonFunc from "../common/commonFunctions.js";
import * as dbAlunoHistFunc from "../common/dbAlunoHistoricoFunc.js";
import * as addAluno from "./formAddAlunos.js";
//=====================================================================================
//------------------------------------ADD AULA---------------------------------------
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
    
  //Seta as opções de cursos em select_curso_add_aluno;
  export function insertSelectCursosAddAula(RA) {
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

  function selectAlunoAddAula(e) {
    let RA = e.target.value;
    insertSelectCursosAddAula(RA);
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

export function eventFormsAdd() {
    document.querySelector("#form_add_aluno").addEventListener("submit", (e) => {
      addAluno.formAddAluno(e);
    });
    document.querySelector("#form_add_aula").addEventListener("submit", (e) => {
      formAddAula(e);
    });
    document.querySelector("#form_add_curso").addEventListener("submit", (e) => {
      addAulas.formAddCurso(e);
    });
  }

export function navAddFormsDisplayEvent() {
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

export function eventSelectAlunoAddAula() {
    let aluno = document.querySelector("#select_aluno_add_aula");
    aluno.addEventListener("input", (e) => {
      selectAlunoAddAula(e);
    });
  }

//=====================================================================================
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

  export function setSelectedInASelectBasedOnRA(idSelectTarget, RA) {
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
  
  export function AddEventBtnCloseForm() {
    document.querySelectorAll(".close_form").forEach((item) => {
      item.addEventListener("click", (e) => {
        commonFunc.parenteDisplayAndBlockScreenNone(e);
      });
    });
  }

