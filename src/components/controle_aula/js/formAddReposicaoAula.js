

import * as formAddAula from "./formAddAula.js";
import * as commonFunc from "../../js_common/commonFunctions.js";
import * as dateFunc from "../../js_common/dateFunc.js";

export function insertFormReposicaoAula(eventClick){
    let form = commonFunc.insertElementHTML('#page_content',
    './components/controle_aula/formAddAula.html');
  
    form.then((formRes)=>{
      formAddAula.eventsFormAddAula(formRes);
      eventsFormReposicaoAula(formRes)
    });
  }
  
function eventsFormReposicaoAula(form){
let aulaStatus = form.querySelector('#div_status_aula');
let aulaCategoria = form.querySelector('#select_categoria');
aulaCategoria.selectedIndex = 1;
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
<option value='reposição da aula 16'>Reposição da Aula 16</option>
`;
}