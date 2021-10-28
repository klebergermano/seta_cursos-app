import * as commonFunc from "../../js_common/commonFunctions.js";
import * as formAddAluno from "../js/formAddAluno.js"
import * as alunosInfoTable from "../js/alunosInfoTable.js"

export function eventsSubmenuPage(){
    document.querySelector('#btn_add_aluno').addEventListener('click', (e)=>{
        formAddAluno.insertFormAddAlunoHTML();
    })  
    document.querySelector('#btn_alunos_info_table').addEventListener('click', (e)=>{
        alunosInfoTable.inserAlunosInfoInTable();
    })  


}