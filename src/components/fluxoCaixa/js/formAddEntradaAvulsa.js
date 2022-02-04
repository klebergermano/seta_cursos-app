
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js"
const { getFirestore, doc, setDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import { defaultEventsAfterSubmitFixedForm, insertElementHTML } from "../../jsCommon/commonFunctions.js";
import { setCurrentDate, converteMesNumeroPorExtenso } from '../../jsCommon/dateFunc.js';
import createNewRowFluxoCaixa from "./createNewRowFluxoCaixa.js";
import { addLogInfo } from "../../logData/js/logFunctions.js";
//---------------------------------------------------------------//
//Others libraries
const VMasker = require("vanilla-masker");
//---------------------------------------------------------------//

export function insertFormAddEntradaAvulsa() {
  insertElementHTML("#entradas_content", "./components/fluxoCaixa/formAddEntradaAvulsa.html", eventsFormAddEntradaAvulsa, null, true)
}

function setMasks() {
  let valor = document.querySelector("#entrada_avulsa_valor");
  VMasker(valor).maskMoney();
}

function eventsFormAddEntradaAvulsa() {
  setCurrentDate('#data');
  document.querySelector('#form_add_entrada_avulsa').addEventListener('submit', (e) => {
    e.preventDefault();
    submitFormAddEntradaAvulsa(e)
  });
  setMasks()
}

function submitFormAddEntradaAvulsa(e) {
  e.preventDefault();
  let dataValue = document.querySelector('#data').value;
  let data = new Date(dataValue + ',' + '00:00:00')
  let ano = (data.getFullYear()).toString();
  let mes = converteMesNumeroPorExtenso((data.getMonth() + 1));

  let form = document.querySelector('#form_add_entrada_avulsa');
  let valor = form.entrada_avulsa_valor.value;
  let descricao = form.descricao.value;
  createNewRowFluxoCaixa(ano, mes)
    .then((row) => {
      setDoc(doc(db, "fluxo_caixa", ano),
        {
          [mes]: {
            [row]: {
              row: row,
              categoria: "entrada_avulsa",
              data: form.data.value,
              descricao: form.descricao.value,
              form_pag: form.form_pag.value,
              valor: form.entrada_avulsa_valor.value,
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
        defaultEventsAfterSubmitFixedForm("#form_add_entrada_avulsa", "Saída de caixa adicionada com sucesso!");
      }).then(() => {
        addLogInfo('log_fluxo_caixa', 'insert', `entradata_avulsa - ${descricao} - ${valor}`);
      }).catch((error) => {
        addLogInfo('log_fluxo_caixa', 'error', `entradata_avulsa - ${descricao} - ${valor}`, error);
      });
    });
}
