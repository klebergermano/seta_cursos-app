
import { insertViewTableContratosHTML } from "./viewTableContratos.js"
import { insertFormAddContratoHTML } from "./formAddContrato.js"

export function onload() {
  document.querySelector('#btn_add_contrato').addEventListener('click', (e) => {
    insertFormAddContratoHTML();
  })
  document.querySelector('#btn_contratos_view_table').addEventListener('click', (e) => {
    insertViewTableContratosHTML();
  })
  insertViewTableContratosHTML()
}