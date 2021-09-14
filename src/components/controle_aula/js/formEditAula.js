import * as formAddAula from "./formAddAula.js";
import * as commonFunc from "../../js_common/commonFunctions.js";
import * as dateFunc from "../../js_common/dateFunc.js";
//TODO:-----------------------------EDIT Aulas------------------------------------
export function insertFormEditAulaHTML(eventClick){
  let form = commonFunc.insertElementHTML('#page_content',
  './components/controle_aula/formAddAula.html');

  form.then((formRes)=>{
    formAddAula.eventsFormAddAula(formRes);
    eventsFormEditAula(eventClick)
    console.log(formRes.select_categoria.value)
    if(formRes.select_categoria.value === 'prova'){
      showInputsProva(formRes)
    }
  });
}


function eventsFormEditAula(eventClick){

let form = document.querySelector('#form_add_aula');
 //Insere as informações da aula em "#form_add_aula".
 insertInfoInputsFormAddAula(form, eventClick);
 //Adiciona a classe edit_form no formulário.
 form.classList.add("edit_form");
 insertTextElementsEditAula();
 //chama todas as funções de edição no formulário "#form_add_aula".
 //setEditAulaInfoInFormAddAula(form);
}

function showInputsProva(form){
  form.querySelector("#bg_prova_inputs").style.display = "flex";
    form.querySelector("#div_detalhes").style.display = "none";
    form.querySelector("#nota_prova").setAttribute("required", true);
    form.querySelector("#numero_questoes").setAttribute("required", true);
    form.querySelector("#obs_prova").setAttribute("required", true);
    form.querySelector("#detalhes").removeAttribute("required");
}

function setCheckedStatusAula(form, aulaInfo){
  let status = document.getElementsByName("status");
  status.forEach((item)=>{
    if(item.value === aulaInfo.status){
      item.checked = true;
      
    }else{
      item.removeAttribute('checked');
    }
    formAddAula.setClassBtnStatus(form)
  });
}
  function insertTextElementsEditAula(){
    let h3 = document.querySelector('#form_add_aula').querySelectorAll('h3')[0];
    let btnSubmit = document.querySelector('#form_add_aula').querySelector('input[type="submit"]');
    let svgEdit = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
  </svg>`; 
    h3.innerHTML= svgEdit + " Editar Aula";
  }
  function removeTextElementsEditAula(){
    let h3 = document.querySelector('#form_add_aula').querySelectorAll('h3')[0];
    let btnSubmit = document.querySelector('#form_add_aula').querySelector('input[type="submit"]');
    let svgAddAula = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-plus" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z"/>
    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
  </svg>`;

    h3.innerHTML= svgAddAula + "Adicionar Aula";
  }

  function insertInfoInputsFormAddAula(formAddAula, eventClick){
    let aulaInfo = getInfoInputsFormAddAula(eventClick);
    
    setCheckedStatusAula(formAddAula, aulaInfo)

    let aulaCategoria = formAddAula.querySelector("#select_categoria");
    aulaCategoria.value = aulaInfo.categoria;
    
   formAddAula.querySelector("#nota_prova").value = aulaInfo.nota_prova;
   formAddAula.querySelector("#numero_questoes").value = aulaInfo.numero_questoes;
   formAddAula.querySelector("#obs_prova").value = aulaInfo.observacao;

    formAddAula.querySelector("#tema").value = aulaInfo.tema;
    formAddAula.querySelector("#horario").value = aulaInfo.horario;
    formAddAula.querySelector("#data").value = aulaInfo.data;
    formAddAula.querySelector("#detalhes").value = aulaInfo.detalhes;
    let bimestres = formAddAula.querySelector('#select_bimestre');
    let selectAulas = formAddAula.querySelector('#select_aula');


    bimestres.setAttribute('disabled', true);
    for(let i = 0; i <= selectAulas.options.length -1; i++){
      if(selectAulas.options[i].value === aulaInfo.aula){
        selectAulas.selectedIndex = i;
      }
    }
    for(let k = 0; k <= bimestres.options.length -1; k++){
      if(bimestres.options[k].value === aulaInfo.bimestre){
        bimestres.selectedIndex = k;
      }
    }
}
  function getInfoInputsFormAddAula(eventClick){

   let aula = eventClick.target.closest('.aulas');

   let aulaInfo = {}
   aulaInfo.categoria = aula.dataset.aula_categoria;
   
   if(aulaInfo.categoria === "prova"){

   aulaInfo.nota_prova = aula.querySelectorAll('.aula_nota_prova')[0]?.textContent;
   aulaInfo.numero_questoes = aula.querySelectorAll('.aula_numero_questoes')[0]?.textContent;
   aulaInfo.observacao = aula.querySelectorAll('.aula_detalhes_info')[0]?.textContent;
   }

   aulaInfo.bimestre = aula.dataset.bimestre;
   aulaInfo.aula = aula.querySelectorAll('.aula_numero')[0]?.textContent;
   aulaInfo.status = aula.querySelectorAll('.status')[0]?.textContent;
   aulaInfo.tema = aula.querySelectorAll('.aula_tema_info')[0]?.textContent;
   aulaInfo.horario = aula.querySelectorAll('.aula_horario_info')[0]?.textContent;
   let newDate = dateFunc.changeDateTextToYYYYMMDD(aula.querySelectorAll('.aula_data_info')[0]?.textContent);
   aulaInfo.data = newDate;
   aulaInfo.detalhes = aula.querySelectorAll('.aula_detalhes_info')[0]?.textContent;


   return aulaInfo;
  }

 


