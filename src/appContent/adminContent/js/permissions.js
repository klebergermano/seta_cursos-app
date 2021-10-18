const permissions = {
    admin: {
        homepage: true,
        controle_aula: true,
        gerador_contrato: true,
        users: true,
        fluxo_caixa: true
    },
    professor: {
        home: true,
        controle_aula: true,
        gerador_contrato: true,
        users: false,
        fluxo_caixa: false
    },
    atendente: {
        home: true,
        controle_aula: true,
        gerador_contrato: true,
        users: false,
        fluxo_caixa: false
    }
}

export default permissions;