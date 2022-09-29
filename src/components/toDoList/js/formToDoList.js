
//helpers
import addOneStringNumbPadStart from "../../../functions/helpers/addOneStringNumbPadStart.js";
import getFormValuesAsObj from "../../../functions/helpers/getFormValuesAsObj.js";
import sortObjIntKeysIntoArr from "../../../functions/helpers/sortObjIntKeysIntoArr.js";
//Forms
import defaultEventsAfterSubmitFixedForm from "../../../functions/forms/defaultEventAfterSubmitgFixedForm.js";
      const getLastEntryFromDB = async () => {
        const obj = await _getUserTodoList();
        const sortedKeys = sortObjIntKeysIntoArr(obj);
        console.log('sortedKeys', sortedKeys);
        const lastArrValue = sortedKeys[sortedKeys.length - 1];
        return lastArrValue;
      }
      //***************************************************************************************************** */
      
//Errors
import CustomError from '../../../functions/errors/CustomError.js';
import handleError from '../../../functions/errors/handleError.js';
//**** */
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
        // addLogInfo('to-do_list', 'info', `tarefa adic.`);
      })
      .catch((error) => {
        console.log(error);
        //addLogInfo('do_list', 'error', `erro ao adc.`, error);
      });
  }


export default submitFormAddTodoList; 