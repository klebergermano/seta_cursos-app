
//firestore
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, getDocs, collection, getDoc, doc } = require("firebase/firestore");
const db = getFirestore(firebaseApp);

//Components
import { insertElementHTML, defaultEventsAfterSubmitFixedForm } from "../../js_common/commonFunctions.js";
//------------------------------------------------------------------------

let $alunoInfo = {
    cursos: {}
}
export function insertInfoAlunoHTML(RA) {
    insertElementHTML('#alunos_content',
        './components/alunos/infoAluno.html', () => { eventsInfoAluno(RA) }, null, true
    );
}

function getInfoAlunoDB(RA) {
    getDoc(doc(db, 'alunato', RA))
        .then((res) => {
            $alunoInfo.aluno = res.data().aluno;
        }).then(() => {
            let cursos = getCursosInfoAlunoDB(RA);
            return cursos;
        }).then((cursos) => {
            insertAlunoInfo();
            insertAlunoCursoInfo(cursos);

        }).then(() => {
        })
}
function getCursosInfoAlunoDB(RA) {
    let cursos = getDocs(collection(db, 'alunato', RA, 'cursos'))
        .then((res) => {
            res.forEach((item) => {
                let nomeCurso = item.data().curso_info.nome;
                $alunoInfo.cursos[nomeCurso] = item.data();
            })
            return res;
        })
    return cursos;

}

function eventsInfoAluno(RA) {
    getInfoAlunoDB(RA)
}

function insertAlunoInfo() {
    document.querySelector('#aluno_nome').value = $alunoInfo.aluno.nome;
    document.querySelector('#aluno_genero').value = $alunoInfo.aluno.genero;
    document.querySelector('#aluno_end').value = $alunoInfo.aluno.end;
    document.querySelector('#aluno_end_numero').value = $alunoInfo.aluno.end_numero;
    document.querySelector('#aluno_bairro').value = $alunoInfo.aluno.bairro;
    document.querySelector('#aluno_cep').value = $alunoInfo.aluno.cep;
    document.querySelector('#aluno_rg').value = $alunoInfo.aluno.rg;
    document.querySelector('#aluno_cel').value = $alunoInfo.aluno.cel;
    document.querySelector('#aluno_tel').value = $alunoInfo.aluno.tel;
    console.log($alunoInfo);

}
function insertAlunoCursoInfo(cursos) {

    cursos.forEach((item) => {
        let curso = item.data();
        let bg_curso = createCursoCotentHTML(curso);
        document.querySelector("#form_info_aluno").appendChild(bg_curso);
    })


}

