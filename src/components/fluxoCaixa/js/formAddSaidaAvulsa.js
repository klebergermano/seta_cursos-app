

//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js"
const { getFirestore, doc, setDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
import { setCurrentDate, converteMesNumeroPorExtenso } from '../../jsCommon/dateFunc.js';
import { defaultEventsAfterSubmitFixedForm, insertElementHTML } from "../../jsCommon/commonFunctions.js";
import { addLogInfo } from '../../logData/js/logFunctions.js';
//---------------------------------------------------------------//
//Others libraries
const VMasker = require("vanilla-masker");
//---------------------------------------------------------------//
//Funções do componente
import createNewRowFluxoCaixa from "./createNewRowFluxoCaixa.js";
//---------------------------------------------------------------//

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
  let valor = form.saida_valor.value;
  let descricao = form.descricao.value;

  createNewRowFluxoCaixa(ano, mes)
    .then((row) => {
      setDoc(doc(db, "fluxo_caixa", ano),
        {
          [mes]: {
            [row]: {
              row: row,
              categoria: "saida_avulsa",
              data: form.data.value,
              descricao: form.descricao.value,
              tipo_saida: form.tipo_saida.value,
              valor: form.saida_valor.value,
              descricao: descricao,
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
    }).then(() => {
      addLogInfo('log_fluxo_caixa', 'insert', `saida_avulsa - ${descricao} - ${valor}`);
    }).catch((error) => {
      addLogInfo('log_fluxo_caixa', 'error', `saida_avulsa - ${descricao} - ${valor}`, error);
    });

}
