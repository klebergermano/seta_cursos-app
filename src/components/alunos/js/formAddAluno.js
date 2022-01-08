//-------------------------------------------------------------------------
//Firebase
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, setDoc,  doc, collection, getDocs, getDoc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);
//Components
import {insertElementHTML, defaultEventsAfterSubmitFixedForm} from "../../js_common/commonFunctions.js";
import {eventsAlunoRA} from "../../alunos/js/alunoRA.js";
import {getContratoInfoDB,  createParcelas,  insertOptionsSelectContrato} from "./commonAlunos.js";
//------------------------------------------------------------------------

let $contratoInfo = {};

export function insertFormAddAlunoHTML(){
   insertElementHTML('#alunos_content',
  './components/alunos/formAddAluno.html', eventsFormAddAluno, null, true
  );
}

function eventsFormAddAluno(){
  let form = document.querySelector('#form_add_aluno');
  eventsAlunoRA();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
      submitFormAddAluno(e);
  });
  insertOptionsSelectContrato()
  form.querySelector("#select_contrato").addEventListener('change', (e)=>{
    insertInfoContrato(e)
  })
}

  function insertInfoContrato(e){
    let IDContrato = e.target.value;
    const formAddAluno =  document.querySelector("#form_add_aluno");
    getContratoInfoDB(IDContrato).then((res)=>{

      let id_contrato = res.id; 
      let contrato = res.data();
          $contratoInfo = res.data();

      //Aluno
      formAddAluno.querySelector("#aluno_nome").value = contrato.aluno_info.nome;
      formAddAluno.querySelector("#aluno_genero").value = contrato.aluno_info.genero;
      formAddAluno.querySelector("#aluno_end").value = contrato.aluno_info.end;
      formAddAluno.querySelector("#aluno_end_numero").value = contrato.aluno_info.end_numero;
      formAddAluno.querySelector("#aluno_bairro").value = contrato.aluno_info.bairro;
      formAddAluno.querySelector("#aluno_cep").value = contrato.aluno_info.cep;
      formAddAluno.querySelector("#aluno_data_nasc").value = contrato.aluno_info.data_nasc;
      formAddAluno.querySelector("#aluno_rg").value = contrato.aluno_info.rg;
      formAddAluno.querySelector("#aluno_cel").value = contrato.aluno_info.cel;
      formAddAluno.querySelector("#aluno_tel").value = contrato.aluno_info.tel;
      formAddAluno.querySelector("#aluno_email").value = contrato.aluno_info.email;
      //Resp
      formAddAluno.querySelector("#resp_nome").value = contrato.resp_info.nome;
      formAddAluno.querySelector("#resp_rg").value = contrato.resp_info.rg;
      formAddAluno.querySelector("#resp_cpf").value = contrato.resp_info.cpf;

      //Curso
      formAddAluno.querySelector("#curso_nome").value = contrato.curso_info.nome;

    })
  }

//-----------------------------------------------
  //Salva o aluno no banco de dados.
  async function submitFormAddAluno(e) {
    e.preventDefault();
    console.log($contratoInfo);
    let form = e.target;
    let RA = (form.aluno_ra.value).toUpperCase()
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
        cod: $contratoInfo.curso_info.cod,
        nome: $contratoInfo.curso_info.nome,
        duracao: $contratoInfo.curso_info.duracao,
        vencimento: $contratoInfo.curso_info.vencimento,
        carga_horaria: $contratoInfo.curso_info.carga_horaria,
        horas_aula: $contratoInfo.curso_info.horas_aula,
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
    })
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
    .then(()=>{
      //Cria as informações do aluno em Alunato
      setInfoAlunoAlunato(RA)
    })
    .then(()=>{
      defaultEventsAfterSubmitFixedForm("#alunos_content", "Aluno salvo com sucesso!");
    }).catch((error) => console.error("Erro ao adicionar Aluno:", error));
  }

function setInfoAlunoAlunato(RA){
  setDoc(doc(db, "alunato", RA), 
  { 
    aluno: {
      ra: RA,
      genero: $contratoInfo.aluno_info.genero,
      nome: $contratoInfo.aluno_info.nome,
      rg: $contratoInfo.aluno_info.rg,
      email: $contratoInfo.aluno_info.email,
      end: $contratoInfo.aluno_info.end,
      end_numero: $contratoInfo.aluno_info.end_numero,
      bairro: $contratoInfo.aluno_info.bairro,
      cep: $contratoInfo.aluno_info.cep,
      data_nasc: $contratoInfo.aluno_info.data_nasc,
      cel: $contratoInfo.aluno_info.cel,
      tel: $contratoInfo.aluno_info.tel,
     metadata:{
       created: new Date(),
       modified: new Date()
     }
    },


    
 },{ merge: true}
  );
}
    
