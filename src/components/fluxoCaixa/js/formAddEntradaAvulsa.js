


//--------------------------------------------------------------------
import { setCurrentDate, converteMesNumeroPorExtenso } from '../../js_common/dateFunc.js';
import createNewRowFluxoCaixa from "./createNewRowFluxoCaixa.js";
import {defaultEventsAfterSubmitFixedForm, insertElementHTML} from "../../js_common/commonFunctions.js";

//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js"
const { getFirestore, doc, setDoc, onSnapshot, updateDoc, collection, getDocs, getDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);

//Others libraries
const VMasker = require("vanilla-masker");
//--------------------------------------------------------------------
export function insertFormAddEntradaAvulsa() {
  insertElementHTML("#entradas_content", "./components/fluxoCaixa/formAddEntradaAvulsa.html", eventsFormAddEntradaAvulsa, null, true)
}

function setMasks() {
  VMasker(document.querySelector('#entrada_avulsa_valor')).maskMoney();
  
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
  createNewRowFluxoCaixa(ano, mes)
    .then((row) => {
      setDoc(doc(db, "fluxo_caixa", ano),
        {
          [mes]: {
            [row]: {
              row: row,
              categoria: "entrada_avulsa_caixa",
              data: form.data.value,
              descricao: form.descricao.value,
              tipo_entrada_avulsa: form.tipo_entrada_avulsa.value,
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
        defaultEventsAfterSubmitFixedForm("#form_add_entrada_avulsa_caixa", "Saída de caixa adicionada com sucesso!");
      });
    });

}
