from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            # Forward SQL - Renombrar columnas
            sql='''
            ALTER TABLE alquiler RENAME COLUMN IDEstado TO ID_Estado;
            ALTER TABLE alquiler RENAME COLUMN vehiculo_id TO ID_Vehiculo;
            ALTER TABLE alquiler RENAME COLUMN cliente_id TO ID_Usuario;
            ''',
            # Reverse SQL - Revertir cambios
            reverse_sql='''
            ALTER TABLE alquiler RENAME COLUMN ID_Estado TO IDEstado;
            ALTER TABLE alquiler RENAME COLUMN ID_Vehiculo TO vehiculo_id;
            ALTER TABLE alquiler RENAME COLUMN ID_Usuario TO cliente_id;
            '''
        ),
    ] 