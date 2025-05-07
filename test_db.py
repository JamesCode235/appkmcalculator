import sqlite3

def testar_banco():
    try:
        # Conectar ao banco de dados
        conn = sqlite3.connect('visitas.db')
        c = conn.cursor()
        
        # Verificar se a tabela existe
        c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='visitas';")
        if c.fetchone():
            print("✅ Tabela 'visitas' existe")
        else:
            print("❌ Tabela 'visitas' não existe")
        
        # Contar registros
        c.execute("SELECT COUNT(*) FROM visitas;")
        count = c.fetchone()[0]
        print(f"📊 Total de registros: {count}")
        
        # Listar últimos 5 registros
        c.execute("SELECT * FROM visitas ORDER BY data_registro DESC LIMIT 5;")
        registros = c.fetchall()
        print("\nÚltimos 5 registros:")
        for reg in registros:
            print(f"ID: {reg[0]}")
            print(f"Nome: {reg[1]}")
            print(f"Veículo: {reg[2]}")
            print(f"Tipo Carro: {reg[3]}")
            print(f"Distância: {reg[4]} km")
            print(f"Data: {reg[6]}")
            print("-" * 30)
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Erro ao testar banco de dados: {str(e)}")

if __name__ == "__main__":
    testar_banco()
