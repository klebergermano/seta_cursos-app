//Components
import {insertFormAddAulaHTML} from "./formAddAula.js";
import {insertFormEditAulaHTML} from "./formEditAula.js";
import {insertFormReposicaoAula} from "./formAddReposicaoAula.js";
import {insertFormAddPontoExtra} from "./formAddPontoExtra.js";
import {insertFormAddFeedbackBimestral} from "./formAddFeedbackBimestral.js";
import { eventsDeletarAula} from "./deleteFunc.js";
import {eventsBaixarHistorico} from "./baixarHistoricoAluno.js";
import {removeUnauthorizedElement} from "../../../appContent/adminContent/js/checkPermission.js";
//---------------------------------------------------------------//

export function eventsAulas() {
    
    eventBtnAddAula();
    eventBtnAddReposicaoAula()
    eventBtnAddPontoExtra()
    eventBtnAddFeedbackBimestral();
    //Carrega a função de click no btn_edit_aulas
    eventBtnEditAula()
    //Funções de delete aula
    eventsDeletarAula()
    
    //TODO: corrgin bug no carregamento do evento click no btn_open_close_aulas, e remover setTimeout
    //Carrega a função de click
    //Workaroud bug no carregamento
    eventBtnOpenCloseAula()
    removeUnauthorizedElement(window.$PERMISSIONS);
  }

  

  function eventBtnAddAula(){
    document.querySelectorAll(".btn_baixar_historico").forEach((item) => {
      item.addEventListener("click", (e) => {
        eventsBaixarHistorico(e);
      })
    });
  
    document.querySelectorAll(".btn_add_aula").forEach((item) => {
      item.addEventListener("click", () => {
       insertFormAddAulaHTML();
      })
    });
  }


  function eventBtnAddReposicaoAula(){
    document.querySelectorAll(".btn_add_reposicao").forEach((item) => {
      item.addEventListener("click", () => {
        insertFormReposicaoAula();
      })
    });
  }
  
  function eventBtnAddPontoExtra(){
    document.querySelectorAll(".btn_add_ponto_extra").forEach((item) => {
      item.addEventListener("click", () => {
        insertFormAddPontoExtra();
      })
    });
  }
  
  function eventBtnAddFeedbackBimestral(){
    document.querySelectorAll(".btn_add_feedback_bimestral").forEach((item) => {
      item.addEventListener("click", (e) => {
        insertFormAddFeedbackBimestral(e);
      })
    });
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
function eventBtnEditAula(){
    document.querySelectorAll(".btn_edit_aula").forEach((item) => {
      item.addEventListener("click", (eventClick) => {
        insertFormEditAulaHTML(eventClick);
      })
    });
  }

  function eventBtnOpenCloseAula(){
    document.querySelectorAll(".btn_open_close_aulas").forEach((item) => {
      item.addEventListener("click", (eventClick) => {
        clickOpenCloseAulas(eventClick)
      })
    });
  }
