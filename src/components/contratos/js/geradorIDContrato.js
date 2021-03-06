//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, getDocs, collection } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//

export function eventsIDContrato() {
    let id_contrato = document.querySelector("#id_contrato");
    document.querySelector('#checkbox_id_automatico_contrato')
        .addEventListener('click', toggleIDAutomaticoContrato);
    insertOptionslistIdContrato();
    //e Aplica a letra C no valor.
    id_contrato.addEventListener('input', () => {
        let numbers = (id_contrato.value).replace(/\D/g, '');
        id_contrato.value = 'C' + numbers;
    })
    //Garante que o id tera 5 digitos aplicando padStart.
    id_contrato.addEventListener('change', () => {
        maskValueIDContrato()
        checkInputIDContrato()
    });
}

function toggleIDAutomaticoContrato() {
    let checkbox_id_automatico = document.querySelector("#checkbox_id_automatico_contrato");
    let labelCheckbox = checkbox_id_automatico.closest('label');
    if (checkbox_id_automatico.checked) {
        labelCheckbox.classList.add('active');
        labelCheckbox.querySelector('span').innerHTML = "ID Automático Gerado &#10003;";
        setIDAutomaticoContrato();
        validateInputIDContrato();
    } else {
        labelCheckbox.classList.remove('active');
        labelCheckbox.querySelector('span').innerHTML = "Gerar ID Automático";
        removeIDAutomaticoContrato()
    }
}

function checkInputIDContrato() {
    let idInputValue = document.querySelector("#id_contrato").value;
    getIdContratos()
        .then((idContratos) => {
            let valida = true;
            idContratos.forEach((idContrato) => {
                if (idContrato === idInputValue || idInputValue === "C000") {
                    valida = false;
                }
            })
            if (!valida) invalidateInputIDContrato();
            else validateInputIDContrato();
        });
}

function invalidateInputIDContrato() {
    let idInput = document.querySelector("#id_contrato");
    idInput.setCustomValidity("ID em uso ou inválida");
    idInput.classList.add('input_invalido');
}

function validateInputIDContrato() {
    let idInput = document.querySelector("#id_contrato");
    idInput.classList.remove('input_invalido');
    idInput.setCustomValidity("");
}

function insertOptionslistIdContrato() {
    let listIdContrato = document.querySelector("#list_id_contrato");
    getIdContratos()
        .then((idContratos) => {
            let options = '';
            idContratos.forEach((item) => {
                options += `<option>${item}</option>`;
            });
            listIdContrato.innerHTML = options;
        });
}

function setIDAutomaticoContrato() {
    let id_contrato = document.querySelector('#id_contrato');
    let contratos_id = getIdContratos();
    id_contrato.setAttribute('readonly', true);
    contratos_id.then((res) => {
        let newIdContrato = createNewIDContrato(res)
        insertNewIDContrato(newIdContrato)
    }).then(() => {
        maskValueIDContrato()
    })
}

function removeIDAutomaticoContrato() {
    let id_contrato = document.querySelector('#id_contrato');
    id_contrato.removeAttribute('readonly');
    id_contrato.value = ''
}
function insertNewIDContrato(newIdContrato) {
    document.querySelector('#id_contrato').value = newIdContrato;
}

function createNewIDContrato(contratos_id) {
    let id_numbers = [];
    contratos_id.forEach((item) => {
        let number = parseFloat(item.replace(/\D/g, ''));
        id_numbers.push(number);
    });

    var maxId = id_numbers.reduce(function (a, b) {
        return Math.max(a, b);
    });
    return maxId + 1;
}

function maskValueIDContrato() {
    let id_contrato = document.querySelector("#id_contrato");
    let numbers = getNumbersFromString(id_contrato.value);
    let id = formatToIdContrato(numbers)
    insertNewIDContrato(id);
}

function formatToIdContrato(numbers) {
    let numbers_pad = numbers.padStart('4', 0);
    return 'C' + numbers_pad;
}
function getNumbersFromString(string) {
    let numbers = (string).replace(/\D/g, '');
    return numbers
}

function getIdContratos() {
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