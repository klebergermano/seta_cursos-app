

//===========================================================================
//------------------------------- OTHERS ------------------------------------
//===========================================================================

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


export function getReverseObjectKeys(obj) {
  let objKeys = Object.keys(obj);
  let sortedObjKeys = objKeys.sort();
  sortedObjKeys.reverse();
  return sortedObjKeys;
}

export function addEventListenerInAllElements(targetElements, event, callback) {
  let elements = document.querySelectorAll(targetElements);
  elements.forEach((item) => {
    item.addEventListener(event, (e) => {
      callback(e)
    });
  });
}

//Substitui todos os espaços e parenteses por underscore usando REGEX
export function stringToID(string) {
  let id = string.replace(/\s+|\(|\)/g, "_").toLowerCase();
  return id;
}


export function removeBugExtraBgFormBLockScreen() {
  let formBlocks = document.querySelectorAll(".bg_form_block_screen");
  for (let i = 0; i < formBlocks.length - 1; i++) {
    let item = formBlocks[i];
    let parent = item.parentElement;
    parent.removeChild(item);
  }
}
/*

export function createRadomIdLogBasedOnData() {
  let data = new Date();
  let idLog = data.getFullYear() + '' + (data.getMonth() + 1) + '' + data.getDate() + '' + readableRandomStringMaker(5);
  return idLog;
}

export function readableRandomStringMaker(length) {
  for (var s = ''; s.length < length; s += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.random() * 62 | 0));
  return s;
}

*/