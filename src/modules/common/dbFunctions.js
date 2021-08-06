import * as commonFunc from './commonFunctions.js';



export function getAlunosListRA() {
    let alunosList = db.collection("aluno_historico").get();
    let IDs = [];
    let alunoListRA = alunosList.then((res) => {
      res.forEach((item) => {
        IDs.push(item.id);
      });
      return IDs.reverse();
    });
    return alunoListRA;
  }


  export async function getAlunoInfoGeral(RA) {
    let alunoInfo = await db
      .collection("aluno_historico")
      .doc(RA)
      .get()
      .then((res) => {
        return res.data();
      });
    alunoInfo.RA = RA;
    return alunoInfo;
  }
  
export function alunoHistoricoDB(RA) {
    let alunoHistorico = db
      .collection("aluno_historico")
      .doc(RA)
      .collection("cursos")
      .get();
  
    return alunoHistorico;
  }
  
  //---------------REMOVER DESSE LUGAR

//-----------------------------EDIT ---------------------

function showEditAula(e) {
    let addForm = document.querySelector("#form_add_aula");
    let savePreviousHTMLForm = addForm.innerHTML;
    addForm.classList.add("edit_form");
  
    commonFunc.changeCSSDisplay("#form_add_aula", "block");
    commonFunc.changeCSSDisplay("#block_screen", "block");
  
    let select = addForm.querySelectorAll("select");
    select.forEach((item) => {
      item.setAttribute("disabled", true);
    });
    console.log(select);
  
    console.log(e);
  }
  