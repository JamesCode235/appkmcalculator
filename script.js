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
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const veiculo = veiculoSelect.value;
  const distancia = parseFloat(document.getElementById('distancia').value);

  let tarifa = 0;

  if (veiculo === 'carro') {
    const tipoCarro = categoriaCarroSelect.value;
    const tarifasCarro = {
      popular: 1.0,
      sedan_medio: 1.2,
      sedan_grande: 1.4,
      suv_medio: 1.6,
      suv_grande: 1.8
    };
    tarifa = tarifasCarro[tipoCarro] || 1.0;
  } else {
    const tarifas = {
      moto: 0.6,
      van: 1.5
    };
    tarifa = tarifas[veiculo] || 1.0;
  }

  const valorTotal = distancia * tarifa;
  resultadoDiv.textContent = `${nome}, o valor devido é R$ ${valorTotal.toFixed(2)} (${distancia} km de ${veiculo}).`;
});
