
import * as commonFunc from "../../js_common/commonFunctions.js";
import * as dbAlunoHistFunc from "../../js_common/dbAlunoHistoricoFunc.js";
import * as dateFunc from "../../js_common/dateFunc.js";
import * as navCursosAluno from "./navCursosAluno.js";
import * as formEditAula from "./formEditAula.js";
import * as formAddAula from "./formAddAula.js";
import * as formAddReposicaoAula from "./formAddReposicaoAula.js";
import * as formAddPontoExtra from "./formAddPontoExtra.js";
import * as formAddFeedbackBimestral from "./formAddFeedbackBimestral.js";
import * as deleteFunc from "./deleteFunc.js";
import * as baixarHistoricoAluno  from "./baixarHistoricoAluno.js";



export function eventsAlunoContent() {
  let RA = getRAfromMainSelectAluno();
  dbAlunoHistFunc.alunoHistCursosRealTimeDB(RA, insertAlunoContent);
}

function getRAfromMainSelectAluno() {
  let select = document.querySelector("#main_select_aluno");
  let RA = select.options[select.selectedIndex].value;
  return RA;
}


export function insertAlunoContent(RA, snapshotChange) {
  let nomeCurso = snapshotChange[0].doc.data().curso;
  dbAlunoHistFunc.getAlunoHistCursosDB(RA)
    .then((alunoCursosDB) => {

   
          let alunoContentHTML = createAlunoContentHTML(alunoCursosDB, RA);
       
         
          document.querySelector("#aluno_content").innerHTML = alunoContentHTML;
          navCursosAluno.insertNavCursosInBGCursos(RA, nomeCurso)
       
    }).then(()=>{
      eventsAulas()
      deleteFunc.eventDeleteCurso();
      eventBtnAddAula();
      eventBtnAddReposicaoAula()
      eventBtnAddPontoExtra()
      eventBtnAddFeedbackBimestral();
    }).then(()=>{
      let spiner = document.querySelector('.spinner');
      if(spiner){
        document.querySelector('#page_content').removeChild(spiner);
      }
    }).then(()=>{
  document.querySelector("#controle_aula").style.opacity="1";

    }).catch((err) => console.log('Ocorreu um erro ao inserir o conteúdo do aluno:', err));
}
function eventBtnAddAula(){
  document.querySelectorAll(".btn_baixar_historico").forEach((item) => {
    item.addEventListener("click", (e) => {
      baixarHistoricoAluno.eventsBaixarHistorico(e);
    })
  });

  
  document.querySelectorAll(".btn_add_aula").forEach((item) => {
    item.addEventListener("click", () => {
      formAddAula.insertFormAddAulaHTML();
    })
  });


}
function eventBtnAddReposicaoAula(){
  document.querySelectorAll(".btn_add_reposicao").forEach((item) => {
    item.addEventListener("click", () => {
      formAddReposicaoAula.insertFormReposicaoAula();
    })
  });
}

function eventBtnAddPontoExtra(){
  document.querySelectorAll(".btn_add_ponto_extra").forEach((item) => {
    item.addEventListener("click", () => {
      formAddPontoExtra.insertFormAddPontoExtra();
    })
  });
}

function eventBtnAddFeedbackBimestral(){
  document.querySelectorAll(".btn_add_feedback_bimestral").forEach((item) => {
    item.addEventListener("click", (e) => {
      formAddFeedbackBimestral.insertFormAddFeedbackBimestral(e);
    })
  });
}

