


import * as commonFunc from "../../js_common/commonFunctions.js";
//----------------------------------------------------
import { firebaseApp } from "../../dbConfig/firebaseApp.js"
const { getFirestore, doc, setDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//------------------------------------------------------

export function insertFormPagMensalidade(){
commonFunc.insertElementHTML("#fluxo_caixa_content", "./components/fluxoCaixa/formAddPagMensalidade.html", eventsFormPagMensalidade, null, true)
}

function eventsFormPagMensalidade() {
   
    document.querySelector('#form_add_pag_mensalidade').addEventListener('submit', (e) => {
        e.preventDefault();
       submitFormAddPagMensalidade(e)
    });
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
