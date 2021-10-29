//------------------------------------------------------------------------
//Components
import * as commonFunc from "../../js_common/commonFunctions.js";
import * as  dbAlunoHistFunc from "../../js_common/dbAlunoHistoricoFunc.js";
import * as  alunoRA from "../../alunos/js/alunoRA.js";
//Firebase
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, setDoc,  doc, collection, getDocs} = require("firebase/firestore") 
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
      submitFormAddAluno(e);
  });
  insertSelectOptionsContratos()
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

  function insertInfoContrato(){
    

  }
function getContratos(){
  const contratos = getDocs(collection(db, 'contratos'))
 return contratos;
}

  //Salva o aluno no banco de dados.
  async function submitFormAddAluno(e) {
    let form = e.target;
    let RA = (form.add_aluno_ra.value).toUpperCase()
    e.preventDefault();
     setDoc(doc(db, "alunato", RA, "cursos", form.curso_nome.value),
    { curso: form.curso_nome.value,
      bimestres: {}
    }).then(()=>{
      setDoc(doc(db, "alunato", RA), 
     { 
       aluno: {
        ra: RA, 
        nome: form.nome.value, 
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
       
    
    }, 
     { merge: true}
     ); 

     // { nome: form.nome.value}, { merge: true}); 
    }).then(()=>{
      commonFunc.defaultEventsAfterSubmitForm("#form_add_aluno", "Aluno salvo com sucesso!");

    }).catch((error) => console.error("Erro ao adicionar Aluno:", error));
  }



    
