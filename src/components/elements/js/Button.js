class Button {
  constructor(color, text) {
    this.color = color;
    this.text = text;
  }


  createRoundCheckboxBtn() {
    const label = document.createElement("label");
    label.classList.add("roundCheckboxBtn");
    label.setAttribute("for", "checkboxBtn");
    label.innerHTML = `
    <input id='checkboxBtn' type='checkbox' style='display:none'/>`;
    _handleClickBtn(label)
    return label;

    function _handleClickBtn(){
      label.addEventListener('click', ()=>{
        console.log(click)
      })
    return label; 
    }
  }

  createDefaultBtn() {
    const btn = document.createElement("button");
    btn.textContent = this.text;
    btn.classList.add("CheckboxBtn");
    return btn.outerHTML;
  }

}

export default Button;