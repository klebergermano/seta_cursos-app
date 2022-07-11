const folhasTalao = require('./TemplateTalaoFolhas.cjs');
const TemplateTalao = (talaoInfo) => {
  let talao = '';
  talaoInfo.forEach((item) => {
    talao += folhasTalao(item)
  });  
  return (`
    <!DOCTYPE>
    <html>
      <head>
        <title></title>
        <meta http-equiv="Content-Language" content="pt-br">
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Archivo+Black|Roboto:500&display=swap" rel="stylesheet" />
        <!-- 7.4347cm -->
          <style>
          @import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap');
            * { box-sizing: border-box; margin:0px; padding:0px;  }
            .a4 {  
              font-family: 'Noto Sans', sans-serif;
             width: 21cm; height: auto; overflow: hidden; margin: 0 auto; 
            background: #f0f0f0; }
            #title_recibo_pag{
               padding-left:10px; color:#111; font-weight:bold;
            }
            .margen_grampo{ position:absolute;   height: 280px; width:1.6cm; left:0px; top:0px; pandding: 2cm; }
            .margen_grampo span{ display:block; clear:both; margin: auto; margin-top:1cm; height: 0.5cm; width: 2px !important; max-width:2px !important;  background:#ddd; border-radius:5px; overflow:hidden;  }
            .margen_grampo span:first-child{ margin-top:1.2cm !important;}
            .bg_boleto {width: 21cm; position:relative; display:table; height: 280px; background: #fff;  overflow:hidden; border-bottom:1px dotted #ccc}
            .bg_boleto:nth-child(4n) { margin-bottom:3px; border-bottom:0px;}
            .bloco_cliente{   line-height:22px; display: table-cell; vertical-align: middle; padding: 0cm 0.4cm 0cm 1.5cm;  width: 8.6cm; height: 7cm; border-right: 1px dotted #ccc; }
            .bloco_escola {  display: table-cell;  vertical-align: middle; padding: 0cm 0.4cm 0cm 0.4cm;  line-height:12px !important;
               background:rgba(255, 255, 00, 0.15); width: 12.1cm; height: 7cm; border-right: 1px dotted #fff; }
            table,th,td { border: 1px solid #bbb; border-collapse: collapse; }
            td { padding: 0px 4px 0px 10px;  font-size: 13px; height:25px; }
            .font_6 { font-size: 10px; }
            .label_top { font-weight: bold; clear: both; display: block; font-size: 9px;  margin-bottom:-3px;  }
            .value { font-size: 12px; }
            .valor_total { font-size: 14px; }
            .seta_nome { padding: 8px 10px !important; }
            .seta_nome span { font-weight: bold;  height: 35px; }
            .RA { font-size: 8px; }
            hr {  margin-top: 25px;}
            .ass {padding: 4px 8px; border-bottom: 0px; border-left: 0px !important; }
            .ass_label { margin-top: 10px; float: left;  padding: 0 10px 0px 0px;}
            .data_destaque {margin-top: 10px; float: right; padding: 0px 10px; }
            .curso { font-size: 12px;  padding: 0 5px;  text-transform: uppercase; }
            h3 { padding: 0px; margin-top: 0px; margin-bottom: 0px;   float: left; }
            b { letter-spacing: 0px;  font-size: 11px; color: #222;  font-weight:bold;}
            .bloco_cliente td { font-size: 11px;   }
            .cifrao_total {font-size: 13px;}
            .bloco_cliente b { font-size: 10px;}
            .data_cliente { height: 30px;}
            .RA_cliente { font-size: 9px !important;}
            .n_lanc_cliente { font-size: 10px !important;}
            .n_lanc { font-size: 10px !important;}
            .n_lanc b { font-weight:bold; font-size:9px; }
            .curso_cliente { font-size: 12px; padding: 0 5px; text-transform: uppercase;}
            .responsavel,.responsavel_cliente,.aluno,
            .aluno_cliente {}
            #seta_nome{ font-weight:normal !important; }
            .data_escola{text-align: right; padding-right:10px;}
          </style>
      </head>
      <body>
        <div class="a4"> 
        ${talao}
        </div>
      </body>
    </html>
    `);
}


module.exports = TemplateTalao;

