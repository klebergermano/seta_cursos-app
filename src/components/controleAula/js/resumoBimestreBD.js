import {getReverseObjectKeys} from "../../js_common/commonFunctions.js";

export function resumoBimestreBD(curso) {
    let bimestresKeys = getReverseObjectKeys(curso.bimestres);
    let resumoBimestres = {};
    for (let i = 0; i < bimestresKeys.length; i++) {
      resumoBimestres[bimestresKeys[i]] = {}
      let bimestre = curso.bimestres[bimestresKeys[i]];
      let aulasKeys = getReverseObjectKeys(bimestre);
      let pontosExtras = 0;
      let reposicao = 0;
      let concluidas = 0;
      let faltas = 0;
      let remarcadas = 0;
      let notaProva = 0;
      let feedbackBimestral = '';
  
      for (let j = 0; j < aulasKeys.length; j++) {
        let aulaStatus = curso.bimestres[bimestresKeys[i]][aulasKeys[j]].status;
        let aulaCategoria = curso.bimestres[bimestresKeys[i]][aulasKeys[j]].categoria;
        if (aulaCategoria === "feedback bimestral") {
          feedbackBimestral = curso.bimestres[bimestresKeys[i]][aulasKeys[j]].observacao;
  
        }
        if (aulaCategoria === "prova") {
          notaProva = curso.bimestres[bimestresKeys[i]][aulasKeys[j]].nota;
        }
  
        if (aulaStatus === "concluida") {
          concluidas++;
        }
        if (aulaStatus === "falta") {
          faltas++;
        }
        if (aulaStatus === "remarcada") {
          remarcadas++;
        }
        if (aulasKeys[j].includes("ponto extra")) {
          pontosExtras++;
        } else if (aulasKeys[j].includes("reposição")) {
          reposicao++;
        }
      }
      resumoBimestres[bimestresKeys[i]].concluidas = concluidas;
      resumoBimestres[bimestresKeys[i]].faltas = faltas;
      resumoBimestres[bimestresKeys[i]].remarcadas = remarcadas;
      resumoBimestres[bimestresKeys[i]].pontosExtras = pontosExtras;
      resumoBimestres[bimestresKeys[i]].reposicao = reposicao;
      resumoBimestres[bimestresKeys[i]].notaProva = notaProva;
      resumoBimestres[bimestresKeys[i]].feedbackBimestral = feedbackBimestral;
      let notaFinal = parseFloat(notaProva) + pontosExtras;
      if (notaFinal > 10) notaFinal = 10;
      resumoBimestres[bimestresKeys[i]].notaFinal = notaFinal;
    }
    return resumoBimestres;
  }
  