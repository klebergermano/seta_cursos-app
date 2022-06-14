//Electron
const { ipcRenderer } = require("electron");
//---------------------------------------------------------------//
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, setDoc, getDocs, collection, getDoc, doc } = require("firebase/firestore");
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import insertElementHTML from "../../jsCommon/insertElementHTML.js";
import { displaySpinnerLoad, removeSpinnerLoad } from "../../jsCommon/spinnerJS.js";
import { addLogInfo } from "../../logData/js/logFunctions.js";
import { insertFormAddCertificadoHTML } from "./formAddCertificado.js";
//---------------------------------------------------------------//
//Other libraries
const VMasker = require("vanilla-masker");
//---------------------------------------------------------------//

// Função principal de inserção da página html.
export function insertInfoAlunoHTML(RA) {
    insertElementHTML('#alunos_content',
        './components/alunos/infoAluno.html', () => { eventsInfoAluno(RA) }, null, true
    );
}

// Carrega os eventos  do infoAluno.js
function eventsInfoAluno(RA) {
    getAlunoCompleteInfo(RA)
        .then((alunoCompleteInfo) => {
            // insere as informações do aluno no formulário de aluno.
            insertAlunoInfo(alunoCompleteInfo);
            // Insere os cursos que o aluno faz em formato de formulário na página.
            insertAlunoCursoInfo(alunoCompleteInfo);
            return alunoCompleteInfo;
        }).then((alunoCompleteInfo) => {
            //--------------------------
            // Eventos dos formulários.
            //--------------------------
            // Cria o evento de click para os botões que abrem o formulário de salvar o certificado do curso.
            eventsBtnsCreateCertificado();
            // Cria o evento de click para os títulos do cursos.
            eventsTitleInfoCusos();
            // Cria os eventos de click para salvar o PDF do talão de pagamento.
            eventsBtnsSalvarTaloesPDF(alunoCompleteInfo)
            // Cria o evento de input no campos de formulário do aluno. 
            eventsFields();
            // Aplica as mascaras de input do formulário do aluno.
            setMasksFormAluno();
            // Eventos de submição dos formulário dos Cursos.
            eventsSubmitFormsInfoCurso();
            // Evento de envio do formulário para atualização das informações do aluno.
            eventSubmitFormAlunoInfo();
        }).catch((error) => console.log(error));
}

// Retorna um objecto com os cursos que o aluno faz.
async function getCursosInfoObj(RA) {
    let cursos = getDocs(collection(db, 'alunato', RA, 'cursos'))
        .then(async (res) => {
            let cursosInfoObj = {};
            res.forEach((item) => {
                let nomeCurso = item.data().curso_info.nome;
                cursosInfoObj[nomeCurso] = item.data();
            })
            return cursosInfoObj;
        }).catch((error) => { console.log(error) })
    return cursos;
}
// Retorna um objeto com todas as informações do aluno, incluindo os cursos que faz.
async function getAlunoCompleteInfo(RA) {
    let alunoCompleteInfo = {};
    let alunoBasicInfo = getAlunoBasicInfo(RA);
    let cursosInfoObj = getCursosInfoObj(RA);
    //cria o objeto aluno dentro do alunoCompleteInfo.
    alunoCompleteInfo = await alunoBasicInfo;
    //cria o objeto cursos dentro do alunoCompleteInfo.
    alunoCompleteInfo.cursos = await cursosInfoObj;
    return alunoCompleteInfo;
}

// Retorna as informações de cadastro do aluno como: RA, nome, endereço, etc.
async function getAlunoBasicInfo(RA) {
    let alunoInfo = getDoc(doc(db, 'alunato', RA))
        .then(async (res) => {
            let alunoObj = {};
            alunoObj = res.data();
            return alunoObj;
        }).catch((error)=> console.log(error));
    return alunoInfo;
}

// Cria o evento de click para os botões que abrem o formulário de salvar o certificado do curso.
function eventsBtnsCreateCertificado() {
    let btns = document.querySelectorAll('.btn_create_certificado');
    btns.forEach((item) => {
        item.addEventListener('click', (e) => {
            //Insere o formulário de certificado.
            insertFormAddCertificadoHTML(getCertificadoInfo(e));
        })
    });
}

