import * as formAddAulas from "./formAddAulas.js";

import * as commonFunc from "../common/commonFunctions.js";
//TODO:-----------------------------EDIT Aulas------------------------------------
export function showEditAula(e) {
    let formAddAula = document.querySelector("#form_add_aula");

    //Insere as informações da aula em "#form_add_aula".
    insertInfoInputsFormAddAula(e, formAddAula);

    //Adiciona a classe edit_form no formulário.
    formAddAula.classList.add("edit_form");
    
    //chama todas as funções de edição no formulário "#form_add_aula".
    setEditAulaInfoInFormAddAula(formAddAula);
  }

  function setEditAulaInfoInFormAddAula(formAddAula){
    //Mostra o formulário "#form_add_aula" e o bloqueio de tela "#block_screen".
    displayFormEditAula()

    //adiciona o event listener no botão de fechar o formulário.
    addEventListenerCloseForm(formAddAula)

   //disable de selects in #form_add_aula
    disableSelectsInFormAddAula(formAddAula)
  }

  function insertInfoInputsFormAddAula(e, formAddAula){
    let aulaInfo = getInfoInputsFormAddAula(e);
    console.log('AulaInfo: ', aulaInfo);

    formAddAula.querySelector("#tema").value = aulaInfo.tema;
    formAddAula.querySelector("#horario").value = aulaInfo.horario;
    formAddAula.querySelector("#data").value = aulaInfo.data;
    formAddAula.querySelector("#detalhes").value = aulaInfo.detalhes;

  }

  function getInfoInputsFormAddAula(e){
   let aula = e.target.closest('.aulas');
   let aulaInfo = {}
   aulaInfo.tema = aula.querySelectorAll('.aula_tema_info')[0].textContent;
   aulaInfo.data = aula.querySelectorAll('.aula_data_info')[0].textContent;
   aulaInfo.horario = aula.querySelectorAll('.aula_horario_info')[0].textContent;
   aulaInfo.detalhes = aula.querySelectorAll('.aula_detalhes_info')[0].textContent;
 
   return aulaInfo;

  }



  function addEventListenerCloseForm(formAddAula){
    let btn_close = formAddAula.querySelectorAll(".close_form")[0];
    btn_close.classList.add('close_form_edit');
    btn_close.addEventListener('click', (e)=>{
    restorePreviousStateFormAddAula(formAddAula);
    });
  }



  //Restaura o estado anterior do formulário "#form_add_aula";
  function restorePreviousStateFormAddAula(formAddAula){
    removeClassEditForm(formAddAula);
    enableSelectsInFormAddAula(formAddAula);
  }

  function displayFormEditAula(){
    commonFunc.changeCSSDisplay("#form_add_aula", "block");
    commonFunc.changeCSSDisplay("#block_screen", "block");
  }

  function disableSelectsInFormAddAula(formAddAula){
    let select = formAddAula.querySelectorAll("select");
    select.forEach((item) => {
      item.setAttribute("disabled", true);
    });
  }

 //Reabilita os selectes do formulário "#form_add_aula"
  function enableSelectsInFormAddAula(formAddAula){
    formAddAula.querySelectorAll("select")
    .forEach((item) => {
      item.removeAttribute("disabled");
    });
  }
  //Remove a classe ".edit_form" do formulário "#form_add_aula"
  function removeClassEditForm(addForm){
    addForm.classList.remove("edit_form");
  }

