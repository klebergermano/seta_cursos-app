//------------------------------------------------------------------------
//Components
import * as commonFunc from "../../js_common/commonFunctions.js";
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
          optionsSelect += `<option value='${contrato.id}'>${contrato.id} - <b>${contrato.data().resp_info.nome} (${contrato.data().curso_info.nome})</option>`; 
        });
        selectContrato.innerHTML = optionsSelect;
  }

  function insertInfoContrato(e){
    let IDContrato = e.target.value;
    const formAddAluno =  document.querySelector("#form_add_aluno");
    getContratoInfo(IDContrato).then((res)=>{
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

 

function getContratoInfo(IDContrato){
  let contratoInfo = getDoc(doc(db, 'contratos', IDContrato));
  return contratoInfo
}

function getContratos(){
  const contratos = getDocs(collection(db, 'contratos'))
  return contratos;
}
//------------------------------------------------------------------------------------
function addDateMonth(num_mes, date) {
  let i = num_mes;
  let vencimento_data = date; //formato deve ser o mesmo do DB  "yyyy-mm-dd" ex: "2020-01-02"
  vencimento_data = vencimento_data.split("-");
  let dia_split = vencimento_data[2];
  let mes_split = vencimento_data[1];
  let ano_split = vencimento_data[0];
  let mes_futuro = parseInt(mes_split) + i;
  mes_split = mes_futuro;
  if (mes_split > 12) {
    mes_split = mes_split - 12;
    ano_split = parseInt(ano_split) + 1;
  }
  if (dia_split > "28" && mes_split == "2") {
    dia_split = "28";
  } else if (dia_split > "30") {
    switch (mes_split) {
      case 4:
        dia_split = "30";
        break;
      case 6:
        dia_split = "30";
        break;
      case 9:
        dia_split = "30";
        break;
      case 11:
        dia_split = "30";
        break;
    }
  }
  let data_final =
    ano_split +
    "-" +
    (parseInt(mes_split) + "").padStart(2, "0") +
    "-" +
    (parseInt(dia_split) + "").padStart(2, "0");

  return data_final;
}

function setDateDay(data_inicio, vencimento) {
  let d = new Date(data_inicio + ", 00:00:00");
  let year = d.getFullYear();
  let month = (d.getMonth() + 1).toString().padStart(2, "0");
  let day = vencimento.toString().padStart(2, "0");
  let newDate = `${year}-${month}-${day}`;
  return newDate;
}

 //--------------n_lanc-----------------------

 function createNumeroLancamento(idContrato, n_parcela){
   console.log(idContrato, n_parcela);
 let  n_lanc = idContrato + 'F' + n_parcela;
 return n_lanc;
}
//------------------------------------------------------

function createParcelas(form) {
  console.log(form);
  let data_vencimento = setDateDay(form.curso_inicio.value, form.curso_vencimento.value);
  let num_parcelas = parseInt(form.curso_parcelas.value);
  let parcelas = {};
  for (let i = 0; i < num_parcelas; i++) {
    let p_vencimento = addDateMonth(i, data_vencimento);
    let num_parcela = (i + 1).toString().padStart(2, '0'); 
    parcelas[num_parcela] = {
        n_lanc : createNumeroLancamento(form.curso_id_contrato.value, (num_parcela)),
        vencimento: p_vencimento,
        valor: form.curso_valor_mes.value,
        desconto: form.curso_desconto_mes.value,
        valor_total: form.curso_valor_total_mes.value,
        pagamento:{
          status: "pendente",
          form_pag: "",
          pago_em: "",
          valor_pago: "",
          obs: "",
        },
    };
  }
  return parcelas;
}



//-----------------------------------------------

  //Salva o aluno no banco de dados.
  async function submitFormAddAluno(e) {
    e.preventDefault();
    let form = e.target;
    let RA = (form.aluno_ra.value).toUpperCase()

     setDoc(doc(db, "alunato", RA, "cursos", form.curso_nome.value),
    { 
      bimestres: {},
      curso_info:{
        id_contrato: form.curso_id_contrato.value,
        nome: form.curso_nome.value, 
        duracao: form.curso_duracao.value, 
        vencimento: form.curso_vencimento.value, 
        parcelas_total: form.curso_parcelas.value,
        parcelas: createParcelas(form),
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
      commonFunc.defaultEventsAfterSubmitFixedForm("#alunos_submenu_content", "Aluno salvo com sucesso!");

    }).catch((error) => console.error("Erro ao adicionar Aluno:", error));
  }



    
