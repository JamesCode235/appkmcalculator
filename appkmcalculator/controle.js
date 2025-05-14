// Função para carregar e exibir o histórico
function carregarHistorico() {
    const registros = JSON.parse(localStorage.getItem('registros') || '[]');
    const tbody = document.getElementById('corpo-tabela');
    
    if (registros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Nenhum registro encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = registros.map(registro => `
        <tr>
            <td>${new Date(registro.data).toLocaleString()}</td>
            <td>${registro.nome}</td>
            <td>${registro.veiculo} ${registro.tipoCarro ? `- ${registro.tipoCarro}` : ''}</td>
            <td>${registro.distancia} km</td>
            <td>R$ ${registro.valor.toFixed(2)}</td>
            <td>
                <button onclick="excluirRegistro(${registro.id})" class="btn-excluir">Excluir</button>
            </td>
        </tr>
    `).join('');
}

// Função para excluir registro
function excluirRegistro(id) {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
        let registros = JSON.parse(localStorage.getItem('registros') || '[]');
        registros = registros.filter(registro => registro.id !== id);
        localStorage.setItem('registros', JSON.stringify(registros));
        carregarHistorico();
    }
}

// Função para filtrar registros
function filtrarRegistros() {
    const filtroNome = document.getElementById('filtro-nome').value.toLowerCase();
    const filtroData = document.getElementById('filtro-data').value;
    
    const linhas = document.querySelectorAll('#corpo-tabela tr');
    
    linhas.forEach(linha => {
        const nome = linha.children[1].textContent.toLowerCase();
        const data = linha.children[0].textContent;
        
        const matchNome = nome.includes(filtroNome);
        const matchData = !filtroData || data.includes(filtroData);
        
        linha.style.display = matchNome && matchData ? '' : 'none';
    });
}

// Carregar histórico quando a página carregar
document.addEventListener('DOMContentLoaded', carregarHistorico);
