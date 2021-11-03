


import * as commonFunc from "../../js_common/commonFunctions.js";
//----------------------------------------------------
import { firebaseApp } from "../../../components/dbConfig/firebaseApp.js"
const { getFirestore, doc, setDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//------------------------------------------------------

export function insertFormEntradaCaixa(){
commonFunc.insertElementHTML("#fluxo_caixa_content", "./components/fluxoCaixa/formAddEntradaCaixa.html", eventsFormEntradaCaixa, null, true)
}

function eventsFormEntradaCaixa() {
    commonFunc.btnCloseForm('#form_add_user');
    let form = document.querySelector('#form_add_entrada_caixa');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitFormAddEntradaCaixa(form)
    });
}



function submitFormAddEntradaCaixa(form){
    let ano = '2021';
    let mes = 'janeiro';
    let id = '01';
 
      setDoc(doc(db, "fluxo_caixa", ano), 
     { 
       aluno: {
        data: form.data.value, 
        ra: form.ra.value, 
        resp: form.resp.value, 
        aluno: form.aluno_nome.value, 
        curso: form.curso_nome.value,

        parcela: form.parcela.value,
        vencimento: form.vencimento.value,
        form_pag: form.form_pag.value,

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

 
    },
     { merge: true}
     ); 

}
