from django.db import migrations, models
import django.db.models.deletion

def fix_alquiler_data(apps, schema_editor):
    Alquiler = apps.get_model('api', 'Alquiler')
    # Eliminar registros de alquiler con vehículos inválidos
    Alquiler.objects.filter(vehiculo__isnull=True).delete()

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_alter_alquiler_cliente_alter_alquiler_estado_and_more'),
    ]

    operations = [
        migrations.RunPython(fix_alquiler_data),
        migrations.AlterField(
            model_name='alquiler',
            name='cliente',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.usuario'),
        ),
        migrations.AlterField(
            model_name='alquiler',
            name='estado',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.estadoalquiler'),
        ),
        migrations.AlterField(
            model_name='alquiler',
            name='vehiculo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.vehiculo'),
        ),
    ] 