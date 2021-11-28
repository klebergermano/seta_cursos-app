 function TemplateTalaoFolhas (talaoInfo){
   let dataVencimento = new Date(talaoInfo.vencimento + ', 00:00:00');
      let ano = dataVencimento.getFullYear();
      let mes = (dataVencimento.getMonth() + 1).toString().padStart(2, '0'); // Meses são contador apartir do 0 no js +1 corrigi isso
      let dia = dataVencimento.getDate().toString().padStart(2, '0');
      let f_data_vencimento = dia + "/" + mes + "/" + ano;

      let f_valor = talaoInfo.valor;
      let f_desconto = talaoInfo.desconto;
      let f_valor_total = talaoInfo.valor_total;

let f_parcela = talaoInfo.num_parcela + '/'+ talaoInfo.parcelas_total;
    return (
        `
      <div class="bg_boleto">
      <div class="bloco_cliente">
        <table style="width:100%">
          <tr width="100%">
            <td colspan="10">
              <b>Responsável:</b>
              <span class="responsavel_cliente">${talaoInfo.responsavel}</span>
            </td>
          </tr>
          <tr>
            <td class="font_6" colspan="6">
              <b>Aluno(a):</b
              ><span class="aluno_cliente"> ${talaoInfo.aluno}</span>
            </td>
          </tr>
  
          <tr>
            <td class="font_6" colspan="1">
              <span class="label_top"><b>Nº Lanç.</b></span>
             <span class='n_lanc_cliente'> ${talaoInfo.n_lanc}</span>
            </td>
  
            <td colspan="1">
              <span class="label_top"><b>Parcela</b></span>
             ${f_parcela}
            </td>
            <td colspan="1">
              <span class="label_top"><b>Vencimento</b></span>
              ${f_data_vencimento}
            </td>
          </tr>
  
          <tr>
            <td colspan="1">
              <span class="label_top"><b>Valor</b></span>
              R$ ${f_valor}
            </td>
            <td colspan="1">
              <span class="label_top"><b>Desconto</b></span>
  
              R$ ${f_desconto}
            </td>
            <td colspan="1">
              <span class="label_top"><b>Valor Total</b></span>
  
             <b> R$ ${f_valor_total}</b>
            </td>
          </tr>
          <tr>
            <td colspan="5">
              <b>Curso:</b><span class="curso_cliente"> ${talaoInfo.curso}</span>
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
              <span class="RA_cliente">Via da escola: ${talaoInfo.ra}</span>
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
              <h3><span id='seta_nome'>SETA CURSOS </span><span id='title_recibo_pag'>RECIBO DE PAGAMENTO</span></h3>
            </td>
            <td colspan="1" class='n_lanc'><b>Nº Lanç.</b> ${talaoInfo.n_lanc}</td>
          </tr>
          <tr>
            <td colspan="5">
              <b>Responsável: </b
              ><span class="responsavel">${talaoInfo.responsavel}</span>
            </td>
          </tr>
          <tr>
            <td colspan="5">
              <b>Aluno(a): </b><span class="responsavel">${talaoInfo.aluno}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span class="label_top"><b>Parcela</b></span>
              <span class="value"> ${f_parcela}</span>
            </td>
            <td>
              <span class="label_top"><b>Vencimento</b></span>
              <span class="value"> ${f_data_vencimento}</span>
            </td>
            <td>
              <span class="label_top"><b>Valor</b></span>
              <span class="value"> R$ ${f_valor}</span>
            </td>
            <td>
              <span class="label_top"><b>Desconto</b></span>
              <span class="value"> R$ ${f_desconto} </span>
            </td>
            <td>
              <span class="label_top"><b>Valor Total</b></span>
              <span class="valor_total">
                <span class="cifrao_total">R$</span> <b>${f_valor_total}</b></span
              >
            </td>
          </tr>
          <tr>
            <td colspan="5">
              <b>Curso: </b><span class="curso">${talaoInfo.curso}</span>
            </td>
          </tr>
          <tr>
            <td colspan="5"><b>Obs.: </b></td>
          </tr>
          <tr>
            <td colspan="4"></td>
            <td><span class="RA">Via do aluno: RA${talaoInfo.ra}</span></td>
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

module.exports = TemplateTalaoFolhas;