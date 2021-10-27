
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, setDoc, getDocs, doc, collection } = require("firebase/firestore")
const db = getFirestore(firebaseApp);

export function toggleIdAutomaticoContrato() {
    let checkbox_id_automatico = document.querySelector("#checkbox_id_automatico_contrato");
    let labelCheckbox =  checkbox_id_automatico.closest('label');
    if(checkbox_id_automatico.checked){
        console.log('on');
        labelCheckbox.classList.add('active');
        labelCheckbox.querySelector('span').innerHTML = "ID Automático Gerado &#10003;";
        setIdAutomaticoContrato();
    }else{
        console.log('off');
        labelCheckbox.classList.remove('active');
        labelCheckbox.querySelector('span').innerHTML = "Gerar ID Automática";

        removeIdAutomaticoContrato()
    }
    
}

function setIdAutomaticoContrato(){
    let id_contrato = document.querySelector('#id_contrato');
    let contratos_id = getContratosId();
    id_contrato.setAttribute('readonly', true);
    contratos_id.then((res) => {
        let newIdContrato = createNewIdContrato(res)
        insertNewIdContrato(newIdContrato)
    }).then(()=>{
        maskValueIdContrato()
    })
}

function removeIdAutomaticoContrato(){
    let id_contrato = document.querySelector('#id_contrato');
    id_contrato.removeAttribute('readonly');
    id_contrato.value=''
}
function insertNewIdContrato(newIdContrato){
    document.querySelector('#id_contrato').value = newIdContrato;

}
function createNewIdContrato(contratos_id) {
    let id_numbers = [];
    contratos_id.forEach((item) => {
        let number = parseFloat(item.replace(/\D/g, ''));
        id_numbers.push(number);
    });

    var maxId = id_numbers.reduce(function (a, b) {
        return Math.max(a, b);
    });
    return  maxId + 1;
}

//Aplica mascara de formatação no input id_contrato 
export function maskInputIdContrato(){
    let id_contrato = document.querySelector("#id_contrato");
    //Remove qualquer qualquer letra que não seja um número
    //e Aplica a letra C no valor.
    id_contrato.addEventListener('input', () => {
        let numbers = (id_contrato.value).replace(/\D/g, '');
        id_contrato.value = 'C' + numbers;

    })
    //Garante que o id tera 5 digitos aplicando padStart.
    id_contrato.addEventListener('change', () => {
        maskValueIdContrato()
    });
}

function maskValueIdContrato(){
    let id_contrato = document.querySelector("#id_contrato");
    let numbers = getNumbersFromString(id_contrato.value);
    let id =  formatToIdContrato(numbers)
    insertNewIdContrato(id);
}

function formatToIdContrato(numbers){
    let numbers_pad = numbers.padStart('4', 0);
    return 'C'+numbers_pad;

}
function getNumbersFromString(string){
    let numbers = (string).replace(/\D/g, '');
    return numbers
            }

function getContratosId() {
    let contratos_id = getDocs(collection(db, 'contratos'))
        .then((contratos) => {
            let ids = [];
            contratos.forEach((item) => {
                ids.push(item.id)
            })
            return ids;
        })
    return contratos_id;
}