// Cria o evento de click para os títulos do cursos.
function eventsTitleInfoCusos() {
    // Adiciona o evento de expandir o formulário ".aluno_info_info".
    document.querySelectorAll('.title_info_cursos').forEach((item) => {
        item.addEventListener('click', (e) => {
            //Mostra e oculta as informações do curso alternando a cada execução.
            showAndHideFormInfoCurso(e);
        })
    })
}

// Cria o evento de input no campos de formulário do aluno. 
function eventsFields() {
    let inputs = document.querySelectorAll('#form_info_aluno input, #form_info_aluno textarea, .form_info_curso input, .form_info_curso textarea');
    inputs.forEach((item) => {
        item.addEventListener('input', (e) => {
            // Habilita o botão de submissão do formulário.
            activeSubmitOnChangeInput(e);
        });
    })
}

// Seta mascaras dos campos do Responsável de cada curso.
function setMasksFormRespCursos(form) {
    VMasker(form.querySelector("#resp_cep")).maskPattern("99999-999");
    VMasker(form.querySelector("#resp_cpf")).maskPattern("999.999.999-99");
    VMasker(form.querySelector("#resp_rg")).maskPattern("99.999.999-S");
}

// Aplica as mascaras de input do formulário do aluno.
function setMasksFormAluno() {
    VMasker(document.querySelector("#form_info_aluno #aluno_rg")).maskPattern("99.999.999-S");
    VMasker(document.querySelector("#form_info_aluno #aluno_cep")).maskPattern("99999-999");
}

// Insere os cursos que o aluno faz na página.
function insertAlunoCursoInfo(alunoCompleteInfo) {
    let RA = alunoCompleteInfo.aluno.ra;
    let cursos = alunoCompleteInfo.cursos;
    for (const [key, value] of Object.entries(cursos)) {
        let formCurso = createCursoCotentHTML(RA, value);
        document.querySelector("#bg_info_aluno").appendChild(formCurso);
        let checkboxCertificado = formCurso.querySelector("#checkbox_certificado_entregue");
        setBtnCheckboxCertificado(checkboxCertificado);
    }
}

//Mostra e oculta as informações do curso alternando a cada execução.
function showAndHideFormInfoCurso(e) {
    let parentFormInfoCurso = e.target.closest('form');
    parentFormInfoCurso.classList.toggle('hide_form_info_curso');
}

//Habilita o botão de submissão do formulário.
function activeSubmitOnChangeInput(e) {
    let form = e.target.closest('form');
    let inputSubmit = form.querySelector('input[type="submit"]');
    inputSubmit.removeAttribute('disabled');
    inputSubmit.style.opacity = '1';
}

// Insere as informações do aluno nos inputs da página.
function insertAlunoInfo(alunoInfo) {
    document.querySelector('#aluno_ra').value = alunoInfo.aluno.ra;
    document.querySelector('#aluno_nome').value = alunoInfo.aluno.nome;
    document.querySelector('#aluno_genero').value = alunoInfo.aluno.genero;
    document.querySelector('#aluno_end').value = alunoInfo.aluno.end;
    document.querySelector('#aluno_end_numero').value = alunoInfo.aluno.end_numero;
    document.querySelector('#aluno_bairro').value = alunoInfo.aluno.bairro;
    document.querySelector('#aluno_cep').value = alunoInfo.aluno.cep;
    document.querySelector('#aluno_data_nasc').value = alunoInfo.aluno.data_nasc;
    document.querySelector('#aluno_email').value = alunoInfo.aluno.email;
    document.querySelector('#aluno_rg').value = alunoInfo.aluno.rg;
    document.querySelector('#aluno_cel').value = alunoInfo.aluno.cel;
    document.querySelector('#aluno_tel').value = alunoInfo.aluno.tel;
    document.querySelector('#aluno_obs').value = alunoInfo.aluno.obs;
}

//--------------------------------------------------------------------------------------------------
//------------------------------------------SUBMISSÃO-----------------------------------------------
//--------------------------------------------------------------------------------------------------


