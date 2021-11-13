//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js"
const { getFirestore, doc, getDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);

export default function createNewRowEntradaCaixa(ano, mes) {
    let newRow = getDoc(doc(db, 'fluxo_caixa', ano))
      .then((ano) => {
        let row;
        if (typeof ano.data()[mes] !== 'undefined') {
          let mesData = ano.data()[mes]
          let rowsKeys = Object.keys(mesData);
          console.log('rowsKeys: ', rowsKeys);
let rowSort = rowsKeys.sort((a, b)=>{ 
    return parseInt(a) - parseInt(b);
})
          let lastRowKey = (rowSort[rowSort.length - 1]);
          console.log('lastRowKey:', lastRowKey);
          row = (parseInt(lastRowKey) + 1).toString().padStart(2, '0');
          console.log('Row:', row);
        } else {
          row = '01';
        }
        return row;
      })
      console.log('newRow:', newRow);
    return newRow;
  }