import * as dbAlunoHistFunc from "../common/dbAlunoHistoricoFunc.js";
import * as commonFunc from "../common/commonFunctions.js";

export function insertFormAddCursoHTML(){


}

function eventsFormAddCurso() {
  let aluno = document.querySelector("#select_aluno_add_curso");
  aluno.addEventListener("input", (e) => {
    validaSelectOptionsAddCurso();
  });
  document.querySelector("#form_add_curso").addEventListener("submit", (e) => {
   formAddCurso(e);
  });
}

//=====================================================================================
//------------------------------------ADD CURSOS---------------------------------------
function validaSelectOptionsAddCurso() {
    let selectAluno = document.querySelector("#select_aluno_add_curso");
    let RA = selectAluno.options[selectAluno.selectedIndex].value;
    let cursos = getKeysCursos(RA);
    cursos.then((res) => {
      blockSelectOptionsAddCurso(res);
    });
  }

  function getKeysCursos(RA) {
    let aluno = dbAlunoHistFunc.alunoHistoricoDB(RA);
    let cursos = [];
    let keys = aluno.then((res) => {
      res.forEach((item) => {
        cursos.push(item.data().curso);
      });
      return cursos;
    });
    return keys;
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
        commonFunc.setSelectedInASelectBasedOnRA("#select_aluno", RA);
        commonFunc.setSelectedInASelectBasedOnRA("#select_aluno_add_aula", RA);
      })
      .catch((error) => console.error("Error writing document: ", error));
  }

