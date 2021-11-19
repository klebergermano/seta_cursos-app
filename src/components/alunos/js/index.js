import {insertInfoTableAlunosHTML} from "../js/infoTableAlunos.js";
import {insertFormAddAlunoHTML} from "../js/formAddAluno.js";
import * as commonFunc from "../../js_common/commonFunctions.js";



export function onload(){
    document.querySelector('#btn_add_aluno').addEventListener('click', (e)=>{
        insertFormAddAlunoHTML();
    })  
    document.querySelector('#btn_alunos_info_table').addEventListener('click', (e)=>{
    insertInfoTableAlunosHTML()

    })  


    insertInfoTableAlunosHTML()


}



