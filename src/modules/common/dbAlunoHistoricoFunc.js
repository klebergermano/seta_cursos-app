

export function alunoHistCursosRealTimeDB(RA, callback) {
    db.collection("aluno_historico")
    .doc(RA)
    .collection("cursos")
    .onSnapshot((snapshot) => {
        callback(RA, snapshot.docChanges());
    });
  }
  
export function getAlunosListRA() {
    let alunosList = db.collection("aluno_historico").get();
    let IDs = [];
    let alunoListRA = alunosList.then((res) => {
      res.forEach((item) => {
        IDs.push(item.id);
      });
      return IDs.reverse();
    });
    return alunoListRA;
  }

  export async function getAlunoInfoGeral(RA) {
    let alunoInfo = await db
      .collection("aluno_historico")
      .doc(RA)
      .get()
      .then((res) => {
        return res.data();
      });
    alunoInfo.RA = RA;
    return alunoInfo;
  }
  
export function getAlunoHistCursosDB(RA) {
    let alunoHistorico = db
      .collection("aluno_historico")
      .doc(RA)
      .collection("cursos")
      .get();
  
    return alunoHistorico;
  }
  
