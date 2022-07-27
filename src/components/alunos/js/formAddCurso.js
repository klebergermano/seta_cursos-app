//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, setDoc, doc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import { btnCloseForm, defaultEventsAfterSubmitForm} from "../../jsCommon/formsFunc.js";
import  insertElementHTML from "../../jsCommon/insertElementHTML.js";
import { getContratosListDB, createParcelas, insertOptionsSelectContrato } from "./commonAlunos.js";
import { insertViewTableAlunosHTML } from "./viewTableAlunos.js";
import { addLogInfo } from "../../logData/js/logFunctions.js";
//---------------------------------------------------------------//


let $contratosListInfo = {};
let $contratoInfo = {};
let $alunoInfo = {};

export function insertFormAddCursoHTML(RA, alunoNome, RG) {
  insertElementHTML('#page_content',
    './components/alunos/formAddCurso.html', () => {
      eventsFormAddCurso(RA, alunoNome, RG)
    });
}

function eventsFormAddCurso(RA, alunoNome, RG) {
  let alunoInfo = {};
  alunoInfo.nome = alunoNome;
  alunoInfo.rg = RG;
  setContratosListInfo();
  document.querySelector("#aluno_ra").value = RA;
  document.querySelector("#aluno_nome").value = alunoNome;
  document.querySelector("#aluno_rg").value = RG;
  btnCloseForm("#form_add_curso");
  insertOptionsSelectContrato()
  document.querySelector("#select_contrato").addEventListener("change", (e) => {
    let IDContrato = e.target.value;
    let contratoInfo = setContratoInfo(IDContrato);
    $contratoInfo = contratoInfo;
    $alunoInfo = alunoInfo;

    if (validaContrato(contratoInfo, alunoInfo)) {
      removeBlockSubmit();
    } else {
      blockSubmit()
    }
  });

  document.querySelector("#form_add_curso").addEventListener('submit', (e) => {
    e.preventDefault();
    if (validaContrato($contratoInfo, $alunoInfo)) {
      removeBlockSubmit();
      submitformAddCurso(e)
    } else {
      blockSubmit()
    }
  });
}

function blockSubmit() {
  let fieldsetInfo = document.querySelector('#contrato_info');
  let formSubmit = document.querySelector('#form_add_curso input[type="submit"]');
  fieldsetInfo.classList = "blocked";
  formSubmit.setAttribute('disabled', true);
}
function removeBlockSubmit() {
  let fieldsetInfo = document.querySelector('#contrato_info');
  let formSubmit = document.querySelector('#form_add_curso input[type="submit"]');
  fieldsetInfo.classList = "";
  formSubmit.removeAttribute('disabled');
}
function setContratosListInfo() {
  const contratos = getContratosListDB();
  contratos.then((res) => {
    $contratosListInfo = res;
  })
  return contratos;
}

function setInputsContratoInfo(contratoInfo) {
  document.querySelector("#info_aluno_nome").value = contratoInfo.aluno_info.nome;
  document.querySelector("#info_aluno_rg").value = contratoInfo.aluno_info.rg;
}

function validaContrato(contratoInfo, alunoInfo) {
  let alunoNome = (contratoInfo?.aluno_info?.nome).toLowerCase().trim();
  let alunoRG = (contratoInfo?.aluno_info?.rg);
  if (alunoNome === alunoInfo.nome.toLowerCase().trim() && alunoRG === alunoInfo.rg && alunoNome !== undefined && alunoRG !== undefined) {
    return true;
  } else {
    if (alunoNome.trim() === alunoInfo.nome.trim()) {
    }
    return false;
  }
}

function setContratoInfo(IDContrato) {
  let contratoInfo;
  $contratosListInfo.forEach((item) => {
    if (item.id === IDContrato) {
      setInputsContratoInfo(item.data())
      contratoInfo = item.data();
    }
  })
  return contratoInfo;
}

