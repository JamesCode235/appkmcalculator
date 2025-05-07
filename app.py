from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuração do banco de dados
def init_db():
    conn = sqlite3.connect('visitas.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS visitas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_funcionario TEXT NOT NULL,
            categoria_veiculo TEXT NOT NULL,
            tipo_carro TEXT,
            distancia REAL NOT NULL,
            foto_url TEXT,
            data_registro DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Inicializar o banco de dados
init_db()

# Servir arquivos estáticos
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# Rota para salvar visita
@app.route('/visitas', methods=['POST'])
def salvar_visita():
    try:
        data = request.json
        conn = sqlite3.connect('visitas.db')
        c = conn.cursor()
        
        c.execute('''
            INSERT INTO visitas (nome_funcionario, categoria_veiculo, tipo_carro, distancia, foto_url)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            data['nome'],
            data['veiculo'],
            data['categoriaCarro'],
            data['distancia'],
            data['foto']
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Visita registrada com sucesso", "id": c.lastrowid})
    except Exception as e:
        print("Erro ao salvar visita:", str(e))  # Log do erro
        return jsonify({"error": str(e)}), 400

# Rota para listar visitas
@app.route('/visitas', methods=['GET'])
def listar_visitas():
    try:
        conn = sqlite3.connect('visitas.db')
        c = conn.cursor()
        
        c.execute('SELECT * FROM visitas ORDER BY data_registro DESC')
        visitas = c.fetchall()
        
        conn.close()
        
        # Converter para lista de dicionários
        resultado = []
        for visita in visitas:
            resultado.append({
                "id": visita[0],
                "nome_funcionario": visita[1],
                "categoria_veiculo": visita[2],
                "tipo_carro": visita[3],
                "distancia": visita[4],
                "foto_url": visita[5],
                "data_registro": visita[6]
            })
        
        return jsonify(resultado)
    except Exception as e:
        print("Erro ao listar visitas:", str(e))  # Log do erro
        return jsonify({"error": str(e)}), 400

# Rota para excluir visita
@app.route('/visitas/<int:id>', methods=['DELETE'])
def excluir_visita(id):
    try:
        conn = sqlite3.connect('visitas.db')
        c = conn.cursor()
        
        c.execute('DELETE FROM visitas WHERE id = ?', (id,))
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Visita excluída com sucesso"})
    except Exception as e:
        print("Erro ao excluir visita:", str(e))  # Log do erro
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=3000)
