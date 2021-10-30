//------------------------------------------------------------------------
//Components
import * as commonFunc from "../../js_common/commonFunctions.js";
import * as  dbAlunoHistFunc from "../../js_common/dbAlunoHistoricoFunc.js";
import * as  alunoRA from "../../alunos/js/alunoRA.js";
//Firebase
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, setDoc,  doc, collection, getDocs, getDoc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);
//-------------------------------------------------------------------------

export function insertFormAddAlunoHTML(){
  commonFunc.insertElementHTML('#alunos_submenu_content',
  './components/alunos/formAddAluno.html', eventsFormAddAluno, null, true
  );
}

function eventsFormAddAluno(){
  let form = document.querySelector('#form_add_aluno');
  alunoRA.eventsAlunoRA();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
      submitFormAddAluno(e);
  });
  insertSelectOptionsContratos()

  form.querySelector("#select_contrato").addEventListener('change', (e)=>{
    insertInfoContrato(e)
  })
}
async function insertSelectOptionsContratos(){
  const selectContrato = document.querySelector("#form_add_aluno").querySelector("#select_contrato");
    let contratosList = await getContratos();
    let optionsSelect = "<option value='' disabled selected>Selectione um contrato</option>"; 
        contratosList.forEach((contrato)=>{

          optionsSelect += `<option value='${contrato.id}'>${contrato.id} - ${contrato.data().resp_info.nome}</option>`; 
        });
        selectContrato.innerHTML = optionsSelect;
  }


  function insertInfoContrato(e){
    let IDContrato = e.target.value;
  
    const formAddAluno =  document.querySelector("#form_add_aluno");
    getContratoInfo(IDContrato).then((res)=>{
      let contrato = res.data();
      formAddAluno.querySelector("#resp_nome").value = contrato.resp_info.nome;
      formAddAluno.querySelector("#curso_nome").value = contrato.curso_info.nome;
      formAddAluno.querySelector("#aluno_nome").value = contrato.aluno_info.nome;
      formAddAluno.querySelector("#aluno_email").value = contrato.aluno_info.email;
      formAddAluno.querySelector("#aluno_end").value = contrato.aluno_info.end;
      formAddAluno.querySelector("#aluno_end_numero").value = contrato.aluno_info.end_numero;
      formAddAluno.querySelector("#aluno_bairro").value = contrato.aluno_info.bairro;
      formAddAluno.querySelector("#aluno_cep").value = contrato.aluno_info.cep;
      formAddAluno.querySelector("#aluno_genero").value = contrato.aluno_info.genero;
      formAddAluno.querySelector("#aluno_obs").value = contrato.aluno_info.obs;
    })
  
  }
function getContratoInfo(IDContrato){
  
  let contratoInfo = getDoc(doc(db, 'contratos', IDContrato));
  return contratoInfo

}

  function getContratos(){
  const contratos = getDocs(collection(db, 'contratos'))
 return contratos;
}

  //Salva o aluno no banco de dados.
  async function submitFormAddAluno(e) {
    e.preventDefault();
    let form = e.target;
    let RA = (form.aluno_ra.value).toUpperCase()
   
     setDoc(doc(db, "alunato", RA, "cursos", form.curso_nome.value),
    { curso: form.curso_nome.value,
      bimestres: {}
    }).then(()=>{
      setDoc(doc(db, "alunato", RA), 
     { 
       aluno: {
        ra: RA, 
        nome: form.aluno_nome.value, 
        rg: form.aluno_rg.value,
        email: form.aluno_email.value,
        end: form.aluno_end.value,
        end_numero: form.aluno_end_numero.value,
        bairro: form.aluno_bairro.value,
        cep: form.aluno_cep.value,
        data_nasc: form.aluno_data_nasc.value,
        genero: form.aluno_genero.value,
        obs:"",
        meta_info:{
          created: "0000-00-00",
          modified: "0000-00-00"
        }
       },
      
    },
     { merge: true}
     ); 

     // { nome: form.nome.value}, { merge: true}); 
    }).then(()=>{
      commonFunc.defaultEventsAfterSubmitForm("#form_add_aluno", "Aluno salvo com sucesso!");

    }).catch((error) => console.error("Erro ao adicionar Aluno:", error));
  }



    
