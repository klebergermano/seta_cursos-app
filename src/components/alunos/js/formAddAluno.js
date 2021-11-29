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
      //Aluno
      formAddAluno.querySelector("#aluno_nome").value = contrato.aluno_info.nome;
      formAddAluno.querySelector("#aluno_genero").value = contrato.aluno_info.genero;
      formAddAluno.querySelector("#aluno_end").value = contrato.aluno_info.end;
      formAddAluno.querySelector("#aluno_end_numero").value = contrato.aluno_info.end_numero;
      formAddAluno.querySelector("#aluno_bairro").value = contrato.aluno_info.bairro;
      formAddAluno.querySelector("#aluno_cep").value = contrato.aluno_info.cep;
      formAddAluno.querySelector("#aluno_rg").value = contrato.aluno_info.rg;
      formAddAluno.querySelector("#aluno_cel").value = contrato.aluno_info.cel;
      formAddAluno.querySelector("#aluno_tel").value = contrato.aluno_info.tel;
      formAddAluno.querySelector("#aluno_email").value = contrato.aluno_info.email;
      //Resp
      formAddAluno.querySelector("#resp_nome").value = contrato.resp_info.nome;
      formAddAluno.querySelector("#resp_genero").value = contrato.resp_info.genero;
      formAddAluno.querySelector("#resp_end").value = contrato.resp_info.end;
      formAddAluno.querySelector("#resp_end_numero").value = contrato.resp_info.end_numero;
      formAddAluno.querySelector("#resp_bairro").value = contrato.resp_info.bairro;
      formAddAluno.querySelector("#resp_cep").value = contrato.resp_info.cep;
      formAddAluno.querySelector("#resp_data_nasc").value = contrato.resp_info.data_nasc;
      formAddAluno.querySelector("#resp_rg").value = contrato.resp_info.rg;
      formAddAluno.querySelector("#resp_cpf").value = contrato.resp_info.cpf;
      formAddAluno.querySelector("#resp_tel").value = contrato.resp_info.tel;
      formAddAluno.querySelector("#resp_cel").value = contrato.resp_info.cel;
      formAddAluno.querySelector("#resp_email").value = contrato.resp_info.email;
      //Curso
      formAddAluno.querySelector("#curso_id_contrato").value = id_contrato;
      formAddAluno.querySelector("#curso_nome").value = contrato.curso_info.nome;
      formAddAluno.querySelector("#curso_duracao").value = contrato.curso_info.duracao;
      formAddAluno.querySelector("#curso_parcelas").value = contrato.curso_info.parcelas;
      formAddAluno.querySelector("#curso_vencimento").value = contrato.curso_info.vencimento;
      formAddAluno.querySelector("#curso_valor_mes").value = contrato.curso_info.valor_mes;
      formAddAluno.querySelector("#curso_desconto_mes").value = contrato.curso_info.desconto_mes;
      formAddAluno.querySelector("#curso_valor_total_mes").value = contrato.curso_info.valor_total_mes;
      formAddAluno.querySelector("#curso_inicio").value = contrato.curso_info.inicio;
      formAddAluno.querySelector("#curso_data_contrato").value = contrato.curso_info.data_contrato;
      formAddAluno.querySelector("#curso_desconto_combo").value = contrato.curso_info.desconto_combo;
      formAddAluno.querySelector("#curso_modulos").value = contrato.curso_info.modulos;
      formAddAluno.querySelector("#curso_obs").value = contrato.curso_info.obs;
    })
  }

//-----------------------------------------------

  //Salva o aluno no banco de dados.
  async function submitFormAddAluno(e) {
    e.preventDefault();
    let form = e.target;
    let RA = (form.aluno_ra.value).toUpperCase()
    //Objecto utilizado para criar as parcelas com "createParcelas(parcelaInfo)".
    let parcelaInfo = {
      id_contrato: form.curso_id_contrato.value,
      inicio: form.curso_inicio.value, 
      vencimento: form.curso_vencimento.value,
      parcelas: form.curso_parcelas.value,
      valor_mes: form.curso_valor_mes.value,
      desconto_mes: form.curso_desconto_mes.value,
      valor_total_mes: form.curso_valor_total_mes.value,
  }
     setDoc(doc(db, "alunato", RA, "cursos", form.curso_nome.value),
    { 
      bimestres: {},
      curso_info:{
        id_contrato: form.curso_id_contrato.value,
        nome: form.curso_nome.value, 
        duracao: form.curso_duracao.value, 
        vencimento: form.curso_vencimento.value, 
        parcelas_total: form.curso_parcelas.value,
        parcelas: createParcelas(parcelaInfo),
        valor_mes: form.curso_valor_mes.value, 
        desconto_mes: form.curso_desconto_mes.value, 
        valor_total_mes: form.curso_valor_total_mes.value, 
        inicio: form.curso_inicio.value, 
        data_contrato: form.curso_data_contrato.value, 
        desconto_combo: form.curso_desconto_combo.value, 
        modulos: form.curso_modulos.value, 
        obs: form.curso_obs.value, 
      },
      resp_info:{
        ra: RA, 
        nome: form.resp_nome.value, 
        genero: form.resp_genero.value, 
        end: form.resp_end.value, 
        end_numero: form.resp_end_numero.value, 
        bairro: form.resp_bairro.value, 
        cep: form.resp_cep.value, 
        data_nasc: form.resp_data_nasc.value, 
        rg: form.resp_rg.value,
        cpf: form.resp_cpf.value,
        email: form.resp_cpf.value,
        cel: form.resp_cel.value,
        tel: form.resp_tel.value,
        metadata:{
          created: new Date(),
          modified: new Date()
        }
       }
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
        obs:  form.aluno_obs.value,
        metadata:{
          created: new Date(),
          modified: new Date()
        }
       },
       
 
    },
     { merge: true}
     ); 

     // { nome: form.nome.value}, { merge: true}); 
    }).then(()=>{
      defaultEventsAfterSubmitFixedForm("#alunos_content", "Aluno salvo com sucesso!");

    }).catch((error) => console.error("Erro ao adicionar Aluno:", error));
  }



    
