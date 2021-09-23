//Remove o formulário do contente page
export function removeElementChild(parentElementID, childElementID, callback){
  let parent = document.querySelector(parentElementID);
  let child = document.querySelector(childElementID);
     parent.removeChild(child);
     callback();
 }



export function insertElementHTML(target, pathElementHTML,  callback, event){
  let targetElement = document.querySelector(target);
 let insertedElement = fetch(pathElementHTML)
  .then((res)=> res.text())
  .then((htmlString)=>{
       return new DOMParser().parseFromString(htmlString, 'text/html').body.firstElementChild;
  })
  .then((htmlElement)=>{
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

  export function AddEventBtnCloseForm() {
    document.querySelectorAll(".close_form").forEach((item) => {
      item.addEventListener("click", (e) => {
        parenteDisplayAndBlockScreenNone(e);
      });
    });
  }
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

  //Função usada para fechar os formulários e tirar o block screen da tela.
export function parenteDisplayAndBlockScreenNone(e) {
  //Pega o elemento "parent" do event e set display none.
  e.target.parentElement.style.display = "none";
  changeCSSDisplay("#block_screen", "none");
}

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
  <button class='btn btn_deletar'>Deletar</button><button class='btn btn_cancelar' button>Cancelar</button>`;
  msgBox.querySelector('.btn_deletar').addEventListener('click', (e)=>{
   callback();
  document.querySelector('#block_screen').style.display = 'none';
    });
  msgBox.querySelector('.btn_cancelar').addEventListener('click', (e)=>{
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
  let previousHTML = document.getElementById(targetID).innerHTML;
  document.getElementById(
    targetID
  ).innerHTML = `<div class='show_message'>${message}</div>`;

  //restaura a função de fechar do formulário
    if(callback){callback()}
}




export function getReverseObjectKeys(obj) {
  let objKeys = Object.keys(obj);
  let sortedObjKeys = objKeys.sort();
  sortedObjKeys.reverse();
  return sortedObjKeys;
}