function submitformAddCurso(e) {
  e.preventDefault();
  
  let form = e.target;
  let cursoNome = $contratoInfo.curso_info.nome;
  let RA = (form.aluno_ra.value).toUpperCase()
  //Objecto utilizado para criar as parcelas com "createParcelas(parcelaInfo)".
  let parcelaInfo = {
    id_contrato:($contratoInfo.metadata.id).trim(),
    inicio:($contratoInfo.curso_info.inicio).trim(),
    vencimento:($contratoInfo.curso_info.vencimento).trim(),
    parcelas:($contratoInfo.curso_info.parcelas).trim(),
    valor_mes:($contratoInfo.curso_info.valor_mes).trim(),
    desconto_mes:($contratoInfo.curso_info.desconto_mes).trim(),
    valor_total_mes:($contratoInfo.curso_info.valor_total_mes).trim(),
  }
  setDoc(doc(db, "alunato", RA, "cursos", $contratoInfo.curso_info.nome),
    {
      status_info: {
        situacao: 'ativo',
        data: new Date(),
       
    },

      bimestres: {},
      curso_info: {
        id_contrato:($contratoInfo.metadata.id).trim(),
        cod:($contratoInfo.curso_info.cod).trim(),
        nome:($contratoInfo.curso_info.nome).trim(),
        duracao:($contratoInfo.curso_info.duracao).trim(),
        vencimento:($contratoInfo.curso_info.vencimento).trim(),
        carga_horaria:($contratoInfo.curso_info.carga_horaria).trim(),
        horas_aula:($contratoInfo.curso_info.horas_aula).trim(),
        parcelas_total:($contratoInfo.curso_info.parcelas).trim(),
        parcelas: createParcelas(parcelaInfo),
        valor_mes:($contratoInfo.curso_info.valor_mes).trim(),
        desconto_mes:($contratoInfo.curso_info.desconto_mes).trim(),
        valor_total_mes:($contratoInfo.curso_info.valor_total_mes).trim(),
        inicio:($contratoInfo.curso_info.inicio).trim(),
        data_contrato:($contratoInfo.curso_info.data_contrato).trim(),
        desconto_combo:($contratoInfo.curso_info.desconto_combo).trim(),
        modulos:($contratoInfo.curso_info.modulos).trim(),
        obs:($contratoInfo.curso_info.obs).trim(),
      },
      resp_info: {
        ra: (RA).trim(),
        nome: ($contratoInfo.resp_info.nome).trim(),
        genero: ($contratoInfo.resp_info.genero).trim(),
        end: ($contratoInfo.resp_info.end).trim(),
        end_numero: ($contratoInfo.resp_info.end_numero).trim(),
        bairro: ($contratoInfo.resp_info.bairro).trim(),
        cep: ($contratoInfo.resp_info.cep).trim(),
        data_nasc: ($contratoInfo.resp_info.data_nasc).trim(),
        rg: ($contratoInfo.resp_info.rg).trim(),
        cpf: ($contratoInfo.resp_info.cpf).trim(),
        email: ($contratoInfo.resp_info.cpf).trim(),
        cel: ($contratoInfo.resp_info.cel).trim(),
        tel: ($contratoInfo.resp_info.tel).trim(),
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
    }, { merge: true })
    .then(() => {
      setDoc(doc(db, "contratos", $contratoInfo.metadata.id),
        {
          metadata: {
            aluno_associado: RA
          }
        },
        { merge: true }
      );
    })
    .then(() => {
      defaultEventsAfterSubmitForm("#form_add_curso", "Curso adicionado com sucesso!");
    }).then(() => {
      setTimeout(() => {
        insertViewTableAlunosHTML();
      }, 2000)
    }).then(() => {
      addLogInfo('log_alunato', 'curso_adicionado', RA + '-' + cursoNome);
    })
    .catch((error) => {
      addLogInfo('log_alunato', 'error', RA, error);
      console.error("Erro ao adicionar curso: ", error)
    });



}
