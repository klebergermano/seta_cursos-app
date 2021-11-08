

var $alunoInfo = {
  RA : '',
  nome : ''
};

import * as commonFunc from "../../js_common/commonFunctions.js";
import insertInputValorTotal from "../../contratos/js/insertInputValorTotal.js";
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
         selectAluno += `<option value='${doc.id}-${doc.data().aluno.nome}'>${doc.id} - ${doc.data().aluno.nome}</option>`;
       });
     document.querySelector("#main_select_aluno").innerHTML = selectAluno;
     })
 }

 function eventsFormPagMensalidade() {
  setMasks()
  setCurrentDate()
  insertSelectAlunos()
  document.querySelector('#main_select_aluno').addEventListener('change', (e) => {
    setSelectCursos()
    resetFieldsAfterSelectAlunoChange()
  });
  document.querySelector('#select_curso').addEventListener('change', (e) => {
    getParcelas(e.target.value)
    document.querySelector('#select_parcelas').removeAttribute('disabled')
  });

  document.querySelector('#select_parcelas').addEventListener('change', (e) => {
    setValoresParcela()
  });
  document.querySelector('#curso_desconto').addEventListener('input', (e) => {
   insertInputValorTotal();
  });

    document.querySelector('#form_add_pag_mensalidade').addEventListener('submit', (e) => {
        e.preventDefault();
       submitFormAddPagMensalidade(e)
    });
}

function getValueFromMainSelectAluno(){
  let select = document.querySelector("#main_select_aluno");
  let RA = select.options[select.selectedIndex].value;
  return RA;
}


function setAlunoInfoRANome(){
let valueMainSelect = getValueFromMainSelectAluno();
let arrValue = valueMainSelect.split('-');
$alunoInfo.RA = arrValue[0];
$alunoInfo.nome = arrValue[1];
console.log(arrValue);
}

 function setSelectCursos(){
  setAlunoInfoRANome()
  setNomeAndRAInput()
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
  let valor = document.querySelector('#curso_valor');
  let vencimento = document.querySelector('#vencimento');
  let valor_total = document.querySelector('#curso_valor_total');
  let desconto = document.querySelector('#curso_desconto');
  let resp = document.querySelector('#resp');
  let n_lanc = document.querySelector('#n_lanc');

  valor.value = $alunoInfo.cursos[curso].parcelas[parcela].valor;
  vencimento.value = $alunoInfo.cursos[curso].parcelas[parcela].vencimento;
  valor_total.value = $alunoInfo.cursos[curso].parcelas[parcela].valor_total;
  desconto.value = $alunoInfo.cursos[curso].parcelas[parcela].desconto;
  resp.value = $alunoInfo.cursos[curso]['resp'].nome;
  n_lanc.value = $alunoInfo.cursos[curso].parcelas[parcela].n_lanc;

}


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
function resetFieldsAfterSelectAlunoChange(){
  document.querySelector('#select_parcelas').setAttribute('disabled', true)
  document.querySelector('#select_parcelas').innerHTML = ""
  document.querySelector('#n_lanc').value = ''
}

function setMasks(){
  VMasker(document.querySelector('#curso_valor')).maskMoney();
  VMasker(document.querySelector('#curso_desconto')).maskMoney();
  VMasker(document.querySelector('#curso_valor_total')).maskMoney();
}
function setNomeAndRAInput(){
  console.log($alunoInfo);
 document.querySelector('#ra').value = $alunoInfo.RA;
  document.querySelector('#aluno').value = $alunoInfo.nome;

}

function setMonthDate(data){
  let mes = data.getMonth() + 1;
  let monthName = '';  
  switch(mes){
    case 1 : monthName = 'janeiro';
    break;
    case 2 : monthName = 'fevereiro';
    break;
    case 3 : monthName = 'março';
    break;
    case 4 : monthName = 'abril';
    break;
    case 5 : monthName = 'maio';
    break;
    case 6 : monthName = 'junho';
    break;
    case 7 : monthName = 'julho';
    break;
    case 8 : monthName = 'agosto';
    break;
    case 9 : monthName = 'setembro';
    break;
    case 10 : monthName = 'outubro';
    break;
    case 11 : monthName = 'novembro';
    break;
    case 12 : monthName = 'dezembro';
    break;
  }
return monthName;

}

function setIdFluxoEntradaMes(){

}
function createNewRowEntradaCaixa(ano, mes) {

let newRow = getDoc(doc(db, 'fluxo_caixa', ano))
      .then((ano) => {

        console.log('ANO:', ano.data());
        let row;
        if(typeof ano.data()[mes] !== 'undefined'){
          console.log('-----------------------------');
          console.log('MES:', ano.data()[mes]);
          console.log('-----------------------------');
          let rows = ano.data()[mes]
          let rowsKeys = Object.keys(rows);
          let lastRowKey = (rowsKeys[rowsKeys.length - 1]);
          row = (parseInt(lastRowKey) + 1).toString().padStart(2,'0'); 
        }else{
          row = '01';
        }
        console.log(row)
          return row; 
      })
      
    
  return newRow;
}

function submitFormAddPagMensalidade(e){
  e.preventDefault();
  let form = document.querySelector('#form_add_pag_mensalidade');
  let dataValue = document.querySelector('#data').value;
  let data = new Date(dataValue + ','+ '00:00:00')
  console.log(data);
  let ano = (data.getFullYear()).toString();

  let mes = setMonthDate(data);
 createNewRowEntradaCaixa(ano, mes)
 .then((row)=>{
      setDoc(doc(db, "fluxo_caixa", ano), 
     { 
       [mes]: {
         [row] : {
          ra: form.ra.value, 
          aluno: form.aluno.value, 
            n_lanc: form.n_lanc.value, 
            row: row,
            categoria: "pag_mensalidade",
            data: form.data.value, 
            resp: form.resp.value, 
            curso: form.select_curso.value, 
            parcela: form.select_parcelas.value, 
            vencimento: form.vencimento.value, 
            form_pag: form.forma_pag.value, 
            valor: form.curso_valor.value, 
            desconto: form.curso_desconto.value, 
            valor_total: form.curso_valor_total.value, 
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

      //Update parcela aluno como paga

     })
     .then(()=>{
      commonFunc.defaultEventsAfterSubmitFixedForm("#form_add_pag_mensalidade", "Pagamento adicionado com sucesso!");
     }); 
    });

}
