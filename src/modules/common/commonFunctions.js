//Remove o formulário do contente page
export function removeElementChild(parentElementID, childElementID, callback){
  let parent = document.querySelector(parentElementID);
  let child = document.querySelector(childElementID);
     parent.removeChild(child);
     callback();
 }

export function insertElementHTML(target, pathElementHTML, callback){
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

    if(callback) callback(htmlElement);
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
//TODO: mudar função de mensagem para uma função independende que tenha sua própria estrutura
//usado para mostrar mensagem após um submit
export function showMessage(targetID, message, callback) {
  let previousHTML = document.getElementById(targetID).innerHTML;
  document.getElementById(
    targetID
  ).innerHTML = `<div class='show_message'>${message}</div>`;

  //restaura a função de fechar do formulário
    if(callback){callback()}
}

export function blockSubmitForm(form) {
  form.querySelector("input[type='submit']").setAttribute("disabled", true);
}
export function removeblockSubmitForm(form) {
  form.querySelector("input[type='submit']").removeAttribute("disabled");
}


export function getReverseObjectKeys(obj) {
  let objKeys = Object.keys(obj);
  let sortedObjKeys = objKeys.sort();
  sortedObjKeys.reverse();
  return sortedObjKeys;
}