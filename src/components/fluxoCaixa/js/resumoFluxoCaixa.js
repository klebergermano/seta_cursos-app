


//--------------------------------------------------------------------
import { insertElementHTML} from "../../js_common/commonFunctions.js";

//Others libraries
const VMasker = require("vanilla-masker");
//--------------------------------------------------------------------
export function insertResumoFluxoCaixaHTML() {
  insertElementHTML("#fluxo_caixa_content", "./components/fluxoCaixa/resumoFluxoCaixa.html", eventsResumoFluxoCaixa, null, true)

}

function setMasks(){

}

function eventsResumoFluxoCaixa() {

}

