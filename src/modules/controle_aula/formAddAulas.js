import * as commonFunc from "../common/commonFunctions.js";
import * as dbAlunoHistFunc from "../common/dbAlunoHistoricoFunc.js";
import * as addAluno from "./formAddAlunos.js";
import * as formEditAulas from "./formEditAulas.js";
//=====================================================================================
//------------------------------------ADD AULA---------------------------------------
//TODO: Refatorar funções



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


  document.querySelector("#select_aluno_add_aula").addEventListener("input", (e) => {
    setInitialIndexAulaNumero()

  });
  document.querySelector("#select_curso_add_aluno").addEventListener("input", (e) => {
  // validaFormAddAulaOptionsAulaNumero();
    setInitialIndexBimestre()
    disableAulaNumero()
  });

  document.querySelector("#select_bimestre_add_aluno").addEventListener("input", (e) => {
    validaFormAddAulaOptionsAulaNumero();
    enableSelectAulaNumeroWhenBimestreChange();
  });

}

function disableAulaNumero(){
  let aulaNumero= document.querySelector("#form_add_aula").querySelector('#aula_numero');
  aulaNumero.setAttribute('disabled', true);
  setInitialIndexAulaNumero()


}
export function setInitialIndexAulaNumero(){
  let aulaNumero= document.querySelector("#form_add_aula").querySelector('#aula_numero');
  aulaNumero.options.selectedIndex = 0;
 }
export function setInitialIndexBimestre(){
  let bimestreNumero= document.querySelector("#form_add_aula").querySelector('#select_bimestre_add_aluno');
  bimestreNumero.options.selectedIndex = 0;
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
          option += `<option value='${item.data().curso}'>${item.data().curso}</option>`;
        });
      })
      .then(() => {
        document.querySelector("#select_curso_add_aluno").innerHTML = option;
      }).then(()=>{
     setInitialIndexBimestre()
    disableAulaNumero()
      })
 
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
  }

     //Restaura o estado anterior do formulário "#form_add_aula";
  export function resetFormAddAula(formAddAula){
    
   formAddAula.querySelector('#tema').value = '';
   formAddAula.querySelector('#data').value  = '';
   formAddAula.querySelector('#horario').value = '';
   formAddAula.querySelector('#detalhes').value = '';
   setInitialIndexAulaNumero();
   setInitialIndexBimestre();

   formEditAulas.removeFormEditAula(document.querySelector('#form_add_aula'));
  }
  
  function formAddAula(e) {
    e.preventDefault();
    let form = e.target;
    let RA = form.select_aluno_add_aula.value;
    let aulaHistorico;
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
        commonFunc.showMessage("form_add_aluno", "Aula adicionada com sucesso!", AddEventBtnCloseForm)
      )
      .then(() => {
        setTimeout(() => {
          e.target.style.display = "none";
          commonFunc.changeCSSDisplay("#block_screen", "none");
        resetFormAddAula(document.querySelector('#form_add_aula'));

        }, 500);
      })
      .then(() => {
        //seta o #select_aluno com o RA que acabou de ser atualizado
        setSelectedInASelectBasedOnRA("#select_aluno_add_aula", RA);
        setSelectedInASelectBasedOnRA("#select_aluno_add_curso", RA);
      })
      .catch((error) => console.error("Error writing document: ", error));
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
      insertSelectCursosAddAula(e.target.value /*RA Aaluno*/);
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

  function getKeysAulas(RA, idCurso, bimestre) {
    let aluno = dbAlunoHistFunc.alunoHistoricoDB(RA);
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
    }).then(()=>{
      return keysAulas;
    }).catch((err)=>{console.log(err)});

    return keys;
  }

  export function setSelectedInASelectBasedOnRA(idSelectTarget, RA) {
    //Remove o select das options "select_aluno" e adiciona selected no item salvo
    let select = document.querySelector(idSelectTarget);
    let allOptions = select.options;
    //limpa o selected=true de todas as opções do select.
    for (let item of allOptions) {
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

