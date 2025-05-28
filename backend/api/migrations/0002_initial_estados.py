from django.db import migrations

def crear_estados_alquiler(apps, schema_editor):
    EstadoAlquiler = apps.get_model('api', 'EstadoAlquiler')
    estados = [
        {'id': 1, 'nombre': 'Pendiente'},
        {'id': 2, 'nombre': 'Confirmado'},
        {'id': 3, 'nombre': 'Cancelado'},
        {'id': 4, 'nombre': 'Finalizado'}
    ]
    for estado in estados:
        EstadoAlquiler.objects.get_or_create(id=estado['id'], defaults={'nombre': estado['nombre']})

def eliminar_estados_alquiler(apps, schema_editor):
    EstadoAlquiler = apps.get_model('api', 'EstadoAlquiler')
    EstadoAlquiler.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(crear_estados_alquiler, eliminar_estados_alquiler),
    ] 