// Eventos de submição dos formulário dos Cursos.
function eventsSubmitFormsInfoCurso() {
    let formsInfo = document.querySelectorAll('.form_info_curso');
    formsInfo.forEach((form) => {
        //Seta mascaras dos campos do Responsável de cada curso.
        setMasksFormRespCursos(form);
        //Adiciona o event de submição de formulário de cada curso.
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            submitFormsInfoCurso(e)
        });
        form.querySelector("#checkbox_certificado_entregue")?.addEventListener('input', (e) => {
            setBtnCheckboxCertificado(e.target);
        });
    })
}

// Evento de envio do formulário para atualização das informações do aluno.
function eventSubmitFormAlunoInfo() {
    document.querySelector('#form_info_aluno').addEventListener('submit', (e) => {
        e.preventDefault();
        submitFormInfoAluno(e);
    })
}

// Confere se o valor do checkbox do certificado esta marcado. 
   function verificaCheckboxCertificado(){
    let checkboxCertificadoEntregue = form.querySelector("#checkbox_certificado_entregue");
      let valueCerticadoEntregue = "";
      if (checkboxCertificadoEntregue.checked) {
          valueCerticadoEntregue = "sim";
      }
      return valueCerticadoEntregue;
  }

// Submit das informações do curso.
function submitFormsInfoCurso(e) {
    let form = e.target;
    let RA = form.aluno_ra.value;
    let curso = form.curso_nome.value;

    // Confere se o valor do checkbox do certificado esta marcado. 
    let valueCerticadoEntregue = verificaCheckboxCertificado();
    setDoc(doc(db, "alunato", RA, 'cursos', curso),
        {
            curso_info: {
                certificado: {
                    entregue: valueCerticadoEntregue
                },
                obs: (form.curso_obs.value).trim()
            },
            resp_info: {
                email: (form.resp_email.value).trim(),
                end: (form.resp_end.value).trim(),
                end_numero: (form.resp_end_numero.value).trim(),
                bairro: (form.resp_bairro.value).trim(),
                cep: (form.resp_cep.value).trim(),
                cpf: (form.resp_cpf.value).trim(),
                data_nasc: (form.resp_data_nasc.value).trim(),
                cel: (form.resp_cel.value).trim(),
                tel: (form.resp_tel.value).trim(),
            },
            metadata: {
                modified: new Date()
            },
        }, { merge: true }
    ).then(() => {
        let inputSubmit = form.querySelector('input[type="submit"]');
        inputSubmit.setAttribute('disabled', true);
        inputSubmit.style.opacity = '0.5';
    }).then(() => {
        addLogInfo('log_alunato', 'update', RA);
    }).catch((error) => {
        addLogInfo('log_alunato', 'error', RA, error);
    })
}

// Submit do formulário de aluno.
function submitFormInfoAluno(e) {
    let form = e.target;
    let RA = form.aluno_ra.value;
    setDoc(doc(db, "alunato", RA),
        {
            aluno: {
                email: (form.aluno_email.value).trim(),
                end: (form.aluno_end.value).trim(),
                end_numero: (form.aluno_end_numero.value).trim(),
                bairro: (form.aluno_bairro.value).trim(),
                cep: (form.aluno_cep.value).trim(),
                data_nasc: (form.aluno_data_nasc.value).trim(),
                cel: (form.aluno_cel.value).trim(),
                tel: (form.aluno_tel.value).trim(),
                obs: (form.aluno_obs.value).trim(),
                metadata: {
                    modified: new Date()
                }
            },
        }, { merge: true }
    ).then(() => {
        let inputSubmit = form.querySelector('input[type="submit"]');
        inputSubmit.setAttribute('disabled', true);
        inputSubmit.style.opacity = '0.5';
    }).then(() => {
        addLogInfo('log_alunato', 'update', RA);
    }).catch((error) => {
        addLogInfo('log_alunato', 'error', RA, error);

    })
}


//--------------------------------------------------------------------------------------------------
// ------------------------------------- CERTIFICADO -----------------------------------------------
//--------------------------------------------------------------------------------------------------

