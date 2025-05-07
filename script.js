// script.js

// Elementos do DOM
const form = document.getElementById('trip-form');
const veiculoSelect = document.getElementById('veiculo');
const categoriaCarroDiv = document.getElementById('categoria-carro-div');
const categoriaCarroSelect = document.getElementById('categoria-carro');
const resultadoDiv = document.getElementById('resultado');
const inputFoto = document.getElementById('foto');
const previewImg = document.getElementById('preview');

// Mostrar/esconder tipo de carro
function toggleCategoriaCarro() {
  if (veiculoSelect.value === 'carro') {
    categoriaCarroDiv.style.display = 'block';
  } else {
    categoriaCarroDiv.style.display = 'none';
  }
}

veiculoSelect.addEventListener('change', toggleCategoriaCarro);
window.addEventListener('DOMContentLoaded', toggleCategoriaCarro);

// Pré-visualização da imagem
inputFoto.addEventListener('change', function () {
  const file = inputFoto.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewImg.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

// Envio do formulário e cálculo
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const veiculo = veiculoSelect.value;
  const distancia = parseFloat(document.getElementById('distancia').value);
  const categoriaCarro = document.getElementById('categoria-carro').value;
  const foto = document.getElementById('preview').src;

  const formData = {
    nome: nome,
    veiculo: veiculo,
    categoriaCarro: categoriaCarro,
    distancia: distancia,
    foto: foto
  };

  try {
    console.log('Enviando dados:', formData); // Log para debug

    const response = await fetch('http://localhost:3000/visitas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    console.log('Resposta do servidor:', data); // Log para debug

    if (data.error) {
      throw new Error(data.error);
    }

    alert('Visita registrada com sucesso!');
    
    // Limpar formulário
    this.reset();
    document.getElementById('preview').style.display = 'none';
    
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao registrar visita: ' + error.message);
  }
});

// Função para carregar e exibir visitas
async function carregarVisitas() {
  try {
    const response = await fetch('http://localhost:3000/visitas');
    const visitas = await response.json();
    
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '<h2>Registros de Visitas</h2>';
    
    if (visitas.length === 0) {
      resultadoDiv.innerHTML += '<p>Nenhuma visita registrada.</p>';
      return;
    }

    const tabela = document.createElement('table');
    tabela.innerHTML = `
      <thead>
        <tr>
          <th>Data</th>
          <th>Funcionário</th>
          <th>Veículo</th>
          <th>Distância</th>
        </tr>
      </thead>
      <tbody>
        ${visitas.map(visita => `
          <tr>
            <td>${new Date(visita.data_registro).toLocaleString()}</td>
            <td>${visita.nome_funcionario}</td>
            <td>${visita.categoria_veiculo} ${visita.tipo_carro ? `- ${visita.tipo_carro}` : ''}</td>
            <td>${visita.distancia} km</td>
          </tr>
        `).join('')}
      </tbody>
    `;
    
    resultadoDiv.appendChild(tabela);
  } catch (error) {
    console.error('Erro ao carregar visitas:', error);
  }
}

// Carregar visitas quando a página carregar
document.addEventListener('DOMContentLoaded', carregarVisitas);
