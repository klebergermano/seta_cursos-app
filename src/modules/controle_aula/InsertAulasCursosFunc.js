import * as commonFunc from "../common/commonFunctions.js";
import * as dbAlunoHistFunc from "../common/dbAlunoHistoricoFunc.js";
import * as navCursosAluno from "./navCursosAluno.js";
import * as editAulas from "./formEditAulas.js"; 
import * as addAulas from "./formAddAulas.js"; 
import * as dateFunc from "../common/dateFunc.js"; 
import * as deleteFunc from "./deleteAulas.js";

//---------------------------------INSERT AULAS ------------------------------------
export function insertAulasWhenChangeAluno(){
  let select = document.querySelector("#select_aluno");
  if (select) {
    select.addEventListener("input", () => {
      let RA = select.options[select.selectedIndex].value;
      // dbAlunoHistFunc.realTimeDataAlunoHistorico(RA);
      dbAlunoHistFunc.dbRealTimeAlunoHistCursos(RA, insertAulasWhenAlunoChange);
      //carrega o primeiro curso do menu navC
      addAulas.setSelectedInASelectBasedOnRA("#select_aluno_add_aula", RA);
      addAulas.setSelectedInASelectBasedOnRA("#select_aluno_add_curso", RA);
      //quando o select_aluno é alterado chama a função para carregar as opções
      //de cursos em select_aluno_add_aula
      addAulas.insertSelectCursosAddAula(RA);
    });
  }
}

export function insertAulasWhenAlunoChange(RA, snapshotChange) {
  let snapChanges = snapshotChange.docChanges();
  let alunoInfoGeral = dbAlunoHistFunc.getAlunoInfoGeral(RA);
  let alunoH = dbAlunoHistFunc.alunoHistoricoDB(RA);
  alunoH.then((alunoDB) => { 
    alunoInfoGeral.then((alunoInfo) => {
        InsertHTMLAulas(alunoDB, alunoInfo, snapChanges);
      })
  });
}

function appendMessageDeleteCurso(){
  let message = `Deseja deletar o curso? <button>DELETAR</button>`;
  let div = document.createElement('div');
  div.innerHTML = message;
  document.querySelector('.title_curso_nome').appendChild(div);
}

function checkIfCursoIsEmpty(curso_nome_bd, lunoInfoGeral){
  let isEmpty = db.collection("aluno_historico")
  .doc(lunoInfoGeral.RA)
  .collection("cursos")
  .doc(curso_nome_bd)
  .get('bimestres')
  .then((res)=>{
      let bimestres = res.data().bimestres;
      let keys = Object.keys(bimestres);
          if(keys.length <= 0){
              console.log('vazio');
              return  true;
          }else{
            return false;
          }
  });
  return isEmpty;
}