// Pega as informações para o certificado do formulário retornando um objeto.
function getCertificadoInfo(e) {
    let certificadoInfo = {};
    let formInfo = e.target.closest('.form_info_curso');
    certificadoInfo.aluno = document.querySelector("#aluno_nome").value;
    certificadoInfo.ra = document.querySelector("#aluno_ra").value;
    certificadoInfo.curso_cod = formInfo.querySelector("#curso_cod").value;
    certificadoInfo.curso = formInfo.dataset.curso_nome;
    certificadoInfo.inicio = formInfo.querySelector("#data_inicio").value;
    certificadoInfo.horas_aula = formInfo.querySelector("#horas_aula").value;
    certificadoInfo.carga_horaria = formInfo.querySelector("#carga_horaria").value;
    certificadoInfo.modulos = formInfo.querySelector("#modulos").value;
    return certificadoInfo;
}
// ******
function setBtnCheckboxCertificado(input) {
    let labelCheckbox = input?.closest("#label_checkbox_certificado_entregue");
    if (input) {
        if (input?.checked) {
            labelCheckbox.classList.add("active");
            labelCheckbox.querySelector('span').innerHTML = 'Certificado Entregue &#10003';
        } else {
            labelCheckbox.classList.remove("active");
            labelCheckbox.querySelector('span').innerHTML = 'Marcar Certificado Entregue';
        }
    }
}


//--------------------------------------------------------------------------------------------------
// ------------------------------------- TALÕES ----------------------------------------------------
//--------------------------------------------------------------------------------------------------
// Cria os eventos de click para salvar o PDF do talão de pagamento.
function eventsBtnsSalvarTaloesPDF(alunoCompleteInfo) {
    let btns = document.querySelectorAll('.btn_create_talao');
    btns.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            let cursoNome = e.target.closest('table').dataset.curso_nome;
            // Cria a informação do Talão.
            let talaoInfo = createInfoTalao(cursoNome, alunoCompleteInfo);
            // Faz o submit do talão.
            submitTalaoPDF(talaoInfo);
        })
    });
}

// Cria a informação do talão 
function createInfoTalao(cursoNome, alunoCompleteInfo) {
    let talaoInfo = [];
    let alunoNome = alunoCompleteInfo.aluno.nome;
    let RA = alunoCompleteInfo.aluno.ra;
    let respNome = alunoCompleteInfo.cursos[cursoNome].resp_info.nome;
    let parcelas_total = alunoCompleteInfo.cursos[cursoNome].curso_info.parcelas_total;
    let parcelas = alunoCompleteInfo.cursos[cursoNome].curso_info.parcelas;
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
    return talaoInfo;
}
// Faz a submissão do formulário para gerar o talão pdf.
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
        removeSpinnerLoad("#page_content");
    }).catch((error) => {
            console.log(error)
            addLogInfo('log_alunato', 'error', talaoInfo.RA, error);
    });
}

