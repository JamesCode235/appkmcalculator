// script.js

// Elementos do DOM
const form = document.getElementById('trip-form');
const veiculoSelect = document.getElementById('veiculo');
const categoriaCarroDiv = document.getElementById('categoria-carro-div');
const categoriaCarroSelect = document.getElementById('categoria-carro');
const resultadoDiv = document.getElementById('resultado');

// Mostrar/esconder tipo de carro
function toggleCategoriaCarro() {
    categoriaCarroDiv.style.display = veiculoSelect.value === 'carro' ? 'block' : 'none';
}

// Event listeners
veiculoSelect.addEventListener('change', toggleCategoriaCarro);
window.addEventListener('DOMContentLoaded', toggleCategoriaCarro);

// Função para calcular o valor
function calcularValor(veiculo, tipoCarro, distancia) {
    let tarifa = 0;
    
    if (veiculo === 'carro') {
        const tarifasCarro = {
            'popular': 1.0,
            'sedan_medio': 1.2,
            'sedan_grande': 1.4,
            'suv_medio': 1.6,
            'suv_grande': 1.8
        };
        tarifa = tarifasCarro[tipoCarro] || 1.0;
    } else {
        const tarifas = {
            'moto': 0.6,
            'van': 1.5
        };
        tarifa = tarifas[veiculo] || 1.0;
    }
    
    return distancia * tarifa;
}

// Função para salvar no localStorage
function salvarRegistro(registro) {
    let registros = JSON.parse(localStorage.getItem('registros') || '[]');
    registro.id = Date.now();
    registro.data = new Date().toISOString();
    registros.push(registro);
    localStorage.setItem('registros', JSON.stringify(registros));
}

// Função para exibir o resultado
function exibirResultado(registro) {
    resultadoDiv.innerHTML = `
        <div class="resultado-box">
            <h2>Resultado do Cálculo</h2>
            <p><strong>Funcionário:</strong> ${registro.nome}</p>
            <p><strong>Veículo:</strong> ${registro.veiculo} ${registro.tipoCarro ? `- ${registro.tipoCarro}` : ''}</p>
            <p><strong>Distância:</strong> ${registro.distancia} km</p>
            <p><strong>Valor Total:</strong> R$ ${registro.valor.toFixed(2)}</p>
        </div>
    `;
}

// Função para exibir histórico
function exibirHistorico() {
    const registros = JSON.parse(localStorage.getItem('registros') || '[]');
    
    if (registros.length === 0) return;

    const historicoHTML = `
        <div class="historico">
            <h2>Histórico de Registros</h2>
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Funcionário</th>
                        <th>Veículo</th>
                        <th>Distância</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    ${registros.map(reg => `
                        <tr>
                            <td>${new Date(reg.data).toLocaleString()}</td>
                            <td>${reg.nome}</td>
                            <td>${reg.veiculo} ${reg.tipoCarro ? `- ${reg.tipoCarro}` : ''}</td>
                            <td>${reg.distancia} km</td>
                            <td>R$ ${reg.valor.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    resultadoDiv.insertAdjacentHTML('beforeend', historicoHTML);
}

// Manipulador do formulário
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const veiculo = veiculoSelect.value;
    const distancia = parseFloat(document.getElementById('distancia').value);
    const tipoCarro = categoriaCarroSelect.value;

    // Calcular valor
    const valor = calcularValor(veiculo, tipoCarro, distancia);

    // Criar registro
    const registro = {
        nome,
        veiculo,
        tipoCarro,
        distancia,
        valor
    };

    // Salvar e exibir
    salvarRegistro(registro);
    exibirResultado(registro);
    exibirHistorico();

    // Limpar formulário
    form.reset();
    toggleCategoriaCarro();
});
