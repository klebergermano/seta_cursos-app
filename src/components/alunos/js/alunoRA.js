//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, getDocs, collection } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//

//TODO: REFATORAR FUNÇÕES
export function eventsAlunoRA() {
    let alunoRA = document.querySelector("#aluno_ra");
    document.querySelector('#checkbox_ra_automatico_aluno')
        .addEventListener('click', () => {
            toggleRAAutomaticoAluno()
        });
    insertOptionslistAlunoRA();
    //e Aplica a letra C no valor.

    alunoRA.addEventListener('input', () => {
        let numbers = (alunoRA.value).replace(/\D/g, '');
        alunoRA.value = 'RA' + numbers;
    })

    //Garante que o id tera 5 digitos aplicando padStart.
    alunoRA.addEventListener('change', () => {
        maskValueAlunoRA()
        checkInputRAAluno()
    });

}

function toggleRAAutomaticoAluno() {
    let checkbox_ra_automatico = document.querySelector("#checkbox_ra_automatico_aluno");
    let labelCheckbox = checkbox_ra_automatico.closest('label');
    if (checkbox_ra_automatico.checked) {
        labelCheckbox.classList.add('active');
        labelCheckbox.querySelector('span').innerHTML = "RA Automático Gerado &#10003;";
        setAlunoRAAutomatico();
        validateInputRAAluno();
    } else {
        labelCheckbox.classList.remove('active');
        labelCheckbox.querySelector('span').innerHTML = "Gerar RA Automático";
        removeAlunoRAAutomatico()
    }
}

function checkInputRAAluno() {
    let alunoRA = document.querySelector("#aluno_ra").value;
    getAlunosRA()
        .then((RAAlunos) => {
            let valida = true;
            RAAlunos.forEach((RAAluno) => {
                if (RAAluno === alunoRA || alunoRA === "RA0000") {
                    valida = false;
                }
            })
            if (!valida) invalidateInputRAAluno();
            else validateInputRAAluno();

        });
}

function invalidateInputRAAluno() {
    let idInput = document.querySelector("#aluno_ra");
    idInput.setCustomValidity("RA em uso ou inválido");
    idInput.classList.add('input_invalido');
}
function validateInputRAAluno() {
    let RAALuno = document.querySelector("#aluno_ra");
    RAALuno.classList.remove('input_invalido');
    RAALuno.setCustomValidity("");
}
function insertOptionslistAlunoRA() {
    let listalunosRA = document.querySelector("#aluno_datalist_ra");
    getAlunosRA()
        .then((RAAlunos) => {
            let options = '';
            RAAlunos.forEach((item) => {
                options += `<option>${item}</option>`;
            });
            listalunosRA.innerHTML = options;
        });
}

function setAlunoRAAutomatico() {
    let InputAlunoRA = document.querySelector('#aluno_ra');
    InputAlunoRA.setAttribute('readonly', true);
    let alunosRA = getAlunosRA();
    alunosRA.then((res) => {
        let newAlunoRA = createNewAlunoRA(res)
        insertNewAlunoRA(newAlunoRA)
    }).then(() => {
        maskValueAlunoRA()
    })
}

function removeAlunoRAAutomatico() {
    let alunoRA = document.querySelector('#aluno_ra');
    alunoRA.removeAttribute('readonly');
    alunoRA.value = ''
}
function insertNewAlunoRA(newAlunoRA) {
    document.querySelector('#aluno_ra').value = newAlunoRA;

}
function createNewAlunoRA(alunoRA) {
    let id_numbers = [];
    alunoRA.forEach((item) => {
        let number = parseFloat(item.replace(/\D/g, ''));
        id_numbers.push(number);
    });

    var maxId = id_numbers.reduce(function (a, b) {
        return Math.max(a, b);
    });
    return maxId + 1;
}

function maskValueAlunoRA() {
    let alunoRA = document.querySelector("#aluno_ra");
    let numbers = getNumbersFromString(alunoRA.value);
    let RA = formatToAlunoRA(numbers)
    insertNewAlunoRA(RA);
}

function formatToAlunoRA(numbers) {
    let numbers_pad = numbers.padStart('4', 0);
    return 'RA' + numbers_pad;

}
function getNumbersFromString(string) {
    let numbers = (string).replace(/\D/g, '');
    return numbers
}

export function getAlunosRA() {
    let alunosRA = getDocs(collection(db, 'alunato'))
        .then((alunos) => {
            let RAs = [];
            alunos.forEach((item) => {
                RAs.push(item.id)
            })
            return RAs;
        })
    return alunosRA;
}