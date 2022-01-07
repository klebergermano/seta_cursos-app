const { ipcRenderer } = require("electron");
//---------------------------------------------------------------------
//Firestore
import {firebaseApp } from "../../dbConfig/firebaseApp.js";
const {getFirestore, setDoc, doc, getDocs, collection } = require("firebase/firestore")
const db = getFirestore(firebaseApp);

//Components
import {  insertElementHTML, displaySpinnerLoad,removeSpinnerLoad, btnCloseForm, defaultEventsAfterSubmitForm } from "../../js_common/commonFunctions.js";
//---------------------------------------------------------------------
export function insertFormAddCertificadoHTML(certificadoInfo) {
  insertElementHTML('#page_content',
    './components/alunos/formAddCertificado.html', () => {
      eventsFormAddCertificado(certificadoInfo)
    });
}

function eventsFormAddCertificado(certificadoInfo) {
  btnCloseForm("#form_add_certificado");
  insertCertificadoInfoInputs(certificadoInfo);

  document.querySelector("#form_add_certificado").addEventListener("submit", (e)=>{
    e.preventDefault();
    submitformAddCertificado(e);
    
  })
}

function insertCertificadoInfoInputs(certificadoInfo){
  console.log(certificadoInfo);
  let form = document.querySelector("#form_add_certificado");
  form.querySelector("#aluno_ra").value = certificadoInfo.ra;
  form.querySelector("#aluno_nome").value = certificadoInfo.aluno;
  form.querySelector("#curso_nome").value = certificadoInfo.curso;
  form.querySelector("#curso_modulos").value = certificadoInfo.modulos;
  form.querySelector("#curso_carga_horaria").value = certificadoInfo.carga_horaria;
  form.querySelector("#curso_inicio").value = certificadoInfo.inicio;
  form.querySelector("#data_expedicao").value = new Date();
}
function submitCertificadoPDF(certificadoInfo) {
  displaySpinnerLoad("#form_add_certificado", true);
  let result = new Promise((resolve, reject) => {
      let res = ipcRenderer.invoke("createCertificadoPDF", certificadoInfo);
      if (res) {
          resolve(res);
      } else {
          reject();
      }
  });
  result.then(() => {
      //loadinContrato.style.display = "none";
      removeSpinnerLoad("#form_add_certificado");
  });
}

function submitformAddCertificado(e) {
  e.preventDefault();
//Pega todas as informações dos elementos do formAddCertificado.
    let form = Array.from(e.target.elements);
    let certificadoInfo = {};
    form.forEach((item)=>{
      certificadoInfo[item.id] = item.value;
    });
  submitCertificadoPDF(certificadoInfo);
  /*
  setDoc(doc(db, "alunato", RA, "cursos", $contratoInfo.curso_info.nome),
    {
      bimestres: {},
      curso_info: {
        id_contrato: $contratoInfo.metadata.id,
        nome: $contratoInfo.curso_info.nome,
        duracao: $contratoInfo.curso_info.duracao,
        vencimento: $contratoInfo.curso_info.vencimento,
        parcelas_total: $contratoInfo.curso_info.parcelas,
        parcelas: createParcelas(parcelaInfo),
        valor_mes: $contratoInfo.curso_info.valor_mes,
        desconto_mes: $contratoInfo.curso_info.desconto_mes,
        valor_total_mes: $contratoInfo.curso_info.valor_total_mes,
        inicio: $contratoInfo.curso_info.inicio,
        data_contrato: $contratoInfo.curso_info.data_contrato,
        desconto_combo: $contratoInfo.curso_info.desconto_combo,
        modulos: $contratoInfo.curso_info.modulos,
        obs: $contratoInfo.curso_info.obs,
      },
      resp_info: {
        ra: RA,
        nome: $contratoInfo.resp_info.nome,
        genero: $contratoInfo.resp_info.genero,
        end: $contratoInfo.resp_info.end,
        end_numero: $contratoInfo.resp_info.end_numero,
        bairro: $contratoInfo.resp_info.bairro,
        cep: $contratoInfo.resp_info.cep,
        data_nasc: $contratoInfo.resp_info.data_nasc,
        rg: $contratoInfo.resp_info.rg,
        cpf: $contratoInfo.resp_info.cpf,
        email: $contratoInfo.resp_info.cpf,
        cel: $contratoInfo.resp_info.cel,
        tel: $contratoInfo.resp_info.tel,
        metadata: {
          created: new Date(),
          modified: new Date()
        }
      },
      metadata: {
        status: 'ativo',
        created: new Date(),
        modified: new Date()
      }
    }, {merge: true})
    .then(()=>{
      setDoc(doc(db, "contratos",  $contratoInfo.metadata.id), 
      { 
        metadata:{
          aluno_associado: RA
        }
     },
      { merge: true}
      ); 
    })
  .then(() =>{
    defaultEventsAfterSubmitForm("#form_add_curso", "Curso adicionado com sucesso!");
   }).catch((error) => console.error("Erro ao adicionar curso: ", error));

*/
  
}
