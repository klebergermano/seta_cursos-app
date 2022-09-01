const getFormValuesAsObj = formEl => Object.fromEntries(new FormData(formEl)); 
export default getFormValuesAsObj;