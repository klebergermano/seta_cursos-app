data = {

}

function getInfo(){
    let bd = fetch('./seta_cursos_bd.json')
    .then(res=> res.json());

    return bd;
    
}

function aulasLoop(){

    let bdInfo = getInfo();
    bdInfo.then((res)=>{
        let aluno = res.__collections__.aluno_historico.RA01.__collections__.cursos;
        console.log(aluno);
    });
let body = document.querySelector('body');

}

aulasLoop()