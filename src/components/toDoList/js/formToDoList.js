
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, setDoc, doc } = require("firebase/firestore");
const db = getFirestore(firebaseApp);
const { getAuth } = require("firebase/auth");
const auth = getAuth(firebaseApp);
//Helpers
import addOneStringNumbPadStart from "../../../functions/helpers/addOneStringNumbPadStart.js";
import getFormValuesAsObj from "../../../functions/helpers/getFormValuesAsObj.js";
import sortObjIntKeysIntoArr from "../../../functions/helpers/sortObjIntKeysIntoArr.js";
import $ from "../../../functions/helpers/$.js";
//Forms
import viewTodoList from "./viewTodoList.js";
import defaultEventsAfterSubmitFixedForm from "../../../functions/forms/defaultEventAfterSubmitgFixedForm.js";
import atualizaViewTodoList from "./atualizaViewTodoList.js"; 

//Errors
import CustomError from '../../../functions/errors/CustomError.js';
import handleError from '../../../functions/errors/handleError.js';
//---------------------------------------------------------------//



const getLastEntryFromDB = async () => {
  const obj = await viewTodoList.getUserTodoList();
  const sortedKeys = sortObjIntKeysIntoArr(obj);
  console.log('sortedKeys', sortedKeys);
  const lastArrValue = sortedKeys[sortedKeys.length - 1];
  return lastArrValue;
}

  const addOneToKeyDBTodoList = async () => addOneStringNumbPadStart(await getLastEntryFromDB())('2')('0');


  //Form Add To-do List -----------------------------------------------------------------
  const submitFormAddTodoList = () => {
    $('form_add_todo').addEventListener('submit', async (e) => {
      e.preventDefault();
      const UID = auth.currentUser.uid;
      const formValueObj = getFormValuesAsObj(e.target);
      const newKey = await addOneToKeyDBTodoList();
      const newObj = {
        [newKey]: formValueObj
      }
      setDocToFirestoreDBMerge(UID, newObj)
    })
  }
  const removeFormAddTodoListWithSetTimeout = () => { setTimeout(() => { $('form_add_todo').remove() }, 1500) }

  function setDocToFirestoreDBMerge(ID, valuesObj) {
    console.log('vaulesObj:', valuesObj)
    setDoc(doc(db, 'users', ID, 'content', 'to-do_list'),
      valuesObj,
      { merge: true }
    )
      .then(() => {
        defaultEventsAfterSubmitFixedForm('#form_add_todo')('Tarefa adicionada com sucesso!')(removeFormAddTodoListWithSetTimeout)
      }).then(() => {
        atualizaViewTodoList();
      })
      .catch((error) => {
        console.log(error);
        //addLogInfo('do_list', 'error', `erro ao adc.`, error);
      });
  }


export default submitFormAddTodoList; 