import * as formAddAulas from "./formAddAulas.js";
import * as commonFunc from "../common/commonFunctions.js";
import * as dateFunc from "../common/dateFunc.js";
//TODO:-----------------------------EDIT Aulas------------------------------------
export function showEditAula(e) {
    let formAddAula = document.querySelector("#form_add_aula");
    //Insere as informações da aula em "#form_add_aula".
    insertInfoInputsFormAddAula(e, formAddAula);
    //Adiciona a classe edit_form no formulário.
    formAddAula.classList.add("edit_form");
    insertTextElementsEditAula();
    //chama todas as funções de edição no formulário "#form_add_aula".
    setEditAulaInfoInFormAddAula(formAddAula);
    eventSubmitBtnEditAula()
    function eventSubmitBtnEditAula(){
      let btnSubmit = document.querySelector('#form_add_aula').querySelector('input[type="submit"]');
    btnSubmit.addEventListener('click', (e)=>{
     
    })
    }
    
  }

  function insertTextElementsEditAula(){
    let h3 = document.querySelector('#form_add_aula').querySelectorAll('h3')[0];
    let btnSubmit = document.querySelector('#form_add_aula').querySelector('input[type="submit"]');
    h3.innerHTML= "Editar Aula";
    btnSubmit.value= "Salvar Edição";
  }
  function removeTextElementsEditAula(){
    let h3 = document.querySelector('#form_add_aula').querySelectorAll('h3')[0];
    let btnSubmit = document.querySelector('#form_add_aula').querySelector('input[type="submit"]');
    h3.innerHTML= "Adicionar Aula";
    btnSubmit.value= "Salvar";
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
    formAddAula.querySelector("#tema").value = aulaInfo.tema;
    formAddAula.querySelector("#horario").value = aulaInfo.horario;
    formAddAula.querySelector("#data").value = aulaInfo.data;
    formAddAula.querySelector("#detalhes").value = aulaInfo.detalhes;
    let bimestres = formAddAula.querySelector('#select_bimestre_add_aluno');
    let selectAulas = formAddAula.querySelector('#aula_numero');
    for(let i = 0; i <= selectAulas.options.length -1; i++){
      if(selectAulas.options[i].value === aulaInfo.aula){
        selectAulas.selectedIndex = i;
      }
    }
    for(let k = 0; k <= bimestres.options.length -1; k++){
      if(commonFunc.stringToID(bimestres.options[k].value) === aulaInfo.bimestre){
        bimestres.selectedIndex = k;
      }
    }
}
  function getInfoInputsFormAddAula(e){
   let aula = e.target.closest('.aulas');
   let aulaInfo = {}
   aulaInfo.bimestre = aula.dataset.bimestre;
   aulaInfo.aula = aula.querySelectorAll('.aula_numero')[0].textContent;
   aulaInfo.tema = aula.querySelectorAll('.aula_tema_info')[0].textContent;
   aulaInfo.horario = aula.querySelectorAll('.aula_horario_info')[0].textContent;
   let newDate = dateFunc.changeDateTextToYYYYMMDD(aula.querySelectorAll('.aula_data_info')[0].textContent);
   aulaInfo.data = newDate;
   aulaInfo.detalhes = aula.querySelectorAll('.aula_detalhes_info')[0].textContent;
   return aulaInfo;
  }

  function addEventListenerCloseForm(formAddAula){
    let btn_close = formAddAula.querySelectorAll(".close_form")[0];
    btn_close.classList.add('close_form_edit');
    btn_close.addEventListener('click', (e)=>{
      removeFormEditAula(formAddAula)
    btn_close.classList.remove('close_form_edit');
    formAddAulas.resetFormAddAula(formAddAula);
   
    });
  }

  export function removeFormEditAula(){
    let formAddAula = document.querySelector('#form_add_aula');
    if(formAddAula.classList.contains('edit_form')){
      let btn_close = formAddAula.querySelectorAll(".close_form_edit")[0];
      btn_close.classList.remove('close_form_edit');
      removeClassEditForm(formAddAula);
      enableSelectsInFormAddAula(formAddAula);
      removeTextElementsEditAula()
    }

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

