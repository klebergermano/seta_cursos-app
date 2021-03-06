//Components
import insertElementHTML from "../../jsCommon/insertElementHTML.js";
import { converteMesNumeroPorExtenso } from "../../jsCommon/dateFunc.js";
//---------------------------------------------------------------//
//Funções do componente
import {
  countEntradasTotal, somaValorTotalMes, setFluxoCaixaAno,
  setAnoMesSelectFiltros, getFiltroInfoAnoMes, sumArrayDecimalNumbers, subArrayDecimalNumbers
} from "./commonFluxoCaixa.js";
//---------------------------------------------------------------//

let $fluxoCaixaAno = {};
export function insertResumoFluxoCaixaHTML() {
  insertElementHTML("#fluxo_caixa_content", "./components/fluxoCaixa/resumoFluxoCaixa.html", eventsResumoFluxoCaixa, null, true)
}
function eventsResumoFluxoCaixa() {
  setAnoMesSelectFiltros()
  let filtroInfo = getFiltroInfoAnoMes()
  setFluxoCaixaAno(filtroInfo.ano)
    .then((res) => {
      $fluxoCaixaAno = res;
      $fluxoCaixaAno.ano = filtroInfo.ano;
      insertContentResumoTable(res)
    }).catch(err => console.log(err))

  document.querySelector("#select_ano").addEventListener('change', (e) => {
    let filtroInfo = getFiltroInfoAnoMes()
    setFluxoCaixaAno(filtroInfo.ano)
      .then((res) => {
        res.ano = filtroInfo.ano;
        insertContentResumoTable(res)
      }).catch(err => console.log(err))
  })
}

function insertContentResumoTable(fluxoCaixaAno) {
  somaMesesAno(fluxoCaixaAno)
}
function somaMesesAno(fluxoCaixaAno) {
  for (let i = 1; i <= 12; i++) {
    let mesNome = converteMesNumeroPorExtenso(i);
    let mesData = fluxoCaixaAno[mesNome];
    let somaPagMensalidade = ' 0,00';
    let somaEntradaAvulsa = '0,00';
    let somaSaidaAvulsa = '0,00';
    let totalMes = '0,00';
    let numPagMes = 0;
    if (mesData) {
      numPagMes = countEntradasTotal(fluxoCaixaAno, mesNome, 'pag_mensalidade');
      somaPagMensalidade = somaValorTotalMes(fluxoCaixaAno, mesNome, 'pag_mensalidade');
      somaEntradaAvulsa = somaValorTotalMes(fluxoCaixaAno, mesNome, 'entrada_avulsa');
      somaSaidaAvulsa = somaValorTotalMes(fluxoCaixaAno, mesNome, 'saida_avulsa');
    }
    document.querySelector(`#res_${mesNome} .td_num_pag_mensalidade`).innerHTML = numPagMes;
    document.querySelector(`#res_${mesNome} .td_pag_mensalidade`).innerHTML = somaPagMensalidade;
    document.querySelector(`#res_${mesNome} .td_entradas_avulso`).innerHTML = somaEntradaAvulsa;
    document.querySelector(`#res_${mesNome} .td_saidas_avulso`).innerHTML = somaSaidaAvulsa;
    let somaEntradasMes = sumArrayDecimalNumbers([somaPagMensalidade, somaEntradaAvulsa]);
    document.querySelector(`#res_${mesNome} .td_total_entradas`).innerHTML = somaEntradasMes;
    totalMes = subArrayDecimalNumbers([somaEntradasMes, somaSaidaAvulsa]);
    if (totalMes.includes('-')) {
      document.querySelector(`#res_${mesNome} .td_total`).classList.add('red');
    }
    document.querySelector(`#res_${mesNome} .td_total`).innerHTML = totalMes;
  }
}
