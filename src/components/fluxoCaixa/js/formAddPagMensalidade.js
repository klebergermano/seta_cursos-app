

var $alunoInfo = {};

import * as commonFunc from "../../js_common/commonFunctions.js";
//--------------------------------------------------------------------
import { firebaseApp } from "../../dbConfig/firebaseApp.js"
const { getFirestore, doc, setDoc, onSnapshot, collection, getDocs, getDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);

//Others libraries
const VMasker = require("vanilla-masker");
//--------------------------------------------------------------------
export async function insertSelectAlunos(){
  onSnapshot(
     collection(db, "alunato"),
     (snap) => {
       let selectAluno = `<option disabled selected>Selecione o Aluno</option>`;
       snap.forEach((doc) => {
         selectAluno += `<option value='${doc.id}'>${doc.id} - ${doc.data().aluno.nome}</option>`;
       });
     document.querySelector("#main_select_aluno").innerHTML = selectAluno;
     })
 }

 function setSelectCursos(){
  $alunoInfo.RA = getRAfromMainSelectAluno();
  
   let selectCurso = document.querySelector("#select_curso");
   let optionsCurso = '<option disabled selected>Selecione o Curso</option>';
   getDocs(collection(db, 'alunato', $alunoInfo.RA, 'cursos'))
   .then((res)=>{
    let cursos = {};
    res.forEach((doc)=>{
     cursos[doc.data().curso_info.nome] = doc.data().curso_info;
     cursos[doc.data().curso_info.nome]['resp'] = doc.data().resp_info;
    $alunoInfo.cursos = cursos;
      optionsCurso += `<option value='${doc.data().curso_info.nome}'>${doc.data().curso_info.nome}</option>`;
    })
    selectCurso.innerHTML = optionsCurso;
   });
 }
 
 function getParcelas(nomeCurso){
   console.log($alunoInfo);
   let options = `<option disabled selected>Selecione a Parcela</option>`;
   let parcelas = $alunoInfo.cursos[nomeCurso].parcelas;
   let i = 1; 
     for(let parcela of Object.values(parcelas)){
       if(parcela.status !== 'pago'){
        options += `<option value='${i}'>Parcela ${i}</option>`;
       }else{
        options += `<option disabled value='${i}'>Parcela ${i}</option>`;
       }
        i++; 
     }
     let selectParcelas = document.querySelector("#select_parcelas");
     selectParcelas.innerHTML = options;

 }
 function getSelectCursoID(){
let select = document.querySelector('#select_curso');
let idCurso = select.options[select.selectedIndex].value;
return idCurso;
 }
export function insertFormPagMensalidade(){
commonFunc.insertElementHTML("#fluxo_caixa_content", "./components/fluxoCaixa/formAddPagMensalidade.html", eventsFormPagMensalidade, null, true)
}

function setValoresParcela(){
  let curso = getSelectCursoID();
  let parcela = getNumeroParcela()


 let valor = document.querySelector('#valor');
 let vencimento = document.querySelector('#vencimento');
 let valor_total = document.querySelector('#valor_total');
 let desconto = document.querySelector('#desconto');
 let resp = document.querySelector('#resp');
 let n_lanc = document.querySelector('#n_lanc');

 valor.value = $alunoInfo.cursos[curso].parcelas[parcela].valor;
 vencimento.value = $alunoInfo.cursos[curso].parcelas[parcela].vencimento;
 valor_total.value = $alunoInfo.cursos[curso].parcelas[parcela].valor_total;
 desconto.value = $alunoInfo.cursos[curso].parcelas[parcela].desconto;
 resp.value = $alunoInfo.cursos[curso]['resp'].nome;
 n_lanc.value = $alunoInfo.cursos[curso].parcelas[parcela].n_lanc;

 

 console.log($alunoInfo);
}
//--------------n_lanc-----------------------

function setNumeroLancamento(){
  let curso = getSelectCursoID();
  let n_lanc = document.querySelector('#n_lanc');
let n_parcela =  getNumeroParcela();
  n_lanc.value = $alunoInfo.cursos[curso].id_contrato + 'F' + (n_parcela.padStart(2, '0'));
}
//------------------------------------------------------

function getNumeroParcela(){
  let selectParcela = document.querySelector('#select_parcelas');
  let parcela = selectParcela.options[selectParcela.selectedIndex].value;
  return parcela;
}

function setCurrentDate(){
  console.log(new Date())
  let currentDate = new Date();
  let year =  currentDate.getFullYear(); 
  let month = ((currentDate.getMonth() + 1).toString()).padStart(2, '0');
  let day = ((currentDate.getDate()).toString()).padStart(2, '0'); 
  let fcurrentDate =  year + '-' + month + '-' + day;
  console.log(fcurrentDate);
  document.querySelector('#data').value = fcurrentDate;
}
function eventsFormPagMensalidade() {
  VMasker(document.querySelector('#valor')).maskMoney();
VMasker(document.querySelector('#desconto')).maskMoney();
VMasker(document.querySelector('#valor_total')).maskMoney();

  setCurrentDate()
  insertSelectAlunos()
  document.querySelector('#select_parcelas').addEventListener('change', (e) => {
   
    setValoresParcela()
  });

  document.querySelector('#select_curso').addEventListener('change', (e) => {
    getParcelas(e.target.value)
    document.querySelector('#select_parcelas').removeAttribute('disabled')

  });
  document.querySelector('#main_select_aluno').addEventListener('change', (e) => {

  setSelectCursos()
function resetFieldsAfterSelectAlunoChange(){
  document.querySelector('#select_parcelas').setAttribute('disabled', true)
  document.querySelector('#select_parcelas').innerHTML = ""
  document.querySelector('#n_lanc').value = ''
  
}

resetFieldsAfterSelectAlunoChange()

  
});
    document.querySelector('#form_add_pag_mensalidade').addEventListener('submit', (e) => {
        e.preventDefault();
       submitFormAddPagMensalidade(e)
    });
}

function getRAfromMainSelectAluno(){
  let select = document.querySelector("#main_select_aluno");
  let RA = select.options[select.selectedIndex].value;
  return RA;
}


function submitFormAddPagMensalidade(e){
  e.preventDefault();
  let form = document.querySelector('#form_add_pag_mensalidade');
  let ano = '2021';
  let mes = 'janeiro';
  let id = '02';

      setDoc(doc(db, "fluxo_caixa", ano), 
     { 
       [mes]: {
         [id] : {
            id: id,
            categoria: "pag_mensalidade",
            data: form.data.value, 
            ra: form.ra.value, 
            resp: form.resp.value, 
            aluno: form.aluno.value, 
            curso: form.curso.value,
            parcela: form.parcela.value,
            vencimento: form.vencimento.value,
            form_pag: form.forma_pag.value,
            valor: form.valor.value,
            desconto: form.desconto.value,
            valor_total: form.valor_total.value,
            n_lanc: form.n_lanc.value,
            obs: form.obs.value,
            metadata:{
              created: new Date(),
              modified: new Date()
            }
         }
      }
    },
     { merge: true}
     ).then(()=>{
      commonFunc.defaultEventsAfterSubmitFixedForm("#form_add_pag_mensalidade", "Pagamento adicionado com sucesso!");
     }); 

}
