//-------------------------------------------------------------------------
//Firebase
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, doc, collection, getDocs, getDoc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);
//-------------------------------------------------------------------------

export function getContratoInfoDB(IDContrato) {
    let contratoInfo = getDoc(doc(db, 'contratos', IDContrato));
    return contratoInfo
}

export function getContratosListDB() {
    const contratos = getDocs(collection(db, 'contratos'))
    return contratos;
}


export async function insertOptionsSelectCursos(RA) {
    let selectCursos = document.querySelector("#select_curso");
    console.log(selectCursos);
    let optionsSelect = "<option value='' disabled selected>Selectione o Curso</option>";
     getDocs(collection(db, 'alunato', RA, 'cursos'))
            .then((res)=>{
                res.forEach((item)=>{
                    optionsSelect += `<option data-id_contrato='${item.data().curso_info.id_contrato}' value="${item.data().curso_info.nome}"> ${item.data().curso_info.nome}</option>`;
               console.log(item);
                })
              
            }).then(()=>{
                selectCursos.innerHTML = optionsSelect;
            })
}

export async function insertOptionsSelectContrato() {
    const selectContrato = document.querySelector("#select_contrato");
    let contratosList = await getContratosListDB();
    let optionsSelect = "<option value='' disabled selected>Selectione um contrato</option>";
    contratosList.forEach((contrato) => {
        let disabled =''; 
        if(contrato.data().metadata.aluno_associado !== 'pendente'){
            disabled = "disabled='true'";
        }
        optionsSelect += `<option ${disabled} value='${contrato.id}'>${contrato.id} - <b>${contrato.data().resp_info.nome} (${contrato.data().curso_info.nome})</option>`;
    });
    selectContrato.innerHTML = optionsSelect;
}

//------------------------CREATE PARCELAS---------------------------------------
export function createParcelas(parcelaInfo) {
    /*
    //Objeto esperado em parcelaInfo
    let parcelaInfo = {
            id_contrato: '',
            inicio: '', 
            vencimento: '',
            parcelas: '',
            valor_mes: '',
            desconto_mes: '',
            valor_total_mes: '',
        }
    */
    let data_vencimento = setDateDay(parcelaInfo.inicio, parcelaInfo.vencimento);
    let num_parcelas = parseInt(parcelaInfo.parcelas);
    let parcelas = {};
    for (let i = 0; i < num_parcelas; i++) {
        let p_vencimento = addDateMonth(i, data_vencimento);
        let num_parcela = (i + 1).toString().padStart(2, '0');
        parcelas[num_parcela] = {
            n_lanc: createNumeroLancamento(parcelaInfo.id_contrato, (num_parcela)),
            vencimento: p_vencimento,
            valor:parcelaInfo.valor_mes,
            desconto:parcelaInfo.desconto_mes,
            valor_total:parcelaInfo.valor_total_mes,
            pagamento: {
                status: "pendente",
                form_pag: "",
                pago_em: "",
                valor_pago: "",
                obs: "",
            },
        };
    }
    return parcelas;
}

//--------------n_lanc-----------------------
 function createNumeroLancamento(idContrato, n_parcela) {
    console.log(idContrato, n_parcela);
    let n_lanc = idContrato + 'F' + n_parcela;
    return n_lanc;
}

//------------------------------------------------------------------------------------

function setDateDay(data_inicio, vencimento) {
    let d = new Date(data_inicio + ", 00:00:00");
    let year = d.getFullYear();
    let month = (d.getMonth() + 1).toString().padStart(2, "0");
    let day = vencimento.toString().padStart(2, "0");
    let newDate = `${year}-${month}-${day}`;
    return newDate;
}

function addDateMonth(num_mes, date) {
    let i = num_mes;
    let vencimento_data = date; //formato deve ser o mesmo do DB  "yyyy-mm-dd" ex: "2020-01-02"
    vencimento_data = vencimento_data.split("-");
    let dia_split = vencimento_data[2];
    let mes_split = vencimento_data[1];
    let ano_split = vencimento_data[0];
    let mes_futuro = parseInt(mes_split) + i;
    mes_split = mes_futuro;
    if (mes_split > 12) {
        mes_split = mes_split - 12;
        ano_split = parseInt(ano_split) + 1;
    }
    if (dia_split > "28" && mes_split == "2") {
        dia_split = "28";
    } else if (dia_split > "30") {
        switch (mes_split) {
            case 4:
                dia_split = "30";
                break;
            case 6:
                dia_split = "30";
                break;
            case 9:
                dia_split = "30";
                break;
            case 11:
                dia_split = "30";
                break;
        }
    }
    let data_final =
        ano_split +
        "-" +
        (parseInt(mes_split) + "").padStart(2, "0") +
        "-" +
        (parseInt(dia_split) + "").padStart(2, "0");

    return data_final;
}