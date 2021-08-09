import * as commonFunc from "../common/commonFunctions.js";

//=====================================================================================
//------------------------------------ADD ALUNO---------------------------------------
export function validaSelectOptionsAddAluno() {
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
  
  export function insertOptionsAddAlunoRA() {
    let dataList = document.querySelector("#add_aluno_datalist_ra");
    let options = createOptionsRA();
    options.then((res) => {
      dataList.innerHTML = res;
    });
  }

  export function formAddAluno(e) {
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
    
