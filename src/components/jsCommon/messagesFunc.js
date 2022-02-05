//===========================================================================
//--------------------------- MESSAGES --------------------------------------
//===========================================================================

export function showMessage(targetID, message, callback) {
  document.querySelector(targetID).innerHTML = `<div class='show_message'>${message}</div>`;
  if (callback) callback()
}

export function showFixedMessage(targetID, message, callback) {
  document.querySelector(targetID).innerHTML = `<div class='show_fixed_message'>${message}</div>`;
  if (callback) callback()
}

//---------------------------------------------
//---------------------------------------------
//---------------------------------------------
//---------------------------------------------
//---------------------------------------------

//TODO: conferir se funções estão em uso
/*
export function insertMessage(targetID, message, callback) {
  document.getElementById(targetID).innerHTML =
    `<div class='show_message'>${message}</div>`;
  //restaura a função de fechar do formulário
  if (callback) { callback() }
}




export function showTemporaryMessage
  (target, msg, duration = 2000, style = "default", blockScreen = false, callback) {
  let elementTarget = document.querySelector(target);
  let divMessage = document.createElement('div');
  if (blockScreen) {
    divMessage.id = 'block_screen_msg';
    divMessage.innerHTML = `<div class='temp_msg'><p>${msg}</p></div>`;
  } else {
    divMessage.className = 'temp_msg';
    divMessage.innerHTML = `<p>${msg}</p>`;
  }

  elementTarget.appendChild(divMessage);
  setTimeout(() => {
    elementTarget.removeChild(divMessage)
  }, duration);
  divMessage.classList.add(style + '_temp_msg');
  if (callback) callback();
}
*/