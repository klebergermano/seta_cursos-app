


//--------------------------------------------------------------------
import { setCurrentDate, converteMesNumeroPorExtenso } from '../../js_common/dateFunc.js';
import createNewRowFluxoCaixa from "./createNewRowFluxoCaixa.js";
import {defaultEventsAfterSubmitFixedForm, insertElementHTML} from "../../js_common/commonFunctions.js";

//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js"
const { getFirestore, doc, setDoc} = require("firebase/firestore")
const db = getFirestore(firebaseApp);

//Others libraries
const VMasker = require("vanilla-masker");
//--------------------------------------------------------------------
export function insertFormAddSaidaAvulsa() {
  insertElementHTML("#saidas_content", "./components/fluxoCaixa/formAddSaidaAvulsa.html", eventsFormAddSaidaAvulsa, null, true)
}

function setMasks() {
  VMasker(document.querySelector('#saida_valor')).maskMoney();
}

function eventsFormAddSaidaAvulsa() {
  setCurrentDate('#data');
  document.querySelector('#form_add_saida_avulsa').addEventListener('submit', (e) => {
  e.preventDefault();
    submitFormAddPagMensalidade(e)
  });
  setMasks() 

}

function submitFormAddPagMensalidade(e) {
  e.preventDefault();
  let dataValue = document.querySelector('#data').value;
  let data = new Date(dataValue + ',' + '00:00:00')
  let ano = (data.getFullYear()).toString();
  let mes = converteMesNumeroPorExtenso((data.getMonth() + 1));

  let form = document.querySelector('#form_add_saida_avulsa');
  createNewRowFluxoCaixa(ano, mes)
    .then((row) => {
      setDoc(doc(db, "fluxo_caixa", ano),
        {
          [mes]: {
            [row]: {
              row: row,
              categoria: "saida_caixa",
              data: form.data.value,
              descricao: form.descricao.value,
              tipo_saida: form.tipo_saida.value,
              valor: form.saida_valor.value,
              descricao: form.descricao.value,
              metadata: {
                created: new Date(),
                modified: new Date()
              }
            }
          }
        },
        { merge: true }
      ).then(() => {
        defaultEventsAfterSubmitFixedForm("#form_add_saida_avulsa", "Saída de caixa adicionada com sucesso!");
      });
    });

}