function createBgCursoMainStructureHTML(curso_nome_bd, RA) {
 

  if (curso_nome_bd) {
    let id_curso = commonFunc.stringToID(curso_nome_bd);
    let bgCursoHTML = document.createElement("div");
    bgCursoHTML.id = id_curso;
    bgCursoHTML.setAttribute('data-aluno_ra', RA);
    bgCursoHTML.setAttribute('data-curso', curso_nome_bd);
  
    
    bgCursoHTML.innerHTML = `<nav class='nav_cursos_aluno'></nav>
    <div class='bg_curso' id='${id_curso}' data-aluno_ra='${RA}' data-curso='${curso_nome_bd}'>
       <h3 class='title_curso_nome ${id_curso}'>${curso_nome_bd}</h3>
        <div id='curso_content'>

<div class='bg_btn_add'>
        <button class="btn_add btn_baixar_historico" id="x" title='Baixar Histórico do Aluno' type="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-save" viewBox="0 0 16 16">
        <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
      </svg>
        &nbsp; Baixar Histórico
      </button>
      <button class='btn_add btn_add_ponto_extra' id='btn_add_ponto_extra'>+ Pontos Extras</button>
      <button class='btn_add btn_add_reposicao' id='btn_add_reposicao'>+ Reposição de Aula</button>
      <button class="btn_add btn_add_aula" id="btn_add_aula" title='Adicionar Aula' type="button">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-plus" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z"></path>
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"></path>
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"></path>
      </svg> &nbsp; Aula
    </button>
</div>

      </div>
    </div>`;
    return bgCursoHTML;
  } else {
    return false;
  }
}

export function resumoBimestreBD(curso){
  let bimestresKeys = commonFunc.getReverseObjectKeys(curso.bimestres);
  let resumoBimestres = {}; 

  for(let i = 0; i < bimestresKeys.length; i++){
    resumoBimestres[bimestresKeys[i]] = {}
    let bimestre = curso.bimestres[bimestresKeys[i]];
    let aulasKeys = commonFunc.getReverseObjectKeys(bimestre);
  
      let pontosExtras = 0;
      let reposicao = 0;
      let concluidas = 0;
      let faltas = 0;
      let remarcadas = 0;
      let notaProva = 0;
      let feedbackBimestral = '';

      for(let j = 0; j < aulasKeys.length; j++){
       let aulaStatus =  curso.bimestres[bimestresKeys[i]][aulasKeys[j]].status;
       let aulaCategoria =  curso.bimestres[bimestresKeys[i]][aulasKeys[j]].categoria;

       if(aulaCategoria === "feedback bimestral"){
        feedbackBimestral = curso.bimestres[bimestresKeys[i]][aulasKeys[j]].observacao;
       
       }
    if(aulaCategoria === "prova"){
      notaProva  = curso.bimestres[bimestresKeys[i]][aulasKeys[j]].nota;
     }
       
     if(aulaStatus === "concluida"){
        concluidas ++;
     }
     if(aulaStatus === "falta"){
        faltas ++;
     }
     if(aulaStatus === "remarcada"){
        remarcadas ++;
     }
       if(aulasKeys[j].includes("ponto extra")){
        pontosExtras ++; 
      }else if(aulasKeys[j].includes("reposição")){
        reposicao ++; 
      }
    }
    resumoBimestres[bimestresKeys[i]].concluidas = concluidas; 
    resumoBimestres[bimestresKeys[i]].faltas = faltas; 
    resumoBimestres[bimestresKeys[i]].remarcadas = remarcadas; 
    resumoBimestres[bimestresKeys[i]].pontosExtras = pontosExtras; 
    resumoBimestres[bimestresKeys[i]].reposicao = reposicao; 
    resumoBimestres[bimestresKeys[i]].notaProva = notaProva; 
    resumoBimestres[bimestresKeys[i]].feedbackBimestral = feedbackBimestral; 
    let notaFinal = parseFloat(notaProva) + pontosExtras;
    if(notaFinal > 10) notaFinal = 10;
    resumoBimestres[bimestresKeys[i]].notaFinal =  notaFinal;

  }
  return resumoBimestres;

}

function createAlunoContentHTML(alunoDataFromDB, RA) {
  let alunoContentHTML = "";


  alunoDataFromDB.forEach((resCursoDB) => {
    if (typeof resCursoDB.data !== "undefined") { resCursoDB = resCursoDB.data(); }
    else { resCursoDB = resCursoDB.doc.data(); }
    

    //let resumoBimestre = resumoBimestreBD(resCursoDB);
    let bgCursoMainStructure = createBgCursoMainStructureHTML(resCursoDB.curso, RA);

    if (checkIfBimestresIsEmpty(resCursoDB.bimestres)) {
      alunoContentHTML += createBgCursosInnerContent(bgCursoMainStructure, resCursoDB);
    } else {
      bgCursoMainStructure.querySelector('#curso_content').innerHTML = cursoVazioHTML(RA, resCursoDB.curso);
      alunoContentHTML += bgCursoMainStructure.innerHTML;
    }
  });


  return alunoContentHTML;
}

