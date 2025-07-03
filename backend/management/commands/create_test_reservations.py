from django.core.management.base import BaseCommand
from datetime import datetime, timedelta
from decimal import Decimal
from api.models import *

class Command(BaseCommand):
    help = 'Crea 5 reservas de prueba en la base de datos'

    def handle(self, *args, **options):
        self.stdout.write("🚗 Creando 5 reservas de prueba...")
        
        # Verificar si ya existen reservas
        if Alquiler.objects.exists():
            self.stdout.write(self.style.WARNING("⚠️  Ya existen reservas en la base de datos."))
            return
        
        # Obtener o crear datos necesarios
        cliente_rol = Rol.objects.get_or_create(nombre='Cliente')[0]
        localidad = Localidad.objects.get_or_create(nombre='La Plata')[0]
        sucursal = Sucursal.objects.get_or_create(
            nombre='Sucursal Central',
            defaults={'telefono': '1234567890', 'localidad': localidad, 'direccion': 'Av. Principal 123'}
        )[0]
        
        # Crear usuarios de prueba
        usuarios = []
        for i in range(1, 4):
            usuario, created = Usuario.objects.get_or_create(
                email=f'cliente{i}@test.com',
                defaults={
                    'first_name': f'Cliente{i}',
                    'last_name': f'Test{i}',
                    'telefono': f'123456789{i}',
                    'fecha_nacimiento': '1990-01-01',
                    'rol': cliente_rol
                }
            )
            if created:
                usuario.set_password('Cliente123')
                usuario.save()
                self.stdout.write(f"✅ Usuario creado: {usuario.first_name} {usuario.last_name}")
            usuarios.append(usuario)
        
        # Crear vehículos de prueba
        categoria = Categoria.objects.get_or_create(nombre='Mediano', defaults={'precio': Decimal('12000.00')})[0]
        marca = Marca.objects.get_or_create(nombre='Toyota')[0]
        modelo = Modelo.objects.get_or_create(nombre='Corolla')[0]
        politica = PoliticaDeCancelacion.objects.get_or_create(
            nombre='Política 20%', 
            defaults={'descripcion': 'Devolución del 20%', 'porcentaje': Decimal('20.00')}
        )[0]
        estado_vehiculo = EstadoVehiculo.objects.get_or_create(nombre='Disponible')[0]
        
        vehiculos = []
        for i in range(1, 6):
            vehiculo, created = Vehiculo.objects.get_or_create(
                patente=f'ABC12{i}',
                defaults={
                    'marca': marca,
                    'modelo': modelo,
                    'categoria': categoria,
                    'politica': politica,
                    'estado': estado_vehiculo,
                    'sucursal': sucursal,
                    'capacidad': 5,
                    'año_fabricacion': 2020
                }
            )
            if created:
                self.stdout.write(f"✅ Vehículo creado: {vehiculo.patente}")
            vehiculos.append(vehiculo)
        
        # Crear estados de alquiler
        estados = {
            'confirmado': EstadoAlquiler.objects.get_or_create(nombre='Confirmado')[0],
            'cancelado': EstadoAlquiler.objects.get_or_create(nombre='Cancelado')[0],
            'finalizado': EstadoAlquiler.objects.get_or_create(nombre='Finalizado')[0]
        }
        
        # Crear 5 reservas
        reservas_data = [
            {
                'cliente': usuarios[0],
                'vehiculo': vehiculos[0],
                'fecha_inicio': datetime.now() + timedelta(days=1),
                'fecha_fin': datetime.now() + timedelta(days=3),
                'estado': estados['confirmado'],
                'descripcion': 'Reserva confirmada para mañana'
            },
            {
                'cliente': usuarios[1],
                'vehiculo': vehiculos[1],
                'fecha_inicio': datetime.now() + timedelta(days=5),
                'fecha_fin': datetime.now() + timedelta(days=7),
                'estado': estados['confirmado'],
                'descripcion': 'Reserva confirmada para la próxima semana'
            },
            {
                'cliente': usuarios[2],
                'vehiculo': vehiculos[2],
                'fecha_inicio': datetime.now() - timedelta(days=2),
                'fecha_fin': datetime.now() - timedelta(days=1),
                'estado': estados['finalizado'],
                'descripcion': 'Reserva finalizada (ya se devolvió)'
            },
            {
                'cliente': usuarios[0],
                'vehiculo': vehiculos[3],
                'fecha_inicio': datetime.now() + timedelta(days=10),
                'fecha_fin': datetime.now() + timedelta(days=12),
                'estado': estados['cancelado'],
                'descripcion': 'Reserva cancelada por el cliente'
            },
            {
                'cliente': usuarios[1],
                'vehiculo': vehiculos[4],
                'fecha_inicio': datetime.now() + timedelta(days=15),
                'fecha_fin': datetime.now() + timedelta(days=18),
                'estado': estados['confirmado'],
                'descripcion': 'Reserva confirmada para dentro de 2 semanas'
            }
        ]
        
        for i, res_data in enumerate(reservas_data, 1):
            dias = (res_data['fecha_fin'] - res_data['fecha_inicio']).days
            monto_total = categoria.precio * dias
            
            reserva = Alquiler.objects.create(
                cliente=res_data['cliente'],
                vehiculo=res_data['vehiculo'],
                fecha_inicio=res_data['fecha_inicio'],
                fecha_fin=res_data['fecha_fin'],
                monto_total=monto_total,
                estado=res_data['estado'],
                sucursal_devolucion=sucursal
            )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f"✅ Reserva {i} creada: {res_data['cliente'].first_name} - "
                    f"{res_data['vehiculo'].patente} - {res_data['estado'].nombre} - "
                    f"${monto_total} - {res_data['descripcion']}"
                )
            )
        
        self.stdout.write(
            self.style.SUCCESS(f"🎉 ¡5 reservas creadas! Total: {Alquiler.objects.count()}")
        )
        
        # Mostrar resumen
        self.stdout.write("\n📋 Resumen de estados:")
        for estado in EstadoAlquiler.objects.all():
            count = Alquiler.objects.filter(estado=estado).count()
            self.stdout.write(f"   - {estado.nombre}: {count} reservas") 