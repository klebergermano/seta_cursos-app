export function changeCSSDisplay(target, display) {
    document.querySelector(target).style.display = display;
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

//usado para mostrar mensagem após um submit
export function showMessage(targetID, message) {
  let previousHTML = document.getElementById(targetID).innerHTML;
  document.getElementById(
    targetID
  ).innerHTML = `<div class='show_message'>${message}</div>`;
  setTimeout(() => {
    document.getElementById(targetID).innerHTML = previousHTML;
  }, 2000);
  //restaura a função de fechar do formulário
  setTimeout(() => {
    AddEventBtnCloseForm();
  }, 2200);
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