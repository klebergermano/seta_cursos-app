
//Components
import { eventsFormAddAula } from "./formAddAula.js";
import insertElementHTML from "../../jsCommon/insertElementHTML.js";

//---------------------------------------------------------------//

export function insertFormReposicaoAula(eventClick) {
  let form = insertElementHTML('#page_content',
    './components/controleAula/formAddAula.html');
  form.then((formRes) => {
    eventsFormAddAula(formRes);
    eventsFormReposicaoAula(formRes)
  });
}

function eventsFormReposicaoAula(form) {
  let aulaStatus = form.querySelector('#div_status_aula');

  let aulaCategoria = form.querySelector('#aula_categoria');
  aulaStatus.style.display = 'none';
  let title = form.querySelector('h3');
  title.textContent = 'Adicionar Aula de Reposição'
  let selectAula = form.querySelector('#select_aula');

  selectAula.innerHTML = `
<option value='' disabled selected>Selecione a Aula</option>
<option value='reposição da aula 01'>Reposição da Aula 1</option>
<option value='reposição da aula 02'>Reposição da Aula 2</option>
<option value='reposição da aula 03'>Reposição da Aula 3</option>
<option value='reposição da aula 04'>Reposição da Aula 4</option>
<option value='reposição da aula 05'>Reposição da Aula 5</option>
<option value='reposição da aula 06'>Reposição da Aula 6</option>
<option value='reposição da aula 07'>Reposição da Aula 7</option>
<option value='reposição da aula 08'>Reposição da Aula 8</option>
<option value='reposição da aula 09'>Reposição da Aula 9</option>
<option value='reposição da aula 10'>Reposição da Aula 10</option>
<option value='reposição da aula 11'>Reposição da Aula 11</option>
<option value='reposição da aula 12'>Reposição da Aula 12</option>
<option value='reposição da aula 13'>Reposição da Aula 13</option>
<option value='reposição da aula 14'>Reposição da Aula 14</option>
<option value='reposição da aula 15'>Reposição da Aula 15</option>
<option value='reposição da aula 16'>Reposição da Aula 16 - Prova</option>
`;

  selectAula.addEventListener('change', (e) => {

    if (e.target.value === "reposição da aula 16") {
      form.querySelector("#bg_prova_inputs").style.display = "flex";
      form.querySelector("#div_detalhes").style.display = "none";
      form.querySelector("#nota_prova").setAttribute("required", true);
      form.querySelector("#numero_questoes").setAttribute("required", true);
      form.querySelector("#obs_prova").setAttribute("required", true);
      form.querySelector("#detalhes").removeAttribute("required");
      aulaCategoria.value = 'reposição de prova';

    } else {
      aulaCategoria.value = 'reposição';
      form.querySelector("#div_detalhes").style.display = "flex";
      form.querySelector("#bg_prova_inputs").style.display = "none";
      form.querySelector("#nota_prova").removeAttribute("required");
      form.querySelector("#numero_questoes").removeAttribute("required");
      form.querySelector("#obs_prova").removeAttribute("required");
      form.querySelector("#detalhes").setAttribute("required", true);
    }
  })
}

