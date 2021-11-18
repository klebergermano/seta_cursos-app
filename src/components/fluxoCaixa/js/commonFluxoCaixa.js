import { converteMesNumeroPorExtenso } from "../../js_common/dateFunc.js";

//firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, getDoc, doc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);

const VMasker = require("vanilla-masker");

export function countEntradasTotal($fluxoCaixaAno, mes, categoria) {
    let entradas = $fluxoCaixaAno[mes];
    let n_entradas = 0;
    for (let value of Object.values(entradas)) {
        if (value.categoria === categoria) {
            n_entradas++;
        }
    }
    return n_entradas;
}

export function somaValorTotalMes($fluxoCaixaAno, mes, categoria) {
    let valorTotalMes = [];
    let entradas = $fluxoCaixaAno[mes];
    for (let value of Object.values(entradas)) {
        if (value.categoria === categoria) {
            if (value.valor_total) {
                valorTotalMes.push(value.valor_total)
            } else {
                valorTotalMes.push(value.valor)
            }
        }
    }

    let res = sumArrayDecimalNumbers(valorTotalMes);
    return  res;
}

export function sumArrayDecimalNumbers(arrDecimalNumbers){
    let res = arrDecimalNumbers.reduce((acc, value) => {
                let valor = value.replace(',', '');
                return parseFloat(acc) + parseFloat(valor);
            }, 0)
    res = VMasker.toMoney(res, {showSignal: true});
    return res; 
};
export function subArrayDecimalNumbers(arrDecimalNumbers){
    let res = arrDecimalNumbers.reduce((acc, value) => {
                let v = value.replace(',', '');
                let a = acc.replace(',', '');
                return parseFloat(a) - parseFloat(v);
            })
    res = VMasker.toMoney(res, {showSignal: true});
    return res; 
};
export async function setFluxoCaixaAno(ano) {
    let fluxoCaixa = getDoc(doc(db, 'fluxo_caixa', ano))
        .then((res) => {
            return res.data();
        }).catch(err => console.log(err));
    return fluxoCaixa;
}

export function setAnoMesSelectFiltros() {
    let date = new Date();
    let mes = parseInt(date.getMonth()) + 1;
    let ano = date.getFullYear();
    let selectAno = document.querySelector('#select_ano');
    let selectMes = document.querySelector('#select_mes');
    if (selectAno) {
        let optionsSelectAno = Array.from(selectAno.options);
        optionsSelectAno.forEach((optAno) => {
            if (optAno.value === ano) {
                optAno.setAttribute('selected', true);
            }
        });
    }

    if (selectMes) {
        let optionsSelectMes = Array.from(selectMes.options);
        optionsSelectMes.forEach((optMes) => {
            let mesExtenso = converteMesNumeroPorExtenso(mes);
            if (optMes.value === mesExtenso) {
                optMes.setAttribute('selected', true);
            }
        });
    }

}

export function sortTbodyElementByDate(tableID) {
    let tbody = document.querySelector(`${tableID} tbody`);
    let rows = Array.from(tbody.querySelectorAll("tr"));
    rows.sort(function (a, b) {
        if (a.id !== 'tr_resumo') {
            return (
                convertDateToNumber(a.querySelector('.td_data').innerHTML) -
                convertDateToNumber(b.querySelector('.td_data').innerHTML)
            );
        }
    });
    tbody.innerHTML = '';
    rows.forEach((item) => {
        tbody.appendChild(item);
    });
}

function convertDateToNumber(d) {
    var p = d.split("/");
    return +(p[2] + p[1] + p[0]);
}


export function getFiltroInfoAnoMes() {
    let filtroInfo = {};
    let selectAno = document.querySelector('#select_ano');
    let selectMes = document.querySelector('#select_mes');
    if (selectAno) {
        filtroInfo.ano = selectAno.options[selectAno.selectedIndex].value;
    }
    if (selectMes) {
        filtroInfo.mes = selectMes.options[selectMes.selectedIndex].value;
    }
    return filtroInfo;
}