function cursoVazioHTML(RA, curso) {
  return `
  <div class='bg_info_delete_curso'>
      <p>
      Esse curso não possui aulas adicionadas.
    </p> 
      <div class='bg_btn_deletar_curso'>
    <button data-aluno_ra='${RA}' data-delete_curso='${curso}' class='btn_deletar_curso'>Deletar Curso</button>

      <button class="btn_add btn_add_aula" id="btn_add_aula" title='Adicionar Aula' type="button">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-plus" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z"></path>
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"></path>
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"></path>
      </svg>
     Adicionar Aula
    </button>
      </div>
      </div>
  `
}

function createResumoBimestreHTML(cursoDB, bimestreKey){
  let resBimestre = resumoBimestreBD(cursoDB);
      resBimestre = resBimestre[bimestreKey];

  let divResumo = document.createElement('div');
  divResumo.className = 'resumo_bimestre'
  divResumo.innerHTML = `
  <div class='row'>
  <p class='a_concluidas' >Aulas Concluidas: <span class='values concluidas_value'>${resBimestre.concluidas}</span></p>
  <p class='a_falta'>Faltas: <span class='values faltas_value'>${resBimestre.faltas}<span></p>
  <p class='a_remarcadas'>Remarcadas: <span class='values remarcadas_value'>${resBimestre.remarcadas}</span></p>
  
  <p class='a_reposicao_feita'>Reposições Feitas: <span class='values reposicao_value'>${resBimestre.reposicao}<span></p>
  <p class='pontos_extras'>Pontos Extras: <span class='values pontos_extras_value'>${resBimestre.pontosExtras}</span></p>
  <p class='nota_prova'>Nota Prova: <span class='values nota_prova_value'>${resBimestre.notaProva}</span></p>
  <p>Nota Final: <span class='values nota_final_value'>${resBimestre.notaFinal}</span></p>
  </div>
  <div class='row'>
  <div class='feedback_bimestral'>
      <span class='label'>
      Observação bimestral sobre o aluno:
     </span>
      <p class='feedback_value'>${resBimestre.feedbackBimestral}</p>
      <button class='btn btn_add_feedback_bimestral'>Feedback</button>
    <div>
  </div>
  `
  return divResumo;
}

