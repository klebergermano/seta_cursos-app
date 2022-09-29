
   // Adiciona um "+1", a um número no formato string, formatando com o PadStart().
   const addOneStringNumbPadStart = stringNumber => size => simbol => (parseInt(stringNumber) + 1).toString().padStart(size, simbol);

   export default addOneStringNumbPadStart; 