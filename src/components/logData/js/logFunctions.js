
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore,  getDoc, doc, setDoc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);
const {getAuth} = require("firebase/auth");
const auth = getAuth(firebaseApp);


export async function addLogInfo(logName, action, reference,  error){
    let levelMessage = setLevelMessageLogData(action, reference, error)
    let newIdDoc = await generateDocFieldNumberLog(logName);
      setDoc(doc(db, 'log_data', logName),
      {
           [newIdDoc] :{
              user: auth.currentUser.email,
              action: action,
              level: levelMessage.level,
              message: levelMessage.message,
              datetime: new Date()

          }
      },{ merge: true}
  
      ); 
  }

  function setLevelMessageLogData(action, reference,  error){
    let levelMessage = {}; 
    if(action === 'delete'){
        levelMessage.level = 'alerta',
        levelMessage.message = `Objeto ref.:"${reference}", foi deletado com sucesso do banco de dados.`
    }else if(action === 'update'){
        levelMessage.level = 'info',
        levelMessage.message = `Objeto ref.:"${reference}", foi atualizado com sucesso no banco de dados.`
    }
    else if(action === 'insert'){
        levelMessage.level = 'info',
        levelMessage.message = `Objeto ref.:"${reference}", foi adicionado com sucesso no banco de dados.`
    }
    else if(action === 'curso_adicionado'){
        levelMessage.level = 'info',
        levelMessage.message = `Objeto ref.:"${reference}", curso foi vinculado com sucesso.`
    }
    else if(action === 'curso_deletado'){
        levelMessage.level = 'alerta',
        levelMessage.message = `Objeto ref.:"${reference}", curso foi deletado com sucesso.`
    }

    else if(action === 'create_pdf'){
        levelMessage.level = 'info',
        levelMessage.message = `Objeto ref.:"${reference}", PDF gerado com sucesso.`
    }

    else if(action === 'error' || action === 'erro' || action === 'err'){
        levelMessage.level = 'erro',
        levelMessage.message = `Houve um erro no sistema: ${error.code}, ${error.message}`
    }
    else if(action === 'login'){
        levelMessage.level = 'info',
        levelMessage.message = `Login efetuado com sucesso.`
    }
    else if(action === 'logout'){
        levelMessage.level = 'info',
        levelMessage.message = `Logout efetuado com sucesso.`
    }
    else{
        levelMessage.level = 'alerta',
        levelMessage.message = `Houve um aviso não categorizado no sistema, ação:"${action}"`;
    }
    return levelMessage; 
  }


function generateDocFieldNumberLog(logName){
    let newIdDoc = getDoc(doc(db, 'log_data', logName))
    .then((res) => {
        console.log('res', res.data());
        if(res.data()){
            let log = res.data();
            let id_numbers = [];
              for( let key of Object.keys(log)){
                  let number = parseFloat(key.replace(/\D/g, ''));
                  id_numbers.push(number)
              }
             let maxId = id_numbers.reduce(function (a, b) {
                  return Math.max(a, b);
               });
               console.log(maxId + 1);
           return maxId + 1;
        }else{
            return 1;
        }


    })    
    return newIdDoc;
}
      
