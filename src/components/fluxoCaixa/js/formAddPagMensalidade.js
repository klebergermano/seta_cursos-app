//Furebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js"
const { getFirestore, doc, setDoc, onSnapshot, collection, getDocs } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import { defaultEventsAfterSubmitFixedForm } from "../../jsCommon/formsFunc.js";
import insertElementHTML from "../../jsCommon/insertElementHTML.js";
import { setCurrentDate, converteMesNumeroPorExtenso } from "../../jsCommon/dateFunc.js";
import insertInputValorTotal from "../../contratos/js/insertInputValorTotal.js";
import { addLogInfo } from "../../logData/js/logFunctions.js";
//---------------------------------------------------------------//
//Others libraries
const VMasker = require("vanilla-masker");
//---------------------------------------------------------------//
//Funções do Componente
import createNewRowFluxoCaixa from "./createNewRowFluxoCaixa.js";
//---------------------------------------------------------------//
var $alunoInfo = {
  RA: '',
  nome: ''
};



async function createOptionsSelectAlunos() {
  let options = getDocs(collection(db, "alunato"))
    .then((snap) => {
      let arrRAList = [];
      let selectAluno = ``;
      snap.forEach((doc) => {
       
        arrRAList.push(doc.id);
        selectAluno += `<option  data-ra='${doc.id}' value='${doc.id}-${doc.data().aluno.nome}'/>`;
      });
      return selectAluno;
    })
  return options;
}


function setAlunoInvalido(){
  document.querySelector('#select_aluno_pag').setCustomValidity("Nome inválido");
  document.querySelector('#select_aluno_pag').classList.add('input_invalido');
  resetFieldsAfterSelectAlunoChange()
}

function setInfoAfterAlunoChange(e){
  if(validaSelectAlunoPag(e)){
  document.querySelector('#select_aluno_pag').setCustomValidity("");
  document.querySelector('#select_aluno_pag').classList.remove('input_invalido');
  document.querySelector('#select_curso').removeAttribute('disabled')

    setSelectCursos()

   }else{
    setAlunoInvalido()
    document.querySelector('#select_curso').innerHTML = ''; 
    document.querySelector('#select_curso').setAttribute('disabled', true)

   }
    //
    
}

function validaSelectAlunoPag(e) {
  let select_aluno = e.target;
  let datalist = document.querySelector('#alunos_pag_datalist');
  let datalistOpt = Array.from(datalist.options);
  let valorExisteNaLista = false;

  datalistOpt.forEach((option) => {
    if (select_aluno.value.trim() === option.value.trim()) {
      valorExisteNaLista = true;
    }
  });
return valorExisteNaLista; 

}
function resetFieldsAfterSelectAlunoChange() {
  document.querySelector('#select_parcelas').setAttribute('disabled', true)
  document.querySelector('#select_parcelas').innerHTML = ""
  document.querySelector('#n_lanc').value = ''
  document.querySelector('#resp').value = ''
  document.querySelector('#vencimento').value = ''
  document.querySelector('#data').value = ''
  document.querySelector('#curso_valor').value = ''
  document.querySelector('#curso_desconto').value = ''
  document.querySelector('#curso_valor_total').value = ''
  document.querySelector('#forma_pag').selectedIndex =  0;

}


function eventsFormPagMensalidade(){
  setMasks()
    createOptionsSelectAlunos()
    .then((options) => {
    let alunoDatalist = document.querySelector('#alunos_pag_datalist');
    alunoDatalist.innerHTML = options;
  });

    document.querySelector('#select_aluno_pag').addEventListener('input', (e) => {
      setInfoAfterAlunoChange(e)
    });
    document.querySelector('#select_curso').addEventListener('change', (e) => {
    getParcelas(e.target.value)
    document.querySelector('#select_parcelas').removeAttribute('disabled')
  });

  document.querySelector('#select_parcelas').addEventListener('change', (e) => {
    setValoresParcela()
  });
  document.querySelector('#curso_desconto').addEventListener('input', (e) => {
    insertInputValorTotal();
  });

  document.querySelector('#form_add_pag_mensalidade').addEventListener('submit', (e) => {
    e.preventDefault();
    submitFormAddPagMensalidade(e)
  });
}

function getValueFromMainSelectAluno() {
  let select = document.querySelector("#select_aluno_pag");
  return select.value;;
}


function setAlunoInfoRANome() {
  let valueMainSelect = getValueFromMainSelectAluno();
  let arrValue = valueMainSelect.split('-');
  $alunoInfo.RA = arrValue[0];
  $alunoInfo.nome = arrValue[1];
}

function setSelectCursos() {
  setAlunoInfoRANome()
  setNomeAndRAInput()
  let selectCurso = document.querySelector("#select_curso");
  let optionsCurso = '<option disabled selected value="">Selecione o Curso</option>';
  getDocs(collection(db, 'alunato', $alunoInfo.RA, 'cursos'))
    .then((res) => {
      let cursos = {};
      res.forEach((doc) => {
        cursos[doc.data().curso_info.nome] = doc.data().curso_info;
        cursos[doc.data().curso_info.nome]['resp'] = doc.data().resp_info;
        $alunoInfo.cursos = cursos;
        optionsCurso += `<option value='${doc.data().curso_info.nome}'>${doc.data().curso_info.nome}</option>`;
      })
      selectCurso.innerHTML = optionsCurso;
    });
}

