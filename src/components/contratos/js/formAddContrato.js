const { ipcRenderer } = require("electron");
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, setDoc,  doc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

import * as commonFunc from "../../js_common/commonFunctions.js";


export function submitFormContrato(e){
    e.preventDefault();

let formInfo = createFormInfo(e);
console.log(formInfo);

setDoc(doc(db, "contratos", formInfo.id_contrato), 
{ 
  resp_info: {
   nome: formInfo.resp_nome, 
   genero: formInfo.resp_genero,
   end: formInfo.resp_end,
   end_numero: formInfo.resp_end_numero,
   bairro: formInfo.resp_bairro ,
   cep: formInfo.resp_cep,
   cpf: formInfo.resp_cpf,
   rg: formInfo.resp_rg,
   data_nasc: formInfo.resp_data_nasc,
   tel: formInfo.resp_tel,
   cel: formInfo.resp_cel,
   email: formInfo.resp_email,
  
  },
  aluno_info: {
    parentesco_resp: formInfo.aluno_parentesco, 
    nome: formInfo.aluno_nome, 
    genero: formInfo.aluno_genero,
    end: formInfo.aluno_end,
    end_numero: formInfo.aluno_end_numero,
    bairro: formInfo.aluno_bairro ,
    cep: formInfo.aluno_cep,
    rg: formInfo.aluno_rg,
    cel: formInfo.aluno_cel,
    tel: formInfo.aluno_tel,
    email: formInfo.aluno_email,
    data_nasc: formInfo.aluno_data_nasc,
   
  },

  curso_info: {
    nome: formInfo.curso_nome, 
    modulos: formInfo.curso_modulos,
    duracao: formInfo.curso_duracao,
    parcelas: formInfo.curso_parcelas,
    vencimento: formInfo.curso_vencimento,
    valor_mes: formInfo.curso_valor,
    desconto_mes: formInfo.curso_desconto,
    total_mes: formInfo.curso_valor,
    vencimento: formInfo.curso_vencimento,
    inicio: formInfo.curso_inicio,
    data_contrato: formInfo.curso_data_contrato,
    desconto_combo: formInfo.curso_combo,
    obs: formInfo.curso_obs
   },
   metadata:{
     status: "associacão pendente",
     aluno_associado: "",
     created: new Date(),
     modified: new Date()
   } 

}, 
{ merge: true}
); 

    submitFormContratoPDF(e)
}

function createFormInfo(e){
    const formData = [...e.target];
    let formInfo = {};

    let conclusao = new Date(e.target.curso_inicio.value);
    conclusao.setMonth(
         conclusao.getMonth() + parseInt(e.target.curso_duracao.value)
    );
    //Formata data
    let dia = String(conclusao.getDate() + 1).padStart(2, "0");
    let mes = String(conclusao.getMonth() + 1).padStart(2, "0");
    let ano = String(conclusao.getFullYear()).padStart(2, "0");
    let f_conclusao = ano + "-" + mes + "-" + dia;
    //Foreach que pega todos dos elementos inputs do submit e amazena em formInfo.
    formData.forEach((element) => {
      formInfo[`${element.id}`] = element.value;
    });
    //É necessário pegar o combo_textarea via selector por que ele não é um imput.
    let comboTextarea = document.querySelector("#combo_textarea");

    formInfo.curso_combo = comboTextarea.innerHTML;
    formInfo.curso_conclusao = f_conclusao;
  
    //Caso o Aluno seja o próprio responsável seta os valores como --/--
    if (e.target.checkbox_resp_aluno.checked) {
      formInfo.checkbox_resp_aluno = true;
      formInfo.aluno_nome = formInfo.resp_nome;
      formInfo.aluno_end = formInfo.resp_end;
      formInfo.aluno_numero = formInfo.resp_numero;
      formInfo.aluno_parentesco = "(IDEM)";
      formInfo.aluno_bairro = formInfo.resp_bairro;
      formInfo.aluno_cep = formInfo.resp_cep;
      formInfo.aluno_rg = formInfo.resp_rg;
      formInfo.aluno_data_nasc = formInfo.resp_data_nasc;
      formInfo.aluno_cel = formInfo.resp_cel;
      formInfo.aluno_tel = formInfo.resp_tel;
      formInfo.aluno_obs = formInfo.resp_obs;
    }else{
      formInfo.checkbox_resp_aluno = false;
    }
    /*
    if (e.target.checkbox_resp_aluno.checked) {
      formInfo.aluno_nome = "(IDEM)";
      formInfo.aluno_end = "(IDEM)";
      formInfo.aluno_numero = "(IDEM)";
      formInfo.aluno_parentesco = "(IDEM)";
      formInfo.aluno_bairro = "(IDEM)";
      formInfo.aluno_cep = "(IDEM)";
      formInfo.aluno_rg = "(IDEM)";
      formInfo.aluno_data_nasc = "(IDEM)";
      formInfo.aluno_cel = "(IDEM)";
      formInfo.aluno_tel = "(IDEM)";
      formInfo.aluno_obs = "(IDEM)";
    }
    */
    return formInfo;
}

//Envia o objeto com as informações do formulário para a main stream index.js
function submitFormContratoPDF(e) {
   let formValues = createFormInfo(e);
    let loadinContrato = document.querySelector("#loading_contrato");

    let result = new Promise((resolve, reject) => {
      let res = ipcRenderer.invoke("submit", formValues);
  
      loadinContrato.style.display = "block";
      if (res) {
        resolve(res);
      } else {
        reject();
      }
    });
    result.then(() => {
      loadinContrato.style.display = "none";
    });
  }