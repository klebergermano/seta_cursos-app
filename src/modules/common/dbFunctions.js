import * as commonFunc from './commonFunctions.js';
import * as insertAulasCursosFunc from './InsertAulasCursosFunc.js';

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

  export function realTimeDataAlunoHistorico(RA) {
    db.collection("aluno_historico")
      .doc(RA)
      .collection("cursos")
      .onSnapshot((snap) => {
        let changes = snap.docChanges();
        let alunoInfoGeral = getAlunoInfoGeral(RA);
        let alunoH = alunoHistoricoDB(RA);
        alunoH.then((aluno) => {
          alunoInfoGeral
            .then((res) => {
                insertAulasCursosFunc.InsertBlockAulas(aluno, res, changes);
            })
            .then(() => {
              clickEditButton();
            });
        });
      });
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
function clickEditButton() {
    console.log("load");
  
    let btn = document.querySelectorAll(".btn_edit_aulas");
    btn.forEach((item) => {
      item.addEventListener("click", (e) => {
        showEditAula(e.target);
      });
    });
  }
  
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
  