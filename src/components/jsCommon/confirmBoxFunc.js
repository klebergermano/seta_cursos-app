export function confirmBoxDelete(target, msg, callback) {
    let elementTarget = document.querySelector(target);
    let bgMsgBox = document.createElement('div');
    bgMsgBox.className = 'block_screen';
  
    let msgBox = document.createElement('div');
    msgBox.className = 'confirm_box confirm_box_deletar';
    msgBox.innerHTML = `<span class='btn_close'>X</span><p>${msg}</p>
    <button class='btn-default-delete'>Deletar</button><button class='btn-default-cancel' button>Cancelar</button>`;
    bgMsgBox.innerHTML = msgBox.outerHTML;
  
  
    bgMsgBox.querySelector('.btn-default-delete').addEventListener('click', (e) => {
      callback();
      closeConfirmBox(e)
    });
  
    bgMsgBox.querySelector('.btn-default-cancel').addEventListener('click', (e) => {
      closeConfirmBox(e)
    });
    bgMsgBox.querySelector('.btn_close').addEventListener('click', (e) => {
      closeConfirmBox(e)
    });
    elementTarget.insertAdjacentElement('afterbegin', bgMsgBox);
  }

  function closeConfirmBox(e) {
    let confirmBox = e.target.closest('.confirm_box')
    parent = confirmBox.parentElement;
    parent.removeChild(confirmBox);
    if (parent.className.includes('block_screen')) {
      let block_screen = parent;
      let parent_block_screen = block_screen.parentElement;
      parent_block_screen.removeChild(block_screen);
    }
  };