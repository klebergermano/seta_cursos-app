const _showFormMessage = (targetID) => (message) => {
  document.querySelector(targetID).innerHTML = `<div class='show_form_message'>${message}</div>`;
}

const defaultEventsAfterSubmitFixedForm = (formID) => (msg) => (callback) => {
  _showFormMessage(formID, msg)
  if(callback) callback();
};

export default defaultEventsAfterSubmitFixedForm;