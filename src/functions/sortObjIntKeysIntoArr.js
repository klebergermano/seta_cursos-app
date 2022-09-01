//Organiza as keys numéricas ex.: '01', '02', '100', '101';
//O valor númerico pode ser tanto no formato de string: '01' ou int: 01 (sem aspas).
const sortObjIntKeysIntoArr = (obj)=> Object.keys(obj).sort((a, b) => a - b);
export default sortObjIntKeysIntoArr; 