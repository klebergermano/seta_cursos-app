

var $alunoInfo = {};

import * as commonFunc from "../../js_common/commonFunctions.js";
//----------------------------------------------------
import { firebaseApp } from "../../dbConfig/firebaseApp.js"
const { getFirestore, doc, setDoc, onSnapshot, collection, getDocs, getDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//------------------------------------------------------

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
     
    $alunoInfo.cursos = cursos;
      optionsCurso += `<option value='${doc.data().curso_info.nome}'>${doc.data().curso_info.nome}</option>`;
    })
    selectCurso.innerHTML = optionsCurso;
   });
 }
 
 function getParcelas(nomeCurso){
   let options = ``;
   let parcelas = $alunoInfo.cursos[nomeCurso].parcelas;
   let i = 1; 
     for(let parcela of Object.values(parcelas)){
       if(parcela.status !== 'pago'){
        options += `<option value='parcela ${i}'>Parcela ${i}</option>`;
       }else{
        options += `<option disabled value='parcela ${i}'>Parcela ${i}</option>`;

       }
        i++; 
     }
     let selectParcelas = document.querySelector("#select_parcelas");
     selectParcelas.innerHTML = options;
  /*
  console.log($alunoInfo);
   let RA = getRAfromMainSelectAluno();
  let idCurso = getSelectCursoID()

   getDoc(doc(db, 'alunato', RA, 'cursos', idCurso))
  .then((res)=>{
    console.log(res.data());

  })
  */
 }
 function getSelectCursoID(){
let select = document.querySelector('#select_curso');
let idCurso = select.options[select.selectedIndex].value;
return idCurso;
 }
export function insertFormPagMensalidade(){
commonFunc.insertElementHTML("#fluxo_caixa_content", "./components/fluxoCaixa/formAddPagMensalidade.html", eventsFormPagMensalidade, null, true)
}

function eventsFormPagMensalidade() {
  insertSelectAlunos()
  document.querySelector('#select_curso').addEventListener('change', (e) => {
    getParcelas(e.target.value)
  });
  document.querySelector('#main_select_aluno').addEventListener('change', (e) => {
  setSelectCursos()
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