function setPadStart(num) {
  return num.toString().padStart(2, '0');
}
function getParcelas(nomeCurso) {
  let options = `<option disabled selected value="" >Selecione a Parcela</option>`;
  let parcelas = $alunoInfo.cursos[nomeCurso].parcelas;
  let parcelas_total = $alunoInfo.cursos[nomeCurso].parcelas_total;

  for (let i = 1; i <= parcelas_total; i++) {
    let disabled = '';
    if (parcelas[setPadStart(i)].pagamento.status === 'pago') {
      disabled = 'disabled'
    }
    options += `<option ${disabled} value='${setPadStart(i)}'>Parcela ${setPadStart(i)}</option>`;
  }
  let selectParcelas = document.querySelector("#select_parcelas");
  selectParcelas.innerHTML = options;
}
function getSelectCursoID() {
  let select = document.querySelector('#select_curso');
  let idCurso = select.options[select.selectedIndex].value;
  return idCurso;
}
export function insertFormPagMensalidade() {
  insertElementHTML("#entradas_content", "./components/fluxoCaixa/formAddPagMensalidade.html", eventsFormPagMensalidade, null, true)
}

function setValoresParcela() {
  let curso = getSelectCursoID();
  let parcela = getNumeroParcela()
  let valor = document.querySelector('#curso_valor');
  let vencimento = document.querySelector('#vencimento');
  let valor_total = document.querySelector('#curso_valor_total');
  let desconto = document.querySelector('#curso_desconto');
  let resp = document.querySelector('#resp');
  let n_lanc = document.querySelector('#n_lanc');
  let obs = document.querySelector('#obs');
  valor.value = $alunoInfo.cursos[curso].parcelas[parcela].valor;
  vencimento.value = $alunoInfo.cursos[curso].parcelas[parcela].vencimento;
  valor_total.value = $alunoInfo.cursos[curso].parcelas[parcela].valor_total;
  desconto.value = $alunoInfo.cursos[curso].parcelas[parcela].desconto;
  resp.value = $alunoInfo.cursos[curso]['resp'].nome;
  n_lanc.value = $alunoInfo.cursos[curso].parcelas[parcela].n_lanc;
  obs.value = $alunoInfo.cursos[curso].parcelas[parcela].pagamento.obs;
}

function getNumeroParcela() {
  let selectParcela = document.querySelector('#select_parcelas');
  let parcela = selectParcela.options[selectParcela.selectedIndex].value;
  return parcela;
}


function setMasks() {
  VMasker(document.querySelector('#curso_valor')).maskMoney();
  VMasker(document.querySelector('#curso_desconto')).maskMoney();
  VMasker(document.querySelector('#curso_valor_total')).maskMoney();
}
function setNomeAndRAInput() {
  document.querySelector('#ra').value = $alunoInfo.RA;
  document.querySelector('#aluno').value = $alunoInfo.nome;
}

function submitFormAddPagMensalidade(e) {
  e.preventDefault();
  let form = document.querySelector('#form_add_pag_mensalidade');
  let RA = form.ra.value;
  let curso = form.select_curso.value;
  let dataValue = document.querySelector('#data').value;
  let data = new Date(dataValue + ',' + '00:00:00')
  let ano = (data.getFullYear()).toString();
  //let mes = setMonthDate(data);
  let mes = converteMesNumeroPorExtenso((data.getMonth() + 1));
  let valor_total = form.curso_valor_total.value;
  let parcela = form.select_parcelas.value;

  createNewRowFluxoCaixa(ano, mes)
    .then((row) => {
      setDoc(doc(db, "fluxo_caixa", ano),
        {
          [mes]: {
            [row]: {
              ra: RA,
              aluno: form.aluno.value,
              curso: curso,
              n_lanc: form.n_lanc.value,
              row: row,
              categoria: "pag_mensalidade",
              data: form.data.value,
              resp: form.resp.value,
              parcela: form.select_parcelas.value,
              vencimento: form.vencimento.value,
              form_pag: form.forma_pag.value,
              valor: form.curso_valor.value,
              desconto: form.curso_desconto.value,
              valor_total: form.curso_valor_total.value,
              obs: form.obs.value,
              metadata: {
                created: new Date(),
                modified: new Date()
              }
            }
          }
        },
        { merge: true }
      )
        .then(() => {
          defaultEventsAfterSubmitFixedForm("#form_add_pag_mensalidade", "Pagamento adicionado com sucesso!");
        });
      return row;
    }).then((row) => {

      setDoc(doc(db, 'alunato', RA, 'cursos', curso), {
        curso_info: {
          parcelas: {
            [form.select_parcelas.value]: {
              pagamento: {
                status: 'pago',
                pago_em: form.data.value,
                obs: form.obs.value,
                form_pag: form.forma_pag.value,
                metadata: {
                  created: new Date(),
                  modified: new Date(),
                }
              }
            }
          }
        }
      }, { merge: true }
      );

    }).then(() => {
      addLogInfo('log_fluxo_caixa', 'insert', `pag_mensalidade - ${RA} - ${parcela} - ${valor_total}`);
    }).catch((error) => {
      addLogInfo('log_fluxo_caixa', 'error', `pag_mensalidade - ${RA} - ${parcela} - ${valor_total}`, error);
    });

}