function createBgCursosInnerContent(bgCursoHTML, cursoDB) {

  let divCursoContent = bgCursoHTML.querySelector("#curso_content");
  let divBgBimestres = document.createElement('div');
  divBgBimestres.className = 'bg_bimestres';

 
  // Pega as keys reordenadas do obj res.bimestres e usa no para criar o for, eles também 
  //são utilizadas com o index do for para carregar os dados ex.: "b_sortedKeys[i]"
  let bimSortedKeys = commonFunc.getReverseObjectKeys(cursoDB.bimestres);
  for (let i = 0; i < bimSortedKeys.length; i++) {

    let aulaSortedKeys = commonFunc.getReverseObjectKeys(cursoDB.bimestres[bimSortedKeys[i]]);
    let divBimestre = document.createElement('div');  //cria a div '.bimestres'
    divBimestre.className = 'bimestres';
    divBimestre.setAttribute('data-bimestre', bimSortedKeys[i] );
    let titleBimestre = document.createElement('h3');//cria o título do bimestre
    titleBimestre.textContent = bimSortedKeys[i];
    let contentColumns = document.createElement('div');
    let divColumn = document.createElement('div');
    divColumn.className = 'columns';
    //Div Reposição
    let divColumnReposicao = document.createElement('div');
    divColumnReposicao.className = 'columns column_reposicao';
      //Div Prova
      let divColumnProva = document.createElement('div');
      divColumnProva.className = 'columns column_prova';
    //Div Ponto Extra
    let divColumnPontosExtras = document.createElement('div');
    divColumnPontosExtras.className = 'columns column_pontos_extras';
    let counter = 1;

    for (let j = 0; j < aulaSortedKeys.length; j++) {
      //Usa as keys dos dois 'fors', a do bimestre "ex: bimestres_1" e a key da aula "ex: aula_3" para gerar o bloco aula
      let aula = cursoDB.bimestres[bimSortedKeys[i]][aulaSortedKeys[j]];
      if(aula.categoria === "feedback bimestral"){
      }else
      if(aula.categoria === "reposição"){
        divColumnReposicao.innerHTML += createHTMLAula(aula, aulaSortedKeys[j], bimSortedKeys[i]);
      }
      else if(aula.categoria && aula.categoria.includes('ponto extra')){
        divColumnPontosExtras.innerHTML += createHTMLPontoExtra(aula, aulaSortedKeys[j], bimSortedKeys[i]);
      }
      else{
      //----------------------------------------------------------------------------------------
        if (counter <= 4) {
          if(aula.categoria === "prova"){
            divColumn.innerHTML += createHTMLProva(aula, aulaSortedKeys[j], bimSortedKeys[i]);

          }else{
            divColumn.innerHTML += createHTMLAula(aula, aulaSortedKeys[j], bimSortedKeys[i]);
          }
        if (counter === 4) {
          contentColumns.appendChild(divColumn);
          divColumn = document.createElement('div');
          divColumn.className = 'columns';
          //TODO: Conferir a lógica do contador = 0 gerar as colunas corretas ao invéz de contador = 1;
          counter = 0;
        }
        counter++;
      }
    }
    } //--------------------------end for Aulas
    if (counter > 1) { 
      contentColumns.appendChild(divColumn); 
    }
    divBimestre.appendChild(titleBimestre); // Adiciona o título do bimestre
    //----------------------Resumo
    let divResumo = createResumoBimestreHTML(cursoDB, bimSortedKeys[i]);
   
    //divResumo.querySelector(".pontos_extras_value").innerHTML =  resumoBimestre[bimSortedKeys[i]].pontosExtras;
        divBimestre.appendChild(divResumo);
    //-----------------------------
 
    divBimestre.innerHTML += contentColumns.innerHTML; //Adiciona o conteúdo do bimestre
    if(divColumnReposicao.innerHTML !== ""){
      divBimestre.appendChild(divColumnReposicao); //Adiciona o conteúdo do bimestre
    }
    if(divColumnPontosExtras.innerHTML !== ""){
      divBimestre.appendChild(divColumnPontosExtras); //Adiciona o conteúdo do bimestre
    }
    divBgBimestres.appendChild(divBimestre); //Adiciona o bimestre no .bg_bimestres
    
    divCursoContent.appendChild(divBgBimestres); //Adiciona o '.bg_bimestres' em '#curso_content'
  }//------------------------------------------------END FOR Bimestres

  return bgCursoHTML.innerHTML;
}


function createHTMLPontoExtra(aulaDados, n_aula, n_bimestre) {
  //substitui espaços em branco pelo underscore e passa para minúsculas as letras
  let id_aula = commonFunc.stringToID(n_aula);
  //let id_bimestre = n_bimestre.replace(/\s+/g, "_").toLowerCase();
  let id_bimestre = commonFunc.stringToID(n_bimestre);
 
  let block = `
    <div id='${id_bimestre}_${id_aula}' data-bimestre='${n_bimestre}' 
    data-aula='${n_aula}' class="aulas aula_${aulaDados.status}" data-aula_categoria="${aulaDados.categoria}">
     <span class='btn_open_close_aulas'>
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
     <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
     </svg>
     </span>
     <div class='menu_top_block_aulas'>
     </div>
     <p>
     <span class='aula_numero'>${n_aula}</span> </p>
      <div class='aula_detalhes'>
          <p>
          <span class='aula_detalhes_info'>${aulaDados.descricao}</span>
          </p>
      </div>
     <span class='btn_deletar_aula'>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg>
     </span>
  </div>
  `;
  return block;
}

