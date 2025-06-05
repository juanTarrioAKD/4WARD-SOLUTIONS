import re
import re
from django.utils import timezone
from django.db.models import Q
from django.db.models import Q
from django.db import transaction
from decimal import Decimal

from rest_framework import serializers
from .models import (
    Usuario, Vehiculo, Publicacion,
    Marca, Modelo, EstadoVehiculo, Sucursal, Categoria,
    PoliticaDeCancelacion, Foto, Calificacion, Localidad, Pregunta,
    Alquiler, EstadoAlquiler, Rol
)

def validar_contrasena_segura(password):
        if len(password) < 8:
            raise serializers.ValidationError("La contraseña no cumple con los requisitos de seguridad.")
        if not re.search(r"[A-Z]", password):
            raise serializers.ValidationError("La contraseña no cumple con los requisitos de seguridad.")
        if not re.search(r"\d", password):
            raise serializers.ValidationError("La contraseña no cumple con los requisitos de seguridad.")

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ('id', 'email', 'nombre', 'apellido', 'telefono', 'fecha_nacimiento', 'rol', 'puesto', 'localidad')

class UsuarioCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(required=False, write_only=True)  # No requerimos el username ya que lo generaremos
    rol = serializers.PrimaryKeyRelatedField(queryset=Rol.objects.all(), required=False)

    class Meta:
        model = Usuario
        fields = ('email', 'password', 'nombre', 'apellido', 'telefono', 'fecha_nacimiento', 'rol', 'puesto', 'localidad', 'username')

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('username', None)  # Removemos el username si existe
        # Si no se envía rol, asignar el rol con ID 1 (cliente)
        if 'rol' not in validated_data or validated_data['rol'] is None:
            validated_data['rol'] = Rol.objects.get(pk=1)
        usuario = Usuario(**validated_data)
        usuario.username = validated_data['email']  # Usamos el email como username
        usuario.set_password(password)
        usuario.save()
        return usuario
    
    def validate_password(self, value):
        validar_contrasena_segura(value)
        return value

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = '__all__'

class ModeloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modelo
        fields = '__all__'

class EstadoVehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoVehiculo
        fields = '__all__'

class LocalidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Localidad
        fields = ['id', 'nombre']

class SucursalSerializer(serializers.ModelSerializer):
    localidad = LocalidadSerializer(read_only=True)
    localidad_id = serializers.PrimaryKeyRelatedField(
        queryset=Localidad.objects.all(),
        source='localidad',
        write_only=True
    )

    class Meta:
        model = Sucursal
        fields = ['id', 'nombre', 'telefono', 'localidad', 'localidad_id', 'direccion']

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'precio']

class PoliticaDeCancelacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PoliticaDeCancelacion
        fields = ['id', 'nombre', 'descripcion', 'porcentaje']

class FotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Foto
        fields = '__all__'

class VehiculoSerializer(serializers.ModelSerializer):
    marca = MarcaSerializer(read_only=True)
    modelo = ModeloSerializer(read_only=True)
    modelo = ModeloSerializer(read_only=True)
    estado = EstadoVehiculoSerializer(read_only=True)
    sucursal = SucursalSerializer(read_only=True)
    categoria = CategoriaSerializer(read_only=True)
    politica = PoliticaDeCancelacionSerializer(read_only=True)
    class Meta:
        model = Vehiculo
        fields = '__all__'

class VehiculoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculo
        fields = '__all__'

class PublicacionSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer()
    
    class Meta:
        model = Publicacion
        fields = ['id', 'categoria', 'fecha_creacion', 'imagen']

class PublicacionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publicacion
        fields = ['categoria', 'imagen']

    def to_representation(self, instance):
        """
        Convierte la instancia en una representación después de crear/actualizar.
        """
        return PublicacionSerializer(instance).data

class CalificacionSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)

    class Meta:
        model = Calificacion
        fields = ['id', 'puntaje', 'publicacion', 'usuario']

class CalificacionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calificacion
        fields = ['puntaje', 'publicacion']

    def create(self, validated_data):
        usuario = self.context['request'].user
        return Calificacion.objects.create(usuario=usuario, **validated_data)

class PreguntaSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)

    class Meta:
        model = Pregunta
        fields = ['id', 'publicacion', 'comentario', 'usuario']

class PreguntaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pregunta
        fields = ['publicacion', 'comentario']

    def create(self, validated_data):
        usuario = self.context['request'].user
        return Pregunta.objects.create(usuario=usuario, **validated_data)

class AlquilerSerializer(serializers.ModelSerializer):
    cliente = UsuarioSerializer(read_only=True)
    vehiculo = VehiculoSerializer(read_only=True)
    estado = serializers.StringRelatedField()

    class Meta:
        model = Alquiler
        fields = ['id', 'fecha_inicio', 'fecha_fin', 'fecha_reserva', 'monto_total', 'estado', 'cliente', 'vehiculo']
    
    def cancel(self, instance):
        try:
            with transaction.atomic():
                # Verificar si el alquiler ya está cancelado o finalizado
                if instance.estado.id in [2, 3]:  # 2=Cancelado, 3=Finalizado
                    raise serializers.ValidationError('No se puede cancelar una reserva que ya está cancelada o finalizada')

                # Obtener el estado "Cancelado" (ID 2) para el alquiler
                estado_cancelado = EstadoAlquiler.objects.get(id=2)
                
                # Obtener el estado "Disponible" (ID 1) para el vehículo
                estado_disponible = EstadoVehiculo.objects.get(id=1)
                
                # Calcular el monto a devolver según la política de cancelación
                vehiculo = instance.vehiculo
                porcentaje_devolucion = Decimal(str(vehiculo.politica.porcentaje))
                monto_devolucion = instance.monto_total * (porcentaje_devolucion / Decimal('100'))
                
                # Actualizar el estado del alquiler primero
                instance.estado = estado_cancelado
                instance.save()
                
                # Luego actualizar el estado del vehículo
                vehiculo.estado = estado_disponible
                vehiculo.save()
                
                return {
                    'message': 'Reserva cancelada exitosamente',
                    'monto_devolucion': float(monto_devolucion),
                    'porcentaje_devolucion': float(porcentaje_devolucion)
                }
        except EstadoAlquiler.DoesNotExist:
            raise serializers.ValidationError('Error al obtener el estado de cancelación')
        except EstadoVehiculo.DoesNotExist:
            raise serializers.ValidationError('Error al obtener el estado del vehículo')
        except Exception as e:
            raise serializers.ValidationError(str(e))

class AlquilerCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alquiler
        fields = ['id', 'cliente', 'vehiculo', 'fecha_inicio', 'fecha_fin', 'monto_total', 'estado']

    def validate(self, data):
        fecha_inicio = data.get('fecha_inicio')
        fecha_fin = data.get('fecha_fin')
        vehiculo = data.get('vehiculo')
        cliente = data.get('cliente')

        # Validar que la fecha de inicio sea anterior a la fecha de fin
        if fecha_inicio >= fecha_fin:
            raise serializers.ValidationError("La fecha de inicio debe ser anterior a la fecha de fin")

        # Validar que la fecha de inicio sea futura
        ahora = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        fecha_inicio_sin_hora = fecha_inicio.replace(hour=0, minute=0, second=0, microsecond=0)
        
        if fecha_inicio_sin_hora < ahora:
            raise serializers.ValidationError("La fecha de inicio debe ser futura")

        # Verificar si el cliente ya tiene una reserva que se solapa
        alquileres_confirmados = Alquiler.objects.filter(
            cliente=cliente,
            estado__id=1,  # Solo reservas confirmadas
            fecha_inicio__lte=fecha_fin,
            fecha_fin__gte=fecha_inicio
        )
        if alquileres_confirmados.exists():
            raise serializers.ValidationError("Ya posees reservas activas en las fechas seleccionadas, por favor, seleccione un rango de fechas en donde no tenga reservas agendadas")

        # Verificar si el vehículo está disponible
        if not vehiculo.esta_disponible(fecha_inicio, fecha_fin):
            raise serializers.ValidationError("El vehículo no está disponible para las fechas seleccionadas")

        return data

class EstadoAlquilerSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoAlquiler
        fields = ['id', 'nombre'] 