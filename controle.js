// Função para carregar os registros
async function carregarRegistros() {
    try {
        const response = await fetch('http://localhost:3000/visitas');
        const visitas = await response.json();
        
        const tbody = document.getElementById('corpo-tabela');
        tbody.innerHTML = '';
        
        visitas.forEach(visita => {
            const tr = document.createElement('tr');
            
            // Calcular o valor baseado na categoria do veículo
            let tarifa = 0;
            if (visita.categoria_veiculo === 'carro') {
                const tarifasCarro = {
                    'popular': 1.0,
                    'sedan_medio': 1.2,
                    'sedan_grande': 1.4,
                    'suv_medio': 1.6,
                    'suv_grande': 1.8
                };
                tarifa = tarifasCarro[visita.tipo_carro] || 1.0;
            } else {
                const tarifas = {
                    'moto': 0.6,
                    'van': 1.5
                };
                tarifa = tarifas[visita.categoria_veiculo] || 1.0;
            }
            
            const valorTotal = visita.distancia * tarifa;
            
            tr.innerHTML = `
                <td>${new Date(visita.data_registro).toLocaleString()}</td>
                <td>${visita.nome_funcionario}</td>
                <td>${visita.categoria_veiculo} ${visita.tipo_carro ? `- ${visita.tipo_carro}` : ''}</td>
                <td>${visita.distancia} km</td>
                <td>R$ ${valorTotal.toFixed(2)}</td>
                <td>
                    <button onclick="excluirRegistro(${visita.id})" class="btn-excluir">Excluir</button>
                </td>
            `;
            
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar registros:', error);
        alert('Erro ao carregar registros');
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

// Função para excluir registro
async function excluirRegistro(id) {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
        try {
            const response = await fetch(`http://localhost:3000/visitas/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Registro excluído com sucesso!');
                carregarRegistros();
            } else {
                throw new Error('Erro ao excluir registro');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao excluir registro');
        }
    }
}

// Carregar registros quando a página carregar
document.addEventListener('DOMContentLoaded', carregarRegistros);
