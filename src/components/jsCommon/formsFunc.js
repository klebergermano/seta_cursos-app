//---------------------------------------------------------------//
//Funções do componente
import { showMessage, showFixedMessage } from './messagesFunc.js';
//---------------------------------------------------------------//
//===========================================================================
//------------------------------- FORMS ------------------------------------
//===========================================================================
export function defaultEventsAfterSubmitForm(formID, msg, timeout = 1500, callback) {
    showMessage(formID, msg)
    setTimeout(() => {
      removeFormElement(formID);
    }, timeout);
    if (callback) callback();
  };
  
  export function defaultEventsAfterSubmitFixedForm(formID, msg, callback) {
    showFixedMessage(formID, msg)
    if (callback) callback();
  };
  
  export function btnCloseForm(formID) {
    let form = document.querySelector(formID);
    let formParent = document.querySelector(formID).parentElement;
    //Remove the parent form
    form.querySelector('.btn_close_form').addEventListener('click', (e) => {
      //Remove o elemento "bg_form_block_screen" se o formulário possuir um como elemento pai.
      if (formParent.className?.includes('bg_form_block_screen')) {
        let blockScreen = formParent;
        let parentOfBlockScreen = blockScreen.parentElement;
        parentOfBlockScreen.removeChild(blockScreen);
      }
    })
  }
  
 function removeFormElement(formID) {
    let form = document.querySelector(formID);
    let parentOfForm = form.parentElement;
    parentOfForm.removeChild(form);
  
    if (parentOfForm.className?.includes('bg_form_block_screen')) {
      let blockScreen = parentOfForm;
      let parentOfBlockScreen = blockScreen.parentElement;
      parentOfBlockScreen.removeChild(blockScreen);
    }
  
  }
  