//Cria a tabela de parcelas do formulário.
function createTableParcelasTable(parcelas, cursoNome) {
    let tableParcelas = document.createElement('table');
    tableParcelas.className = 'table_parcelas';
    tableParcelas.setAttribute('data-curso_nome', cursoNome);
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

//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------------------
//--------------------------------------------- Conteúdo do Curso HTML ---------------------------------------------
//------------------------------------------------------------------------------------------------------------------


// Cria o conteúdo para ser inserido no fielset do certificado HTML.
function createCertificadoContentHTML(curso) {
    let certificadoEntregue = curso.curso_info?.certificado?.entregue;
    let certificadoHTML = ``;
    let valueCheckboxCertificado;
    if (certificadoEntregue === "sim") {
        valueCheckboxCertificado = "checked='true'";
    }
    if (curso.curso_info.certificado) {
        certificadoHTML = `
            <label id='label_checkbox_certificado_entregue' for='checkbox_certificado_entregue'><span>Marcar Certificado Entregue</span> 
            <input id='checkbox_certificado_entregue' ${valueCheckboxCertificado} type='checkbox' "/>
            </label>
            <div>
            <label>Emissão</label>
            <input type='date' value="${curso.curso_info.certificado.data_emissao}"/>
            <label>Cod</label>
            <input type='text' value="${curso.curso_info.certificado.cod}" />
            </div>
            <div>
            <label>Obs</label>
            <textarea>${curso.curso_info.certificado.obs}</textarea>
            </div>`;
    }
    return certificadoHTML;
}
// Cria o filedset do responsável para inserção HTML.
function createResponsavelFieldsetHTML(curso) {
    let respFieldsetHTML = `
    <div class='fieldset fieldset_resp_info'>
        <legend>Responsável Info.</legend>
        <div class='div_input_info'>
            <label>Responsável: </label>
            <input id='resp_nome' type='text' readonly="true" value="${curso.resp_info.nome}"/>
            <label>Genero: </label>
            <input id='resp_genero'type='text' readonly="true" value="${curso.resp_info.genero}"/>
        </div>
        <div  class='div_input_info'>
            <label>Endereço: </label>
            <input id='resp_end' type='text'  value="${curso.resp_info.end}"/>
            <label>Nº: </label>
            <input id='resp_end_numero' type='text'  value="${curso.resp_info.end_numero}"/>
        </div>
        <div class='div_input_info'>
            <label>Bairro</label>
            <input id='resp_bairro' type='text'  value="${curso.resp_info.bairro}"/>
        </div>
        <div class='div_input_info'>
            <label>CEP</label>
            <input id='resp_cep'  class='resp_cep' type='text'  value="${curso.resp_info.cep}"/>
        </div>
        <div class='div_input_info'>
            <label>CPF</label>
            <input id='resp_cpf' class='resp_cpf' type='text' readonly="true" value="${curso.resp_info.cpf}"/>
        </div>
        <div class='div_input_info'>
            <label>RG</label>
            <input id='resp_rg' class='resp_rg' type='text' readonly="true" value="${curso.resp_info.rg}"/>
        </div>
        <div class='div_input_info'>
            <label>Data Nasc.</label>
            <input id='resp_data_nasc'  type='date'  value="${curso.resp_info.data_nasc}"/>
        </div>
        <div class='div_input_info'>
            <label>Email</label>
            <input id='resp_email'  type='text'  value="${curso.resp_info.email}"/>
        </div>
        <div class='div_input_info'>
            <label>Cel.:</label>
            <input id='resp_cel'  type='text'  value="${curso.resp_info.cel}"/>
        </div>
        <div class='div_input_info'>
            <label>Tel.:</label>
            <input id='resp_tel'  type='text'  value="${curso.resp_info.tel}"/>
        </div>
    </div><!--fieldset-->
    `;
    return respFieldsetHTML;
}
// Cria o filedset do responsável para inserção HTML.
function createCertificadoStatusFieldsetHTML(curso) {
    //Cria o html do certificado.
    let certificadoContentHTML = createCertificadoContentHTML(curso);
    let certificadoFieldsetHTML = `
        <div class='fieldset fieldset_certificado_status'>
        <legend>Certificado Status</legend>
        <button class='btn_create_certificado'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-heading" viewBox="0 0 16 16">
                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                <path d="M3 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-1z"/>
            </svg> 
            Salvar Certificado PDF
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-pdf" viewBox="0 0 16 16">
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                <path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.266.266 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.71 12.71 0 0 1 1.01-.193 11.744 11.744 0 0 1-.51-.858 20.801 20.801 0 0 1-.5 1.05zm2.446.45c.15.163.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.876 3.876 0 0 0-.612-.053zM8.078 7.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z"/>
            </svg>
         </button>
        ${certificadoContentHTML}
         </div>
        `;
    return certificadoFieldsetHTML;
}

function createCursoFieldsetHTML(curso) {
    // Parcelas de pagamento do curso em formato de tabela.
    let tableParcelas = (createTableParcelasTable(curso.curso_info.parcelas, curso.curso_info.nome)).outerHTML;
    let cursoFieldsetHTML = `
    <div class='fieldset fieldset_curso_info'>
        <legend>Curso Info.</legend>
        <div class='div_input_info'>
            <label>ID Contrato: </label>
            <input id='id_contrato' readonly="true" type='text' value="${curso.curso_info.id_contrato}"/>
        </div>
        <div class='div_input_info'>
            <label>Data Contrato: </label>
            <input id='data_contrato'  type='text' readonly='true' value="${curso.curso_info.data_contrato}"/>
        </div>
        <div class='div_input_info'>
            <label>Curso Cod.: </label>
            <input id='curso_cod'  type='text' readonly='true' value="${curso.curso_info.cod}"/>
        </div>
        <div class='row'>
            <div class='div_input_info'>
                <label>Data Início:</label>
                <input id='data_inicio'type='text' readonly='true' value="${curso.curso_info.inicio}"/>
            </div>
            <div class='div_input_info'>
            <label>Vencimento:</label>
            <input id='vencimento' type='text' readonly='true' value="${curso.curso_info.vencimento}"/>
            </div>
            <div class='div_input_info'>
            <label>Hr. Aula:</label>
            <input id='horas_aula' type='text' readonly='true' value="${curso.curso_info.horas_aula}"/>
            </div>
            <div class='div_input_info'>
            <label>C. Horaria:</label>
            <input id='carga_horaria' type='text' readonly='true' value="${curso.curso_info.carga_horaria}"/>
            </div>
        </div><!--row-->
        <div class='row'>
            <div class='div_input_info'>
                <label>T. Parcelas:</label>
                <input id='parcelas_total' type='text' readonly='true' value="${curso.curso_info.parcelas_total}"/>
            </div> 
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
            <textarea id='curso_obs' >${curso.curso_info.obs}</textarea>
        </div>
        <div class='bg_table'>
            <!-- Tabela de pagamento das parcelas do curso -->
            ${tableParcelas}
        </div>
    </div> <!--fieldset-->
    `;

    return cursoFieldsetHTML;
}

function createStatusFieldsetHTML() {
    let statusFieldsetHTML = `
    <div class='fieldset fieldset_curso_status curso_ativo'>
    <div class='div_select_curso_status'>
        <label>Status:</label>
        <select>
            <option value='ativo'>Ativo</option>
            <option value='pausado'>Pausado</option>
            <option value='cancelado'>Cancelado</option>
            <option value='concluido'>Concluido</option>
        </select>
    </div>
    <div class='div_data_status'>
            <label>Data:</label>
            <input type='date' id='data_status'/>
        </div>
        <div class='div_obs_status'>
        <label>Obs.:</label>
        <textarea id='obg_status'></textarea>
    </div>
</div><!--fieldset-->
    `;

    return statusFieldsetHTML;
}
// Cria o conteúdo com as informações do curso em formulário para ser inserido na página.
function createCursoCotentHTML(RA, curso) {
    // Fieldset do Status do curso em HTML.
    let statusFieldsetHTML = createStatusFieldsetHTML();
    // Fieldset do Certificado do curso em HTML.
    let certificadoFieldsetHTML = createCertificadoStatusFieldsetHTML(curso);
    // Filedset do responsável pelo curso. 
    let respFieldsetHTML = createResponsavelFieldsetHTML(curso);
    // Filedset do curso.
    let cursoFieldsetHTML = createCursoFieldsetHTML(curso);

    //Cria o elemento formulário do curso.
    let form = document.createElement('form');
        form.classList = `form_info_curso hide_form_info_curso  border_${curso.curso_info.nome}`;
        form.setAttribute('data-curso_nome', curso.curso_info.nome);
        form.setAttribute('data-curso_cod', curso.curso_info.cod);

    let bg_curso = document.createElement('div');
        bg_curso.className = `bg_curso`;
    let icon_title = `<svg class='arrow_down' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                      </svg>`
    bg_curso.innerHTML =
        `
        <input id='aluno_ra' readonly="true" type='hidden' value="${RA}"/>
        <input id='curso_nome' readonly="true" type='hidden' value="${curso.curso_info.nome}"/>
        <h4 class='title_info_cursos background_${curso.curso_info.nome}'>${curso.curso_info.nome}  ${icon_title} <span class='title_status'>ATIVO</span> </h4>
        
        <!----Status fieldset----->
         ${statusFieldsetHTML}
        <!------------------------>
       
        <!--Certificado fieldset-->
         ${certificadoFieldsetHTML}
        <!------------------------>
        
        <!-----Curso filedset----->
         ${cursoFieldsetHTML}
        <!------------------------>

        <!--Responsável fieldset-->
         ${respFieldsetHTML}
        <!------------------------>


        <input disabled='true' type='submit' value='Salvar Edições'>
    `;
    form.appendChild(bg_curso);
    return form;
}
