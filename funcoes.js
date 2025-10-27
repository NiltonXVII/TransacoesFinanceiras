$(document).ready(function () {
    limpar_formulario();

    $('#btn_salvar_transacao').on('click', function (e) {
        e.preventDefault();
        salvar_transacao();
    });

    $('#btn_alterar_transacao').on('click', function (e) {
        e.preventDefault();
        alterar_transacao();
    });

    $('#btn_excluir_transacao').on('click', function () {
        excluir_transacao();
    });

    $('#btn_pesquisar').on('click', function () {
        buscar_transacao_por_nome();
    });
});

function exibir_mensagem_sistema(texto, tipo = 'sucesso') {
    const $mensagem = $('#mensagem_sistema');

    $mensagem.removeClass('alert_sucesso alert_alerta alert_busca alert_erro d-none');

    switch (tipo) {
        case 'sucesso':
            $mensagem.addClass('alert_sucesso');
            break;
        case 'alerta':
            $mensagem.addClass('alert_alerta');
            break;
        case 'busca':
            $mensagem.addClass('alert_busca');
            break;
        case 'erro':
            $mensagem.addClass('alert_erro');
            break;
    }

    $mensagem.text(texto).fadeIn();

    setTimeout(() => {
        $mensagem.fadeOut(400, () => {
            $mensagem.addClass('d-none');
        });
    }, 5000);
}

function coletar_dados_transacao() {
    const valor_bruto = $('#valor_transacao').val().replace(',', '.');

    return {
        nome: $('#nome_transacao').val().trim(),
        descricao: $('#descricao_transacao').val().trim(),
        valor: parseFloat(valor_bruto),
        data: $('#dta_transacao').val(),
        categoria: $('#categoria_transacao').val().trim(),
        tipo: $('input[name="tipo"]:checked').val()
    };
}

function preencher_formulario(transacao) {
    $('#nome_transacao').val(transacao.nome);
    $('#descricao_transacao').val(transacao.descricao);
    $('#valor_transacao').val(transacao.valor);
    const data_formatada = transacao.data?.substring(0, 10) || '';
    $('#dta_transacao').val(data_formatada);
    $('#categoria_transacao').val(transacao.categoria);
    $(`#tipo_${transacao.tipo.toLowerCase()}`).prop('checked', true);
    $('#btn_excluir_transacao').prop('disabled', false);
}

function limpar_formulario() {
    $('#formulario_transacao')[0].reset();
    $('#btn_excluir_transacao').prop('disabled', true);
    $('#txt_pesquisa').val('');
}

function salvar_transacao() {
    const dados = coletar_dados_transacao();

    const campos_obrigatorios = [
        dados.nome,
        dados.descricao,
        dados.valor,
        dados.data,
        dados.tipo
    ];

    if (campos_obrigatorios.some(campo => !campo || campo.toString().trim() === '')) {
        exibir_mensagem_sistema('Preencha todos os campos obrigatórios.', 'erro');
        return;
    }

    if (!['Receita', 'Despesa'].includes(dados.tipo)) {
        exibir_mensagem_sistema('Tipo de transação inválido.', 'erro');
        return;
    }

    if (isNaN(dados.valor) || dados.valor <= 0) {
        exibir_mensagem_sistema('Valor inválido.', 'erro');
        return;
    }

    $.ajax({
        url: 'http://localhost:3000/api/transacoes',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dados),
        success: function (resposta) {
            exibir_mensagem_sistema(resposta.mensagem || 'Transação salva com sucesso!', 'sucesso');
            limpar_formulario();
        },
        error: function (xhr) {
            exibir_mensagem_sistema('Erro ao salvar transação: ' + xhr.status, 'erro');
            console.error(xhr.responseText);
        }
    });
}

function alterar_transacao() {
    const nome = $('#nome_transacao').val().trim();

    if (!nome) {
        exibir_mensagem_sistema('Informe o nome da transação para alteração.', 'erro');
        return;
    }

    const dados = coletar_dados_transacao();

    $.ajax({
        url: `http://localhost:3000/api/transacoes/${encodeURIComponent(nome)}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(dados),
        success: function (resposta) {
            exibir_mensagem_sistema(resposta.mensagem || 'Transação alterada com sucesso!', 'sucesso');
            limpar_formulario();
        },
        error: function (xhr) {
            exibir_mensagem_sistema('Erro ao alterar transação: ' + xhr.status, 'erro');
            console.error(xhr.responseText);
        }
    });
}

function excluir_transacao() {
    const nome = $('#nome_transacao').val().trim();

    if (!nome) {
        exibir_mensagem_sistema('Informe o nome da transação para exclusão.', 'erro');
        return;
    }

    const modal = new bootstrap.Modal(document.getElementById('modal_confirmacao_exclusao'));
    modal.show();

    $('#btn_confirmar_exclusao').off('click').on('click', function () {
        $.ajax({
            url: `http://localhost:3000/api/transacoes/${encodeURIComponent(nome)}`,
            method: 'DELETE',
            success: function (resposta) {
                exibir_mensagem_sistema(resposta.mensagem || 'Transação excluída com sucesso!', 'erro');
                limpar_formulario();
                modal.hide();
            },
            error: function (xhr) {
                exibir_mensagem_sistema('Erro ao excluir transação: ' + xhr.status, 'erro');
                console.error(xhr.responseText);
                modal.hide();
            }
        });
    });
}


function buscar_transacao_por_nome() {
    const nome = $('#txt_pesquisa').val().trim();

    if (!nome) {
        exibir_mensagem_sistema('Informe o nome para buscar.', 'erro');
        return;
    }

    $.get(`http://localhost:3000/api/transacoes/${encodeURIComponent(nome)}`, function (transacao_encontrada) {
        preencher_formulario(transacao_encontrada);
    }).fail(function (xhr) {
        exibir_mensagem_sistema('Transação não encontrada: ' + xhr.status, 'erro');
        console.error(xhr.responseText);
    });
}
