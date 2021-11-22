
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

function createCursoCotentHTML(curso) {
    console.log(curso);
    let bg_curso = document.createElement('div');
    bg_curso.className = 'bg_curso';
    bg_curso.innerHTML = `
   
<h4>${curso.curso_info.nome}</h4>
<fieldset>
<legend>Curso Info.</legend>
<div class='div_input'>
 <label>ID Contrato: </label><input type='text' value="${curso.curso_info.id_contrato}"/>
 </div>
<div class='div_input'><label>Data Contrato: </label><input type='text' readonly='true' value="${curso.curso_info.data_contrato}"/></div>
<div class='div_input'><label>Data Início:</label><input type='text' readonly='true' value="${curso.curso_info.inicio}"/></div>
<div class='div_input'><label>Total de Parcelas:</label><input type='text' readonly='true' value="${curso.curso_info.parcelas_total}"/></div>
<div class='div_input'><label>Valor p/ mês:</label><input type='text' readonly='true' value="${curso.curso_info.valor_mes}"/></div>
<div class='div_input'><label>Desconto p/ mês:</label><input type='text' readonly='true' value="${curso.curso_info.desconto_mes}"/></div>
<div class='div_input'><label>Valor total mês:</label><input type='text' readonly='true' value="${curso.curso_info.valor_total_mes}"/></div>
<div class='div_input'><label>Vencimento:</label><input type='text' readonly='true' value="${curso.curso_info.vencimento}"/></div>

<div class='div_input' id='div_desconto_combo'>
 <label>Desconto Combo:</label><div>${curso.curso_info.desconto_combo}</div>
 </div>
<div class='div_input' id='div_modulos' ><label>Módulos:</label><textarea  readonly='true'>${curso.curso_info.modulos}</textarea></div>
<div class='div_input' id='div_curso_obs'><label>Obs.:</label><input type='text' readonly='true' value="${curso.curso_info.obs}"/></div>
</fieldset>
<fieldset>
<legend>Responsável Info.</legend>
<div class='div_input'><label>Responsável: </label><input type='text' readonly="true" value="${curso.resp_info.nome}"/></div>
    <label>Endereço: </label><input type='text' readonly="true" value="${curso.resp_info.end}"/>
    <label>Nº: </label><input type='text' readonly="true" value="${curso.resp_info.end_numero}"/>
</div>
<div class='div_input'><label>Bairro</label><input type='text' readonly="true" value="${curso.resp_info.bairro}"/></div>
<div class='div_input'><label>CEP</label><input type='text' readonly="true" value="${curso.resp_info.cep}"/></div>
</div>
</fieldset>
`;
    return bg_curso;
}