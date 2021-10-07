const VMasker = require("vanilla-masker");

function insertInputValue(target, value) {
  document.querySelector(target).value = value;
}

//Soma valores decimais em string ex.: "9,99" + "70,45", retorna string formatada "99,99".
function addClassNameElement(className, target) {
    let element = document.querySelector(target);
    element.classList.add(className);
  }
  
  function removeClassNameElement(className, target) {
    let element = document.querySelector(target);
    element.classList.remove(className);
  }
  
function SumStringDecimal(value1, value2) {
    let v1 = value1.replace(",", "").replace(".", "");
    let v2 = value2.replace(",", "").replace(".", "");
    let res = "" + (v1 - v2);
    if (res.search("-")) {
      removeClassNameElement("red", "#curso_total");
    } else {
      addClassNameElement("red", "#curso_total");
    }
    let t = VMasker.toMoney(res, { showSignal: true });
    return t;
  };

  //Exported Module
function insertInputValorTotal() {
    let desconto = document.querySelector("#curso_desconto");

    let valor = document.querySelector("#curso_valor");
    let valor_total = SumStringDecimal(valor.value, desconto.value);
    insertInputValue("#curso_total", valor_total);
  }
  
export default insertInputValorTotal;