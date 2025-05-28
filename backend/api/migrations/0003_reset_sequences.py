from django.db import migrations

def reset_sequences(apps, schema_editor):
    if schema_editor.connection.vendor == 'postgresql':
        schema_editor.execute("""
            DO $$ 
            DECLARE
                r RECORD;
            BEGIN
                FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                    EXECUTE 'ALTER SEQUENCE IF EXISTS ' || r.tablename || '_id_seq RESTART WITH 1';
                END LOOP;
            END $$;
        """)

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0002_initial_estados'),
    ]

    operations = [
        migrations.RunPython(reset_sequences),
    ] 