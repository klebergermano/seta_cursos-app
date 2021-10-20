import * as commonFunc from "../../js_common/commonFunctions.js"
export function insertFormEntradaCaixa(){
commonFunc.insertElementHTML("#fluxo_caixa_content", "./components/fluxoCaixa/formAddEntradaCaixa.html", eventsFormEntradaCaixa)


}

function eventsFormEntradaCaixa(){
    commonFunc.btnCloseForm("#form_add_entrada_caixa");
    commonFunc.displayBlockScreen();
}