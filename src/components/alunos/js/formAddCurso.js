//---------------------------------------------------------------------
//Firestore
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, setDoc, doc, getDocs, collection } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//Components
import * as dbAlunoHistFunc from "../../js_common/dbAlunoHistoricoFunc.js";
import {  insertElementHTML, btnCloseForm, defaultEventsAfterSubmitForm } from "../../js_common/commonFunctions.js";
import {getContratosListDB,  createParcelas,  insertOptionsSelectContrato} from "./commonAlunos.js";
//---------------------------------------------------------------------

let $contratosListInfo = {};
let $contratoInfo = {};

export function insertFormAddCursoHTML(RA, alunoNome) {
  insertElementHTML('#page_content',
    './components/alunos/formAddCurso.html', () => {
      eventsFormAddCurso(RA, alunoNome)
    });
}

function eventsFormAddCurso(RA, alunoNome) {
  setContratosListInfo();
  document.querySelector("#aluno_ra").value = RA;
  document.querySelector("#aluno_nome").value = alunoNome;
  btnCloseForm("#form_add_curso");
  
  insertOptionsSelectContrato()

  document.querySelector("#select_contrato").addEventListener("change", (e) => {
    let IDContrato = e.target.value;
    setContratoInfo(IDContrato)
  });

  document.querySelector("#form_add_curso").addEventListener('submit', (e) => {
    e.preventDefault();
    submitformAddCurso(e)
  });
}


function setContratosListInfo() {
  const contratos = getContratosListDB();
  contratos.then((res) => {
    $contratosListInfo = res;
  })
  return contratos;
}

function setInputsContratoInfo() {
  document.querySelector("#info_aluno_nome").value = $contratoInfo.aluno_info.nome;
}

function setContratoInfo(IDContrato) {
  $contratosListInfo.forEach((item) => {
    if (item.id === IDContrato) {
      $contratoInfo = item.data();
      setInputsContratoInfo()
      console.log($contratoInfo);
    }
  })
}


function submitformAddCurso(e) {
  console.log('ok');
  e.preventDefault();
  let form = e.target;
  
  let RA = (form.aluno_ra.value).toUpperCase()
  console.log(RA);
    //Objecto utilizado para criar as parcelas com "createParcelas(parcelaInfo)".
    let parcelaInfo = {
      id_contrato: $contratoInfo.metadata.id,
      inicio: $contratoInfo.curso_info.inicio, 
      vencimento: $contratoInfo.curso_info.vencimento,
      parcelas: $contratoInfo.curso_info.parcelas,
      valor_mes: $contratoInfo.curso_info.valor_mes,
      desconto_mes: $contratoInfo.curso_info.desconto_mes,
      valor_total_mes: $contratoInfo.curso_info.valor_total_mes,
  }
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
      }
    }, {merge: true})
  /*
  e.preventDefault();
  let form = e.target;
  let RA = form.select_aluno.value;
  let curso = form.select_curso.value; 
  setDoc(doc(db, 'alunato', RA, 'cursos', curso),
  { curso: form.select_curso.value,
    bimestres: {},
  }).then(() =>{
    defaultEventsAfterSubmitForm("#form_add_curso", "Curso adicionado com sucesso!");
   }).catch((error) => console.error("Erro ao adicionar curso: ", error));;
   */
}
