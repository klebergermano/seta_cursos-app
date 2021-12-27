//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js"
const { getFirestore, doc, getDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);

export default function createNewRowEntradaCaixa(ano, mes) {
  let newRow = getDoc(doc(db, 'fluxo_caixa', ano))
    .then((ano) => {
      let row;
      if (typeof ano.data()[mes] !== 'undefined' ||  !isNaN(typeof ano.data()[mes])) {
        let mesData = ano.data()[mes]
        let rowsKeys = Object.keys(mesData);
        if(rowsKeys.length > 0){
          let rowSort = rowsKeys.sort((a, b) => {
            return parseInt(a) - parseInt(b);
          })
          let lastRowKey = (rowSort[rowSort.length - 1]);
          row = (parseInt(lastRowKey) + 1).toString().padStart(2, '0');
        }else{
          row = '01';
        }

      } else {
        row = '01';
      }
      return row;
    })
  return newRow;
}