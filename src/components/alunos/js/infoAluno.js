
const { ipcRenderer } = require("electron");

//firestore
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, getDocs, collection, getDoc, doc } = require("firebase/firestore");
const db = getFirestore(firebaseApp);

//Components
import { insertElementHTML, displaySpinnerLoad, removeSpinnerLoad} from "../../js_common/commonFunctions.js";
//------------------------------------------------------------------------

let $alunoInfo = {
    cursos: {}
}
export function insertInfoAlunoHTML(RA) {
    insertElementHTML('#alunos_content',
        './components/alunos/infoAluno.html', () => { eventsInfoAluno(RA) }, null, true
    );
}

function eventsInfoAluno(RA) {
    document.querySelector('#form_info_aluno').addEventListener('submit', (e) => {
        e.preventDefault();
    })
    getInfoAlunoDB(RA)
        .then((alunoInfo) => {
            let btns = document.querySelectorAll('.btn_create_talao');
            btns.forEach((item) => {
                item.addEventListener('click', (e) => {
                    let cursoNome = e.target.closest('table').dataset.curso_nome;
                  let talaoInfo = createInfoTalao(cursoNome);
                   submitTalaoPDF(talaoInfo);

                })
            });
        })
}


async function getInfoAlunoDB(RA) {
    let alunoInfo = getDoc(doc(db, 'alunato', RA))
        .then((res) => {
            $alunoInfo.aluno = res.data().aluno;
            return res.data();
        }).then(async (res) => {
            insertAlunoInfo(res);
            let cursos = await getCursosInfoAlunoDB(RA)
            insertAlunoCursoInfo(cursos);
        }).then(()=>{
        return $alunoInfo;
        })
    return alunoInfo;
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

function insertAlunoInfo(alunoInfo) {
    document.querySelector('#aluno_nome').value = alunoInfo.aluno.nome;
    document.querySelector('#aluno_genero').value = alunoInfo.aluno.genero;
    document.querySelector('#aluno_end').value = alunoInfo.aluno.end;
    document.querySelector('#aluno_end_numero').value = alunoInfo.aluno.end_numero;
    document.querySelector('#aluno_bairro').value = alunoInfo.aluno.bairro;
    document.querySelector('#aluno_cep').value = alunoInfo.aluno.cep;
    document.querySelector('#aluno_rg').value = alunoInfo.aluno.rg;
    document.querySelector('#aluno_cel').value = alunoInfo.aluno.cel;
    document.querySelector('#aluno_tel').value = alunoInfo.aluno.tel;

}
function insertAlunoCursoInfo(cursos) {

    cursos.forEach((item) => {
        let curso = item.data();
        let bg_curso = createCursoCotentHTML(curso);
        document.querySelector("#form_info_aluno").appendChild(bg_curso);
    })


}

function createTableParcelasTable(parcelas, cursoNome) {
    let tableParcelas = document.createElement('table');
    tableParcelas.className = 'table_parcelas';
    tableParcelas.setAttribute('data-curso_nome', cursoNome)
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
    for (let p of Object.entries(parcelas)) {
        arr.push(p);
    }
    let arrOrdered = arr.sort();
    arrOrdered.forEach((item) => {
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
        tableParcelas.querySelector('tbody').appendChild(tr);
    })

    let trBtnTalao = document.createElement('tr');
    trBtnTalao.className = 'tr_btn_talao';
    trBtnTalao.innerHTML =
        `<td colspan='10'>
        <button class='btn_create_talao'>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-pdf" viewBox="0 0 16 16">
        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
        <path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.266.266 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.71 12.71 0 0 1 1.01-.193 11.744 11.744 0 0 1-.51-.858 20.801 20.801 0 0 1-.5 1.05zm2.446.45c.15.163.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.876 3.876 0 0 0-.612-.053zM8.078 7.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z"/>
         </svg>
        Salvar Talão PDF</button>
    </td>
    `;
    tableParcelas.querySelector('tbody').appendChild(trBtnTalao);

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
              ${(createTableParcelasTable(curso.curso_info.parcelas, curso.curso_info.nome)).outerHTML}
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

function submitTalaoPDF(talaoInfo) {
    displaySpinnerLoad("#page_content", true);
    let result = new Promise((resolve, reject) => {
        let res = ipcRenderer.invoke("createTalaoPDF", talaoInfo);
        if (res) {
            resolve(res);
        } else {
            reject();
        }
    });
    result.then(() => {
        //loadinContrato.style.display = "none";
        removeSpinnerLoad("#page_content");
    });
}


function createInfoTalao(cursoNome) {
    let talaoInfo = []; 
    let alunoNome = $alunoInfo.aluno.nome;
    let RA = $alunoInfo.aluno.ra;
    let respNome = $alunoInfo.cursos[cursoNome].resp_info.nome;
    let parcelas_total = $alunoInfo.cursos[cursoNome].curso_info.parcelas_total;
    let parcelas =  $alunoInfo.cursos[cursoNome].curso_info.parcelas;
   
   let arr = [];
   for (let p of Object.entries(parcelas)) {
       arr.push(p);
   }

   let parcelasOrdered = arr.sort();
   parcelasOrdered.forEach((item) => {
       item[1].num_parcela = item[0];
       item[1].responsavel = respNome;
       item[1].aluno = alunoNome;
       item[1].ra = RA;
       item[1].curso = cursoNome;
       item[1].parcelas_total = parcelas_total;
     let folha = item[1]; 
     talaoInfo.push(folha); 
     
   });

 console.log('ti:', talaoInfo);
    return talaoInfo;
    
}
