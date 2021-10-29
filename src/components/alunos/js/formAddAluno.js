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
    const alunoNomeInput = formAddAluno.querySelector("#aluno_nome");
    const respNomeInput = formAddAluno.querySelector("#resp_nome");
    const cursoNomeInput = formAddAluno.querySelector("#curso_nome");
    getContratoInfo(IDContrato).then((res)=>{
      alunoNomeInput.value = res.data().aluno_info.nome;
      respNomeInput.value = res.data().resp_info.nome;
      cursoNomeInput.value = res.data().curso_info.nome;
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
        rg: "",
        email: "",
        end: "",
        bairro: "",
        cep: "",
        data_nasc: "",
        genero: "",
        cadastrado: "0000-00-00",
        obs:"",
       },
       responsavel:{
        nome: form.resp_nome.value, 
        rg: "",
        email: "",
        end: "",
        bairro: "",
        cep: "",
        data_nasc: "",
        genero: "",
        cadastrado: "0000-00-00",
        obs:"",
       }
    },
     { merge: true}
     ); 

     // { nome: form.nome.value}, { merge: true}); 
    }).then(()=>{
      commonFunc.defaultEventsAfterSubmitForm("#form_add_aluno", "Aluno salvo com sucesso!");

    }).catch((error) => console.error("Erro ao adicionar Aluno:", error));
  }



    
