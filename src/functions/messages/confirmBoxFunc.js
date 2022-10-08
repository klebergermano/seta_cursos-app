//helpers
import $ from "../helpers/$.js";
import addEventListenerToEl from "../helpers/addEventListenerToEl.js";

//--------------------------------------------------------------//

const confirmBoxDelete = (idTarget) => (msg) => (callback) => {
  console.log('confirmBoxDelete')
  const boxMessage = _createBoxMessage(msg);
  const btnDelete = boxMessage.querySelector('.btn-default-delete');
  const btnCancel = boxMessage.querySelector('.btn-default-cancel');
  const btnClose = boxMessage.querySelector('.btn_close');

  addEventListenerToEl(btnDelete)('click')((e) => { 
    console.log('confirmBoxDelete:', e.currentTarget.closest('td'))
    callback(e); _closeConfirmBox(e) 
  })
  addEventListenerToEl(btnCancel)('click')((e) => {
    _closeConfirmBox(e)
  })
  addEventListenerToEl(btnClose)('click')(
    (e) => {
      _closeConfirmBox(e)
    })

  _insertBoxMessage(idTarget)(boxMessage);

}

function _createBoxMessage(msg) {
  let bgMsgBox = document.createElement('div');
  bgMsgBox.className = 'block_screen';
  let msgBox = document.createElement('div');
  msgBox.className = 'confirm_box confirm_box_deletar';
  msgBox.innerHTML = `<span class='btn_close'>X</span><p>${msg}</p>
  <button class='btn-default-delete'>Deletar</button><button class='btn-default-cancel' button>Cancelar</button>`;
  bgMsgBox.innerHTML = msgBox.outerHTML;
  return bgMsgBox;
}

const _insertBoxMessage = (idTarget) => (boxMessage) => {
  const targetEl = $(idTarget);
  targetEl.insertAdjacentElement('afterbegin', boxMessage);
}

function _closeConfirmBox(e) {
  console.log('close confirm box')
  const confirmBox = e.target.closest('.confirm_box')
  const parent = confirmBox.parentElement;
  console.log(parent)
  
  parent.style.display = 'none';
  confirmBox.style.display = 'none';
  confirmBox.style.border = '10px solid #f90';


  parent.removeChild(confirmBox);
  if (parent.className.includes('block_screen')) {
    let block_screen = parent;
    let parent_block_screen = block_screen.parentElement;
    parent_block_screen.removeChild(block_screen);
  }
}


export default confirmBoxDelete;
