
function insertComboTextarea() {
  let total = document.querySelector("#curso_valor_total");
  let desconto = document.querySelector("#curso_desconto");
  let comboTextarea = document.querySelector("#combo_textarea");
  let comboCurso1 = document.querySelector("#combo_curso_1");
  let comboCurso2 = document.querySelector("#combo_curso_2");

  comboTextarea.innerHTML =
    'O RESPONSÁVEL receberá desconto de R$ <span class="red">' +
    desconto.value +
    "</span> em cada parcela" +
    " referente ao pacote de cursos<b> (" +
    comboCurso1.value +
    "</b> + <b>" +
    comboCurso2.value +
    "</b>), " +
    'passando o valor das parcelas a R$ <span class="green"><b>' +
    total.value +
    "</b></span>, " +
    "(Desconto válido somente enquanto o ALUNO(a) frequentar os 2 Cursos, voltando o valor " +
    "a sua totalidade caso o ALUNO(a) conclua ou desista de um dos cursos).";
}

export default insertComboTextarea;