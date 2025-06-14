# Generated by Django 5.2.1 on 2025-06-05 02:29

import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
            options={
                'db_table': 'categoria',
            },
        ),
        migrations.CreateModel(
            name='EstadoAlquiler',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'estado_alquiler',
            },
        ),
        migrations.CreateModel(
            name='EstadoVehiculo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'estado_vehiculo',
            },
        ),
        migrations.CreateModel(
            name='Localidad',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'localidad',
            },
        ),
        migrations.CreateModel(
            name='Marca',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'marca',
            },
        ),
        migrations.CreateModel(
            name='Modelo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'modelo',
            },
        ),
        migrations.CreateModel(
            name='PoliticaDeCancelacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('descripcion', models.TextField(max_length=100)),
                ('porcentaje', models.DecimalField(decimal_places=2, max_digits=5)),
            ],
            options={
                'db_table': 'politica_de_cancelacion',
            },
        ),
        migrations.CreateModel(
            name='Puesto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'puesto',
            },
        ),
        migrations.CreateModel(
            name='Rol',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=20, unique=True)),
            ],
            options={
                'db_table': 'rol',
            },
        ),
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('nombre', models.CharField(max_length=100)),
                ('apellido', models.CharField(max_length=100)),
                ('telefono', models.CharField(max_length=20)),
                ('fecha_nacimiento', models.DateField()),
                ('puesto', models.CharField(blank=True, max_length=100, null=True)),
                ('is_locked', models.BooleanField(default=False)),
                ('login_attempts', models.IntegerField(default=0)),
                ('admin_code_attempts', models.IntegerField(default=0)),
                ('last_login_attempt', models.DateTimeField(blank=True, null=True)),
                ('last_admin_code_attempt', models.DateTimeField(blank=True, null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
                ('localidad', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.localidad')),
                ('rol', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.rol')),
            ],
            options={
                'db_table': 'usuario',
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Publicacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('categoria', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.categoria')),
            ],
            options={
                'db_table': 'publicacion',
            },
        ),
        migrations.CreateModel(
            name='Pregunta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comentario', models.TextField()),
                ('usuario', models.ForeignKey(db_column='IDUsuario', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('publicacion', models.ForeignKey(db_column='IDPubli', on_delete=django.db.models.deletion.CASCADE, to='api.publicacion')),
            ],
            options={
                'db_table': 'pregunta',
            },
        ),
        migrations.CreateModel(
            name='Calificacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('puntaje', models.IntegerField()),
                ('usuario', models.ForeignKey(db_column='IDUsuario', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('publicacion', models.ForeignKey(db_column='IDPubli', on_delete=django.db.models.deletion.CASCADE, to='api.publicacion')),
            ],
            options={
                'db_table': 'calificacion',
            },
        ),
        migrations.CreateModel(
            name='Respuesta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comentario', models.TextField()),
                ('usuario', models.ForeignKey(blank=True, db_column='IDUsuario', null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'respuesta',
            },
        ),
        migrations.CreateModel(
            name='Sucursal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('telefono', models.CharField(max_length=20)),
                ('direccion', models.CharField(max_length=200)),
                ('localidad', models.ForeignKey(db_column='ID_Localidad', on_delete=django.db.models.deletion.CASCADE, to='api.localidad')),
            ],
            options={
                'db_table': 'sucursal',
            },
        ),
        migrations.CreateModel(
            name='Vehiculo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('patente', models.CharField(max_length=20, unique=True)),
                ('capacidad', models.IntegerField()),
                ('año_fabricacion', models.IntegerField()),
                ('categoria', models.ForeignKey(db_column='ID_Cate', on_delete=django.db.models.deletion.CASCADE, to='api.categoria')),
                ('estado', models.ForeignKey(db_column='ID_EstVehi', on_delete=django.db.models.deletion.CASCADE, to='api.estadovehiculo')),
                ('marca', models.ForeignKey(db_column='ID_Marca', on_delete=django.db.models.deletion.CASCADE, to='api.marca')),
                ('modelo', models.ForeignKey(db_column='ID_Modelo', on_delete=django.db.models.deletion.CASCADE, to='api.modelo')),
                ('politica', models.ForeignKey(db_column='ID_Politica', on_delete=django.db.models.deletion.CASCADE, to='api.politicadecancelacion')),
                ('sucursal', models.ForeignKey(db_column='ID_Sucursal', on_delete=django.db.models.deletion.CASCADE, to='api.sucursal')),
            ],
            options={
                'db_table': 'vehiculo',
            },
        ),
        migrations.CreateModel(
            name='Foto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('imagen', models.ImageField(upload_to='vehiculos/')),
                ('vehiculo', models.ForeignKey(db_column='IDVehi', on_delete=django.db.models.deletion.CASCADE, to='api.vehiculo')),
            ],
            options={
                'db_table': 'foto',
            },
        ),
        migrations.CreateModel(
            name='Alquiler',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_inicio', models.DateTimeField()),
                ('fecha_fin', models.DateTimeField()),
                ('fecha_reserva', models.DateTimeField(auto_now_add=True)),
                ('monto_total', models.DecimalField(decimal_places=2, max_digits=10)),
                ('cliente', models.ForeignKey(db_column='ID_Usuario', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('estado', models.ForeignKey(db_column='ID_Estado', on_delete=django.db.models.deletion.CASCADE, to='api.estadoalquiler')),
                ('vehiculo', models.ForeignKey(db_column='ID_Vehiculo', on_delete=django.db.models.deletion.CASCADE, related_name='alquileres', to='api.vehiculo')),
            ],
            options={
                'db_table': 'alquiler',
            },
        ),
    ]
