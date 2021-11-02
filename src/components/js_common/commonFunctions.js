import {Spinner} from '../../../node_modules/spin.js/spin.js';

export function importHTMLWithScript(target, htmlSRC, scriptSRC, callback){
  let element = document.querySelector(target);
  fetch(htmlSRC)
  .then((res)=> res.text())
  .then((html)=>{
    element.innerHTML = html;
    import(scriptSRC)
    .then((module)=>{
      module.onload();
    });
  }).then(()=>{
    if(callback) callback();
  })
}
export function removeBlockScreen(){
  changeCSSDisplay('#block_screen', 'none')

}
export function displayBlockScreen(){
  changeCSSDisplay('#block_screen', 'block')
}
export function insertElementHTML(target, pathElementHTML,  callback, event, cleanTargetElement = false){
  let targetElement = document.querySelector(target);
 let insertedElement = fetch(pathElementHTML)
  .then((res)=> res.text())
  .then((htmlString)=>{
       return new DOMParser().parseFromString(htmlString, 'text/html').body.firstElementChild;
  })
  .then((htmlElement)=>{
    if(cleanTargetElement){
      console.log("Limpo");
      targetElement.innerHTML = '';
    }   
    targetElement.appendChild(htmlElement);
   return htmlElement;
  }).then((htmlElement)=>{
    if(callback) callback(htmlElement, event);
    return htmlElement;
  })
  .catch((err)=> console.log(err));

    return insertedElement;

} 

export function addEventListener(targetElement, event, callback){
  document.querySelector(targetElement).addEventListener(event, (e)=>{
    callback
  });

}
export function addEventListenerInAllElements(targetElements, event, callback){
  let elements = document.querySelectorAll(targetElements);
  elements.forEach((item)=>{
    item.addEventListener(event, (e)=>{
          callback(e)
    });
  });
}

export function defaultEventsAfterSubmitForm(formID, msg, timeout = 1500, callback){
  showMessage(formID,  msg)
  setTimeout(() => {
    removeFormElement(formID);
  },timeout);
  if(callback) callback(); 
};

//Remove o formulário do contente page
export function removeElement(childElementID, callback){
  let child = document.querySelector(childElementID);
  let parent = child.parentElement;
     parent.removeChild(child);
     callback();
 }

 export function removeFormElement(childElementID){

  removeElement(childElementID, ()=>{
    let blockScreen = document.querySelector("#block_screen");
    if(blockScreen){ removeBlockScreen()}
  })
}
 
export function btnCloseForm(formID){
  let form = document.querySelector(formID);
  //Remove the parent form
  form.querySelector('.btn_close_form').addEventListener('click', (e) => {
   removeFormElement(formID);

  })
}
//----------------------SPIN JS---------------------------------------


export function displaySpinnerLoad(idTarget, blockScreen = false){
  if(blockScreen) displayBlockScreen();
var opts = {
  lines: 13, // The number of lines to draw
  length: 38, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 0.5, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#333333', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  zIndex: 2000000000, // The z-index (defaults to 2e9)
  className: 'spinner', // The CSS class to assign to the spinner
  position: 'absolute', // Element positioning
};

var target = document.querySelector(idTarget);
var spinner = new Spinner(opts).spin(target);
}

export function removeSpinnerLoad(idTarget){
  removeBlockScreen();
  let spiner = document.querySelector('.spinner');
  document.querySelector(idTarget).removeChild(spiner);
}

//----------------------------------------------------------------------
  //-------------------------------------
export function setSelectedInASelectBasedOnRA(idSelectTarget, RA) {
  //Remove o select das options "select_aluno" e adiciona selected no item salvo
  let select = document.querySelector(idSelectTarget);
  let allOptions = select.options;
  //limpa o selected=true de todas as opções do select.
  for (let item of allOptions) {
    item.removeAttribute("selected");
  }
  //Readiciona os mesmos options no select para garantir que a option com
  //selected=true funcione
  select.innerHTML = select.innerHTML;
  //adiciona o select=true na opção com o RA que acabou de ser salvo
  let option = select.querySelector(`option[value='${RA}']`);
  option.setAttribute("selected", true);
}


export function changeCSSDisplay(target, display) {
    document.querySelector(target).style.display = display;
  }

  //Substitui todos os espaços e parenteses por underscore usando REGEX
  export function stringToID(string){
    let id = string.replace(/\s+|\(|\)/g, "_").toLowerCase();
return id;
  }

  export function hideAllElementsByClassName(className){
    document.querySelectorAll(className).forEach((item) => {
        item.style.display = "none";
      });
  }

/*TODO: conferir utilidade da funçaõ
//Função usada para fechar os formulários e tirar o block screen da tela.
export function parenteDisplayAndBlockScreenNone(e) {
  //Pega o elemento "parent" do event e set display none.
  e.target.parentElement.style.display = "none";
  changeCSSDisplay("#block_screen", "none");
}
*/
function closeConfirmBox(e){
  let confirmBox = e.target.closest('.confirm_box')
  parent = confirmBox.parentElement;
  parent.removeChild(confirmBox);
};
export function confirmBoxDelete(target, msg,  callback){
  let elementTarget = document.querySelector(target);
  let msgBox = document.createElement('div');
  msgBox.className='confirm_box confirm_box_deletar';
  msgBox.innerHTML = `<span class='btn_close'>X</span><p>${msg}</p>
  <button class='btn-default-delete'>Deletar</button><button class='btn-default-cancel' button>Cancelar</button>`;
  msgBox.querySelector('.btn-default-delete').addEventListener('click', (e)=>{
   callback();
  document.querySelector('#block_screen').style.display = 'none';
    });
  msgBox.querySelector('.btn-default-cancel').addEventListener('click', (e)=>{
    closeConfirmBox(e)
  document.querySelector('#block_screen').style.display = 'none';
    });
  msgBox.querySelector('.btn_close').addEventListener('click', (e)=>{
    closeConfirmBox(e)
  document.querySelector('#block_screen').style.display = 'none';
    });
  elementTarget.appendChild(msgBox);
  document.querySelector('#block_screen').style.display = 'block';
}


export function showTemporaryMessage
(target, msg, duration = 2000, style = "default", blockScreen = false, callback){
let elementTarget = document.querySelector(target);
let divMessage = document.createElement('div');
if(blockScreen){
  divMessage.id='block_screen_msg';
  divMessage.innerHTML = `<div class='temp_msg'><p>${msg}</p></div>`;
  console.log('yeap');
}else{
  console.log('nop');
  divMessage.className='temp_msg';
  divMessage.innerHTML = `<p>${msg}</p>`;
}

elementTarget.appendChild(divMessage);
setTimeout(()=>{
  elementTarget.removeChild(divMessage)
}, duration);

divMessage.classList.add(style+'_temp_msg');

if(callback) callback();

}
export function insertMessage(targetID, message, callback) {
  document.getElementById(targetID).innerHTML = 
  `<div class='show_message'>${message}</div>`;
  //restaura a função de fechar do formulário
    if(callback){callback()}
}

export function blockSubmitForm(form) {
  form.querySelector("input[type='submit']").setAttribute("disabled", true);
}
export function removeblockSubmitForm(form) {
  form.querySelector("input[type='submit']").removeAttribute("disabled");
}
export function showMessage(targetID, message, callback) {
  document.querySelector(targetID).innerHTML = `<div class='show_message'>${message}</div>`;
    if(callback)callback()
}




export function getReverseObjectKeys(obj) {
  let objKeys = Object.keys(obj);
  let sortedObjKeys = objKeys.sort();
  sortedObjKeys.reverse();
  return sortedObjKeys;
}