function createHtmlCursoContent(curso_nome_bd, alunoInfoGeral) {

  if(curso_nome_bd) {
    let id_curso = commonFunc.stringToID(curso_nome_bd);
    let htmlAula = document.createElement("div");
    htmlAula.innerHTML = `
    <div class='bg_curso' id='${id_curso}' data-aluno_ra='${alunoInfoGeral.RA}' data-curso='${curso_nome_bd}'>
      <div class='title'>
        <span class='title_curso_nome ${id_curso}'>${curso_nome_bd}</span>
        </div><div id='curso_content'>
      </div>
    </div>`;
    return htmlAula;
  } else {
    return false;
  }
}
function createHtmlCursoContentXXXXXXX(curso_nome_bd, alunoInfoGeral) {
  let id_curso = commonFunc.stringToID(curso_nome_bd);
  let htmlAula = document.createElement("div");
 let resHTML = checkIfCursoIsEmpty(curso_nome_bd, alunoInfoGeral).then((res)=>{
  if(res){
    console.log('TRUE')
    htmlAula.innerHTML = `
    <div class='bg_curso' id='${id_curso}' data-aluno_ra='${alunoInfoGeral.RA}' data-curso='${curso_nome_bd}'>
      <div class='title'>
        <span class='title_curso_nome ${id_curso}'>${curso_nome_bd}</span>
        </div><div id='curso_content'>
      </div>
      <div class='bg_btn_deletar_curso'>Deletar Curso</div>
    </div>`;
  }else{
    console.log('FALSE')
    htmlAula.innerHTML = `
    <div class='bg_curso' id='${id_curso}' data-aluno_ra='${alunoInfoGeral.RA}' data-curso='${curso_nome_bd}'>
      <div class='title'>
        <span class='title_curso_nome ${id_curso}'>${curso_nome_bd}</span>
        </div><div id='curso_content'>
      </div>
    </div>`;
  }
  return htmlAula;
 });
return resHTML;
}
//Insere as aulas na página
export function InsertHTMLAulas(alunoDB, alunoInfoGeral, snapChanges) {

  //TODO remover snapChanges
  let resultHTML = "";
  //Main forEach
  alunoDB.forEach((res) => {
    if (typeof res.data !== "undefined") { res = res.data(); }
    else { res = res.doc.data(); }
    let bimestres_bd = res.bimestres;
    let curso_nome_bd = res.curso;
    let id_curso;
    //evita erro por undefined no nome do curso
    if (curso_nome_bd) {
      id_curso = commonFunc.stringToID(curso_nome_bd);
    }




    let html = createHtmlCursoContent(curso_nome_bd, alunoInfoGeral);
    let curso_content = html.querySelector("#curso_content");
    let content = `<div class='bg_bimestres'>`;
    // Pega as keys reordenadas do obj bimestres_bd e usa no para
    // criar o for, eles também são utilizadas com o index do for
    // para carregar os dados ex.: "b_sortedKeys[i]"
    let bimSortedKeys = commonFunc.getReverseObjectKeys(bimestres_bd);
    for (let i = 0; i < bimSortedKeys.length; i++) {
      let aula;
      let counter = 1;
      //cria a div bimestres
      content += "<div class='bimestres'>";
      //numero de bimestres
      content += `<h2>${[bimSortedKeys[i]]}</h2>`;
      let aulaSortedKeys = commonFunc.getReverseObjectKeys(
        bimestres_bd[bimSortedKeys[i]]
      );

      for (let j = 0; j < aulaSortedKeys.length; j++) {
        //usa as keys dos dois fors, a do bimestre "ex: bimestres_1" e a key da aula
        // "ex: aula_3" para gerar o bloco aula
        aula = bimestres_bd[bimSortedKeys[i]][aulaSortedKeys[j]];
        if (counter === 1) {
          //abre a div columns quando o contador esta em 1
          content += "<div class='columns'>";
        }
        //carrega as aulas chamando a função createHTMLAula
        //passa a key para gera o numero da aula ex: aula_1
        content += createHTMLAula(aula, aulaSortedKeys[j], bimSortedKeys[i]);
        counter++;
        if (counter === 5) {
          content += "</div>";
          counter = 1;
        }
      } // end for
      //caso não haja aulas suficientes para terminar a columa a condição fecha a div 'columns'
      if (counter > 1) {
        content += "</div>";
      }
      //fecha a div bimestres
      content += "</div>";
      curso_content.innerHTML = content;
    }
    content += "</div>"; //fecha bg_bimestres
    resultHTML += html.innerHTML;
  });

  //--------------------------------------------------------------------------------
  navCursosAluno.insertNavCursosInBGCursos(alunoInfoGeral, snapChanges)
  //adiciona todo o conteúdo gerado em #bg_cursos
  document.querySelector("#bg_cursos").innerHTML = resultHTML;
  //Carrega a função de click no btn_edit_aulas
  commonFunc.addEventListenerInAllElements('.btn_edit_aulas', 'click', editAulas.showEditAula);
  
  //Carrega a função de click
  commonFunc.addEventListenerInAllElements('.btn_open_close_aulas', 'click', clickOpenCloseAulas);

  //Funções de delete aula
  deleteFunc.eventsDeletarAula()
}


function clickOpenCloseAulas(e){
    let parent = e.target.closest(".aulas");
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.classList.add("bi", "bi-chevron-down");
    let pathCloseIcon =`<path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 
                        .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>`;
    let pathOpenIcon = `<path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 
                        5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>`;
    e.target.innerHTML = "";
    parent.classList.toggle("open_aula");
    if (parent.classList.contains("open_aula")) { svg.innerHTML = pathOpenIcon; /*shows when it wast open*/ } 
    else { svg.innerHTML = pathCloseIcon;}
    e.target.appendChild(svg);// Adiciona SVG correto
}


function createHTMLAula(aulaDados, n_aula, n_bimestre) {
  //substitui espaços em branco pelo underscore e passa para minúsculas as letras
  let id_aula = commonFunc.stringToID(n_aula);

  //let id_bimestre = n_bimestre.replace(/\s+/g, "_").toLowerCase();
  let id_bimestre = commonFunc.stringToID(n_bimestre);
  let block = `
    <div id='${id_bimestre}_${id_aula}' data-bimestre='${n_bimestre}' 
    data-aula='${n_aula}'  class="aulas aula_feita">
     <span class='btn_open_close_aulas'>
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
     <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
     </svg>
     </span>
     <div class='menu_top_block_aulas'>
     </div>
     <p>
     <span class='aula_numero'>${n_aula}</span></p>
     <p>
     <span class='aula_tema'>Tema:<span class='aula_tema_info'>${aulaDados.tema}</span></span>
     </p>
     <div class='aula_data'>
      <p>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar3" viewBox="0 0 16 16">
            <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"/>
            <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
          </svg> <span class='aula_data_info'>${dateFunc.changeDateToDislayText(aulaDados.data)}</span>  
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16">
            <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"/>
            <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"/>
            <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>
          </svg> <span class='aula_horario_info'>${aulaDados.horario}</span>
       </p>
     </div>
      <div class='aula_detalhes'>
          <p>
          <span class='aula_detalhes_info'>${aulaDados.detalhes}</span>
          </p>
      </div>
     <span class='btn_deletar_aula'>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg>
     </span>
  <span class=' btn_edit_aulas'>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
  </svg>
  </span>
  </div>
  `;
  return block;
}


