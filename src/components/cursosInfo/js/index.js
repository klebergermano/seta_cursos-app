
import { insertViewTableCursosInfoHTML } from "./viewTableCursosInfo.js";
import { insertFormAddCursosInfoHTML } from "./formAddCursoInfo.js";
import {checkRolePermission } from "../../../appContent/adminContent/js/checkPermission.js";


export function onload() {
console.log(window.$PERMISSIONS);

  document.querySelector('#btn_add_curso_info').addEventListener('click', (e) => {
   insertFormAddCursosInfoHTML();
  })
  document.querySelector('#btn_view_table_cursos_info').addEventListener('click', (e) => {
   insertViewTableCursosInfoHTML()

  })
  insertViewTableCursosInfoHTML()
}