function createTableParcelasTable(parcelas){
    let tableParcelas = document.createElement('table');
    tableParcelas.className='table_parcelas';
    tableParcelas.innerHTML = `
    <thead>
        <th>Parcela</th>
        <th>Nº Lanc.</th>
        <th>Valor</th>
        <th>Desconto</th>
        <th>Valor Total</th>
        <th>Vencimento</th>
        <th>Status</th>
        <th>Pago em:</th>
        <th>Form. Pag:</th>
        <th>Obs:</th>
    </thead>
    <tbody>
    </tbody>
    `
    let arr = [];
    for(let p of Object.entries(parcelas)){
        arr.push(p);
    }
    let arrOrdered = arr.sort();
let i = 1; 
    arrOrdered.forEach((item)=>{
        let tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${item[0]}</td>
        <td>${item[1].n_lanc}</td>
        <td>${item[1].valor}</td>
        <td>${item[1].desconto}</td>
        <td>${item[1].valor_total}</td>
        <td>${item[1].vencimento}</td>
        <td>${item[1].pagamento.status}</td>
        <td>${item[1].pagamento.pago_em}</td>
        <td>${item[1].pagamento.form_pag}</td>
        <td>${item[1].pagamento.obs}</td>
        `
        i++;
      tableParcelas.querySelector('tbody').appendChild(tr);
    })
    console.log(tableParcelas);

    return tableParcelas;
    
}

function createCursoCotentHTML(curso) {
    console.log(curso);
   
    let bg_curso = document.createElement('div');
    bg_curso.className = 'bg_curso';
    bg_curso.innerHTML =
        `
        <h4>${curso.curso_info.nome}</h4>
        <div class='fieldset'>
            <legend>Curso Info.</legend>
            <div class='div_input_info'>
                <label>ID Contrato: </label>
                <input id='id_contrato' readonly type='text' value="${curso.curso_info.id_contrato}"/>
            </div>
            <div class='div_input_info'>
                <label>Data Contrato: </label>
                <input id='data_contrato'  type='text' readonly='true' value="${curso.curso_info.data_contrato}"/>
            </div>
            <div class='row'>
                <div class='div_input_info'>
                    <label>Data Início:</label>
                    <input id='data_inicio'type='text' readonly='true' value="${curso.curso_info.inicio}"/>
                </div>
                <div class='div_input_info'>
                    <label>Total de Parcelas:</label>
                    <input id='parcelas_total' type='text' readonly='true' value="${curso.curso_info.parcelas_total}"/>
                </div>
              
                <div class='div_input_info'>
                <label>Vencimento:</label>
                <input id='vencimento' type='text' readonly='true' value="${curso.curso_info.vencimento}"/>
                </div>
            </div><!--roe-->
            <div class='row'>
                <div id='div_valor'>
                    <label>Valor mês:</label>
                    <input id='valor_mes' type='text' readonly='true' value="${curso.curso_info.valor_mes}"/>
                </div>
                <div id='div_desconto'>
                        <label>Desconto mês:</label>
                        <input id='desconto_mes' type='text' readonly='true' value="${curso.curso_info.desconto_mes}"/>
                </div>
                 <div id='div_valor_total'>
                    <label>V. total mês:</label>
                    <input id='valor_total_mes' type='text' readonly='true' value="${curso.curso_info.valor_total_mes}"/>
                </div>
            </div><!--row-->
        
            <div class='div_input_info' id='div_desconto_combo'>
                <label>Desconto Combo:</label>
                <div id='curso_combo_value'>${curso.curso_info.desconto_combo}</div>
            </div>
            <div class='div_input_info' id='div_modulos' >
                <label>Módulos:</label>
                <textarea  id='modulos' readonly='true'>${curso.curso_info.modulos}</textarea>
            </div>
            <div class='div_input_info' id='div_curso_obs'>
                <label>Obs.:</label>
                <textarea id='curso_obs' readonly='true' >${curso.curso_info.obs}</textarea>
            </div>
            <div class='bg_table'>
              ${(createTableParcelasTable(curso.curso_info.parcelas)).outerHTML}
            </div>
        </div> <!--fieldset-->
        <div class='fieldset'>
            <legend>Responsável Info.</legend>
            <div class='div_input_info'>
                <label>Responsável: </label>
                <input id='resp_nome' type='text' readonly="true" value="${curso.resp_info.nome}"/>
                <label>Genero: </label>
                <input id='resp_genero'type='text' readonly="true" value="${curso.resp_info.genero}"/>
            </div>
            <div  class='div_input_info'>
                <label>Endereço: </label>
                <input id='resp_end' type='text' readonly="true" value="${curso.resp_info.end}"/>
                <label>Nº: </label>
                <input id='resp_end_numero' type='text' readonly="true" value="${curso.resp_info.end_numero}"/>
            </div>
            <div class='div_input_info'>
                <label>Bairro</label>
                <input id='resp_bairro' type='text' readonly="true" value="${curso.resp_info.bairro}"/>
            </div>
            <div class='div_input_info'>
                <label>CEP</label>
                <input id='resp_cep'  type='text' readonly="true" value="${curso.resp_info.cep}"/>
            </div>
            <div class='div_input_info'>
                <label>CPF</label>
                <input id='resp_cpf'  type='text' readonly="true" value="${curso.resp_info.cep}"/>
            </div>
            <div class='div_input_info'>
                <label>RG</label>
                <input id='resp_rg'  type='text' readonly="true" value="${curso.resp_info.cep}"/>
            </div>
            <div class='div_input_info'>
                <label>Email</label>
                <input id='resp_email'  type='text' readonly="true" value="${curso.resp_info.cep}"/>
            </div>
            <div class='div_input_info'>
                <label>Email</label>
                <input id='resp_email'  type='text' readonly="true" value="${curso.resp_info.cep}"/>
            </div>
            <div class='div_input_info'>
                <label>Cel.:</label>
                <input id='resp_cel'  type='text' readonly="true" value="${curso.resp_info.cel}"/>
            </div>
            <div class='div_input_info'>
                <label>Tel.:</label>
                <input id='resp_tel'  type='text' readonly="true" value="${curso.resp_info.tel}"/>
            </div>
        </div><!--fieldset-->
    `;
    return bg_curso;
}