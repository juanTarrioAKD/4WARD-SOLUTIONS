import sqlite3

def restaurar_base_de_datos():
    try:
        # Leer el archivo SQL
        print("Leyendo el archivo de respaldo...")
        with open('backup_db.sql', 'r', encoding='utf-8') as sql_file:
            sql_script = sql_file.read()

        # Separar el script en comandos individuales
        print("Procesando comandos SQL...")
        sql_commands = sql_script.split(';')

        # Conectar a la base de datos
        print("Conectando a la base de datos...")
        conn = sqlite3.connect('db.sqlite3')
        cursor = conn.cursor()

        # Desactivar las restricciones de clave foránea temporalmente
        cursor.execute('PRAGMA foreign_keys=OFF')
        
        # Ejecutar cada comando por separado
        for command in sql_commands:
            command = command.strip()
            if command:
                try:
                    cursor.execute(command + ';')
                except sqlite3.Error as e:
                    print(f"Error al ejecutar comando: {e}")
                    print(f"Comando problemático: {command[:100]}...")
                    continue

        # Activar las restricciones de clave foránea nuevamente
        cursor.execute('PRAGMA foreign_keys=ON')

        # Confirmar los cambios y cerrar la conexión
        conn.commit()
        conn.close()

        print("¡Base de datos restaurada exitosamente!")
    except Exception as e:
        print(f"Error al restaurar la base de datos: {e}")

if __name__ == "__main__":
    restaurar_base_de_datos() 