function createHTMLProva(aulaDados, n_aula, n_bimestre) {
  //substitui espaços em branco pelo underscore e passa para minúsculas as letras
  let id_aula = commonFunc.stringToID(n_aula);
  //let id_bimestre = n_bimestre.replace(/\s+/g, "_").toLowerCase();
  let id_bimestre = commonFunc.stringToID(n_bimestre);
 
  let block = `
    <div id='${id_bimestre}_${id_aula}' data-bimestre='${n_bimestre}' 
    data-aula='${n_aula}'  class="aulas aula_${aulaDados.status}" data-aula_categoria="${aulaDados.categoria}">
     <span class='btn_open_close_aulas'>
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
     <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
     </svg>
     </span>
     <div class='menu_top_block_aulas'>
     </div>

          
     <p>
     <span class='aula_numero'>${n_aula}</span> - <span class='status'>${aulaDados.categoria} - ${aulaDados.status}<span></p>
     <p>
     <p>
     <span class='aula_tema'>Nota: <span class='aula_nota_prova'>${aulaDados.nota}</span></span>
     </p>
     
     <p>
     <span class='aula_tema'>Número de Questões: <span class='aula_numero_questoes'>${aulaDados.numero_questoes}</span></span>
     </p>
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
          <span class='aula_detalhes_info'>${aulaDados.observacao}</span>
          </p>
      </div>
     <span class='btn_deletar_aula'>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg>
     </span>
  <span class=' btn_edit_aula'>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
  </svg>
  </span>
  </div>
  `;
  return block;
}
function createHTMLAula(aulaDados, n_aula, n_bimestre) {
  //substitui espaços em branco pelo underscore e passa para minúsculas as letras
  let id_aula = commonFunc.stringToID(n_aula);
  //let id_bimestre = n_bimestre.replace(/\s+/g, "_").toLowerCase();
  let id_bimestre = commonFunc.stringToID(n_bimestre);
 
  let block = `
    <div id='${id_bimestre}_${id_aula}' data-bimestre='${n_bimestre}' 
    data-aula='${n_aula}'  class="aulas aula_${aulaDados.status}" data-aula_categoria="${aulaDados.categoria}">
     <span class='btn_open_close_aulas'>
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
     <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
     </svg>
     </span>
     <div class='menu_top_block_aulas'>
     </div>
     <p>
     <span class='aula_numero'>${n_aula}</span> - <span class='status'>${aulaDados.status}<span></p>
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
  <span class=' btn_edit_aula'>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
  </svg>
  </span>
  </div>
  `;
  return block;
}


function eventsAulas() {
  //Carrega a função de click no btn_edit_aulas
  eventBtnEditAula()
  //commonFunc.addEventListenerInAllElements('.btn_edit_aulas', 'click', formEditAula.showEditAula);
  //Carrega a função de click
  commonFunc.addEventListenerInAllElements('.btn_open_close_aulas', 'click', clickOpenCloseAulas);
  //Funções de delete aula
  deleteFunc.eventsDeletarAula()
}

function eventBtnEditAula(){
  document.querySelectorAll(".btn_edit_aula").forEach((item) => {
    item.addEventListener("click", (eventClick) => {
      formEditAula.insertFormEditAulaHTML(eventClick);
    })
  });
}

function checkIfBimestresIsEmpty(bimestres) {
  let keys = Object.keys(bimestres);
  if (keys.length <= 0) {
    //retorna false quando não há conteúdo em bimestres
    return false;
  } else {
    //retorna true quando há conteúdo em bimestres
    return true;
  }
}

function clickOpenCloseAulas(e) {
  let parent = e.target.closest(".aulas");
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.classList.add("bi", "bi-chevron-down");
  let pathCloseIcon = `<path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 
                        .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>`;
  let pathOpenIcon = `<path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 
                        5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>`;
  e.target.innerHTML = "";
  parent.classList.toggle("open_aula");
  if (parent.classList.contains("open_aula")) { svg.innerHTML = pathOpenIcon; /*shows when it wast open*/ }
  else { svg.innerHTML = pathCloseIcon; }
  e.target.appendChild(svg);// Adiciona SVG correto
}




