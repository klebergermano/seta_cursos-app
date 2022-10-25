//Electron
const { ipcRenderer } = require("electron");
//---------------------------------------------------------------//
//Firebase
import {firebaseApp } from "../../dbConfig/firebaseApp.js";
const {getFirestore, setDoc, doc} = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import { btnCloseForm, defaultEventsAfterSubmitForm } from "../../jsCommon/formsFunc.js";
import insertElementHTML from "../../jsCommon/insertElementHTML.js";
import { displaySpinnerLoad, removeSpinnerLoad } from "../../jsCommon/spinnerJS.js";
import { setCurrentDate } from "../../jsCommon/dateFunc.js";
//---------------------------------------------------------------//

export function insertFormAddCertificadoHTML(certificadoInfo) {
  console.log('certificadoInfo:', certificadoInfo)
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

function createCertificadoCod(certificadoInfo){
  let certificadoCod = ''; 
let letrasNome = (certificadoInfo.aluno).substring('0', '2').toUpperCase();
let RANumber = (certificadoInfo.ra).slice(2);
let cursoCod = certificadoInfo.curso_cod;

certificadoCod += letrasNome + RANumber + cursoCod; 

return certificadoCod; 
};

function insertCertificadoInfoInputs(certificadoInfo){
 
  let form = document.querySelector("#form_add_certificado");
  form.querySelector("#certificado_cod").value = createCertificadoCod(certificadoInfo);
  form.querySelector("#aluno_ra").value = certificadoInfo.ra;
  form.querySelector("#aluno_nome").value = certificadoInfo.aluno;
  form.querySelector("#curso_nome").value = certificadoInfo.curso;
  form.querySelector("#curso_modulos_certificado").value = certificadoInfo.modulos_certificado;
  form.querySelector("#curso_carga_horaria").value = certificadoInfo.carga_horaria;
  form.querySelector("#curso_inicio").value = certificadoInfo.inicio;
  form.querySelector("#curso_conclusao").value = certificadoInfo.conclusao;
   setCurrentDate("#form_add_certificado #data_emissao");
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
      removeSpinnerLoad("#form_add_certificado");
  });
}

function submitformAddCertificado(e) {
  e.preventDefault();
  //Pega todas as informações dos elementos do formAddCertificado.
  let form = e.target.elements; 
  let formArr = Array.from(form);
  let certificadoInfo = {};
  formArr.forEach((item)=>{
    certificadoInfo[item.id] = item.value;
  });

  setDoc(doc(db, "alunato", certificadoInfo.aluno_ra, "cursos", certificadoInfo.curso_nome),
    {
      curso_info: {
        certificado:{
          entregue: "",
          cod: (certificadoInfo.certificado_cod).trim(), 
          data_emissao: (certificadoInfo.data_emissao).trim(), 
          local: (certificadoInfo.endereco).trim(), 
          obs: (certificadoInfo.obs).trim(), 
        }
      },

    }, {merge: true})

  .then(()=>{
    submitCertificadoPDF(certificadoInfo);
  }).then(() =>{
    defaultEventsAfterSubmitForm("#form_add_certificado", "Certificado adicionado com sucesso!");
   }).catch((error) => console.error("Erro ao adicionar certificado: ", error));

  
}
