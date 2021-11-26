module.exports = (folha)=> {

      let ano = data_vencimento.getFullYear();
      let mes = data_vencimento.getMonth() + 1; // Meses são contador apartir do 0 no js +1 corrigi isso
      let dia = data_vencimento.getDate();
      let f_data_vencimento = dia + "/" + mes + "/" + ano;

      let f_valor = valor.toFixed(2).replace(/\./g, ",");
      let f_desconto = desconto.toFixed(2).replace(/\./g, ",");
      let f_valor_total = valor_total.toFixed(2).replace(/\./g, ",");

      let f_RA = "" + RA; //concactenar com aspas para poder conver o RA para string (padStart precisa receber uma string)
      f_RA = f_RA.padStart(4, "0")


    return (

        `
      <div class="bg_boleto">
      <div class="bloco_cliente">
        <table style="width:100%">
          <tr width="100%">
            <td colspan="10">
              <b>Responsável:</b>
              <span class="responsavel_cliente">${folha.responsavel}</span>
            </td>
          </tr>
          <tr>
            <td class="font_6" colspan="6">
              <b>Aluno(a):</b
              ><span class="aluno_cliente"> ${folha.aluno}</span>
            </td>
          </tr>
  
          <tr>
            <td class="font_6" colspan="1">
              <span class="label_top"><b>Nº Lanç.</b></span>
             <span class='n_lanc_cliente'> ${folha.n_lanc}</span>
            </td>
  
            <td colspan="1">
              <span class="label_top"><b>Parcela</b></span>
             ${folha.parcela}
            </td>
            <td colspan="1">
              <span class="label_top"><b>Vencimento</b></span>
              ${folha.f_data_vencimento}
            </td>
          </tr>
  
          <tr>
            <td colspan="1">
              <span class="label_top"><b>Valor</b></span>
              R$ ${folha.f_valor}
            </td>
            <td colspan="1">
              <span class="label_top"><b>Desconto</b></span>
  
              R$ ${folha.f_desconto}
            </td>
            <td colspan="1">
              <span class="label_top"><b>Valor Total</b></span>
  
             <b> R$ ${folha.f_valor_total}</b>
            </td>
          </tr>
          <tr>
            <td colspan="5">
              <b>Curso:</b><span class="curso_cliente"> ${folha.curso}</span>
            </td>
          </tr>
          <tr>
            <td colspan="5"><b>Obs.: </b></td>
          </tr>
          <tr>
            <td colspan="3"></td>
          </tr>
          <tr>
            <td colspan="2">
              <span class="RA_cliente">Via da escola: RA${folha.f_RA}</span>
            </td>
  
            <td colspan="5">
              <br /><span class="data_cliente"> Data ____/____/____</span><br />
            </td>
          </tr>
        </table>
      </div>
      <!-------------------------------------------------------------->
      <div class="bloco_destaque">
        <table style="width:100%">
          <tr width="100%">
            <td colspan="4" class="seta_nome">
              <h3><span>SETA CURSOS </span><span id='title_recibo_pag'>RECIBO DE PAGAMENTO</span></h3>
            </td>
            <td colspan="1" class='n_lanc'><b>Nº Lanç.</b> ${folha.n_lanc}</td>
          </tr>
          <tr>
            <td colspan="5">
              <b>Responsável: </b
              ><span class="responsavel">${folha.responsavel}</span>
            </td>
          </tr>
          <tr>
            <td colspan="5">
              <b>Aluno(a): </b><span class="responsavel">${folha.aluno}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span class="label_top"><b>Parcela</b></span>
              <span class="value"> ${folha.parcela}</span>
            </td>
            <td>
              <span class="label_top"><b>Vencimento</b></span>
              <span class="value"> ${folha.f_data_vencimento}</span>
            </td>
            <td>
              <span class="label_top"><b>Valor</b></span>
              <span class="value"> R$ ${folha.f_valor}</span>
            </td>
            <td>
              <span class="label_top"><b>Desconto</b></span>
              <span class="value"> R$ ${folha.f_desconto} </span>
            </td>
            <td>
              <span class="label_top"><b>Valor Total</b></span>
              <span class="valor_total">
                <span class="cifrao_total">R$</span> <b>${folha.f_valor_total}</b></span
              >
            </td>
          </tr>
          <tr>
            <td colspan="5">
              <b>Curso: </b><span class="curso">${folha.curso}</span>
            </td>
          </tr>
          <tr>
            <td colspan="5"><b>Obs.: </b></td>
          </tr>
          <tr>
            <td colspan="4"></td>
            <td><span class="RA">Via do aluno: RA${folha.f_RA}</span></td>
          </tr>
          <tr>
            <td colspan="5" class="ass">
              <span class="ass_label">Ass.: </span
              ><span class="data_destaque">Data ___/___/____</span>
              <hr />
            </td>
          </tr>
        </table>
      </div>
    </div>  
      `
    );

    
}