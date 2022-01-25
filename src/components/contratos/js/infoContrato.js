

import { insertElementHTML, displaySpinnerLoad, removeSpinnerLoad} from "../../js_common/commonFunctions.js";
import {submitFormContratoPDF} from "./formAddContrato.js";
//firestore
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore,  getDoc, doc } = require("firebase/firestore");
const db = getFirestore(firebaseApp);

export function insertInfoContratoHTML(idContrato){
    insertElementHTML("#contratos_content", "./components/contratos/infoContrato.html",  ()=>{eventsInfoContrato(idContrato)}, null, true)
}
function eventsInfoContrato(idContrato){
    getDoc(doc(db, 'contratos', idContrato))
    .then((contratoInfo)=>{
        document.querySelector("#form_info_contrato").addEventListener('submit', (e)=>{
e.preventDefault();
submitFormContratoPDF(e)
        });
        insertValuesInputs(contratoInfo)
    }).catch((err)=> console.log(err));
}

function insertValuesInputs(contratoInfo){
    contratoInfo = contratoInfo.data();
let parentesco_resp = contratoInfo.aluno_info.parentesco_resp;
if(parentesco_resp === 'IDEM'){
    document.querySelector("#checkbox_resp_aluno").setAttribute('checked', true);
}
   
        //Resp
        document.querySelector('#resp_nome').value = contratoInfo.resp_info.nome;
        document.querySelector('#resp_genero').value = contratoInfo.resp_info.genero;
        document.querySelector('#resp_end').value = contratoInfo.resp_info.end;
        document.querySelector('#resp_end_numero').value = contratoInfo.resp_info.end_numero;
        document.querySelector('#resp_bairro').value = contratoInfo.resp_info.bairro;
        document.querySelector('#resp_cep').value = contratoInfo.resp_info.cep;
        document.querySelector('#resp_data_nasc').value = contratoInfo.resp_info.data_nasc;
        document.querySelector('#resp_email').value = contratoInfo.resp_info.email;
        document.querySelector('#resp_rg').value = contratoInfo.resp_info.rg;
        document.querySelector('#resp_cel').value = contratoInfo.resp_info.cel;
        document.querySelector('#resp_tel').value = contratoInfo.resp_info.tel;
    //Aluno
  
    document.querySelector('#aluno_parentesco').value = contratoInfo.aluno_info.parentesco_resp;
    document.querySelector('#aluno_nome').value = contratoInfo.aluno_info.nome;
    document.querySelector('#aluno_genero').value = contratoInfo.aluno_info.genero;
    document.querySelector('#aluno_end').value = contratoInfo.aluno_info.end;
    document.querySelector('#aluno_end_numero').value = contratoInfo.aluno_info.end_numero;
    document.querySelector('#aluno_bairro').value = contratoInfo.aluno_info.bairro;
    document.querySelector('#aluno_cep').value = contratoInfo.aluno_info.cep;
    document.querySelector('#aluno_data_nasc').value = contratoInfo.aluno_info.data_nasc;
    document.querySelector('#aluno_email').value = contratoInfo.aluno_info.email;
    document.querySelector('#aluno_rg').value = contratoInfo.aluno_info.rg;
    document.querySelector('#aluno_cel').value = contratoInfo.aluno_info.cel;
    document.querySelector('#aluno_tel').value = contratoInfo.aluno_info.tel;

    //Curso
    document.querySelector('#curso_cod').value = contratoInfo.curso_info.cod;
    document.querySelector('#curso_nome').value = contratoInfo.curso_info.nome;
    document.querySelector('#curso_modulos').value = contratoInfo.curso_info.modulos;
    document.querySelector('#curso_duracao').value = contratoInfo.curso_info.duracao;
    document.querySelector('#curso_parcelas').value = contratoInfo.curso_info.parcelas;
    document.querySelector('#curso_valor').value = contratoInfo.curso_info.valor_mes;
    document.querySelector('#curso_desconto').value = contratoInfo.curso_info.desconto_mes;
    document.querySelector('#curso_valor_total').value = contratoInfo.curso_info.valor_total_mes;
    document.querySelector('#curso_data_contrato').value = contratoInfo.curso_info.data_contrato;
    document.querySelector('#curso_vencimento').value = contratoInfo.curso_info.vencimento;

    document.querySelector('#curso_carga_horaria').value = contratoInfo.curso_info.carga_horaria;
    document.querySelector('#curso_horas_aula').value = contratoInfo.curso_info.horas_aula;

    document.querySelector('#curso_obs').value = contratoInfo.curso_info.obs;
    document.querySelector('#curso_inicio').value = contratoInfo.curso_info.inicio;
    document.querySelector('#combo_textarea').innerHTML = contratoInfo.curso_info.desconto_combo;

}

