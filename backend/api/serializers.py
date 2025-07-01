import re
import secrets
import string
from django.utils import timezone
from django.db.models import Q

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

def generar_contrasena_aleatoria():
    """Genera una contraseña aleatoria que cumple con los requisitos de seguridad"""
    # Caracteres disponibles
    letras_mayusculas = string.ascii_uppercase
    letras_minusculas = string.ascii_lowercase
    numeros = string.digits
    caracteres_especiales = "!@#$%^&*"
    
    # Asegurar al menos un carácter de cada tipo
    contrasena = [
        secrets.choice(letras_mayusculas),  # Al menos una mayúscula
        secrets.choice(letras_minusculas),  # Al menos una minúscula
        secrets.choice(numeros),            # Al menos un número
        secrets.choice(caracteres_especiales)  # Al menos un carácter especial
    ]
    
    # Completar hasta 12 caracteres con caracteres aleatorios
    todos_caracteres = letras_mayusculas + letras_minusculas + numeros + caracteres_especiales
    for _ in range(8):  # 4 ya tenemos + 8 = 12 caracteres
        contrasena.append(secrets.choice(todos_caracteres))
    
    # Mezclar la contraseña
    secrets.SystemRandom().shuffle(contrasena)
    return ''.join(contrasena)

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

class UsuarioEmpleadoCreateSerializer(serializers.ModelSerializer):
    """Serializer para que empleados registren usuarios con contraseña automática"""
    password_generada = serializers.CharField(read_only=True)
    username = serializers.CharField(required=False, write_only=True)
    rol = serializers.PrimaryKeyRelatedField(queryset=Rol.objects.all(), required=False)

    class Meta:
        model = Usuario
        fields = ('email', 'nombre', 'apellido', 'telefono', 'fecha_nacimiento', 'rol', 'puesto', 'localidad', 'username', 'password_generada')

    def create(self, validated_data):
        validated_data.pop('username', None)  # Removemos el username si existe
        
        # Si no se envía rol, asignar el rol con ID 1 (cliente)
        if 'rol' not in validated_data or validated_data['rol'] is None:
            validated_data['rol'] = Rol.objects.get(pk=1)
        
        # Generar contraseña aleatoria
        password_generada = generar_contrasena_aleatoria()
        
        usuario = Usuario(**validated_data)
        usuario.username = validated_data['email']  # Usamos el email como username
        usuario.set_password(password_generada)
        usuario.save()
        
        # Agregar la contraseña generada al serializer para mostrarla
        self.fields['password_generada'].default = password_generada
        
        return usuario

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
    categoria = CategoriaSerializer(read_only=True)
    class Meta:
        model = Publicacion
        fields = '__all__'

class PublicacionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publicacion
        fields = '__all__'

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
    sucursal_devolucion = SucursalSerializer(read_only=True)

    class Meta:
        model = Alquiler
        fields = ['id', 'fecha_inicio', 'fecha_fin', 'fecha_reserva', 'monto_total', 'estado', 'cliente', 'vehiculo', 'sucursal_devolucion']

    def cancel(self, instance):
        """
        Cancela la reserva y actualiza el estado del vehículo si es necesario.
        """
        if instance.estado.id in [2, 3]:  # Si ya está cancelado o finalizado
            raise serializers.ValidationError("No se puede cancelar una reserva que ya está cancelada o finalizada")
            
        # Obtener el estado "Cancelado"
        estado_cancelado = EstadoAlquiler.objects.get(id=3)
        
        # Actualizar el estado del alquiler
        instance.estado = estado_cancelado
        instance.save()
        
        # Calcular el monto a devolver según la política de cancelación
        porcentaje_devolucion = instance.vehiculo.politica.porcentaje
        monto_devolucion = instance.monto_total * (porcentaje_devolucion / 100)
        
        return monto_devolucion

class AlquilerCreateSerializer(serializers.ModelSerializer):
    sucursal_devolucion = serializers.PrimaryKeyRelatedField(queryset=Sucursal.objects.all())

    class Meta:
        model = Alquiler
        fields = ['cliente', 'vehiculo', 'fecha_inicio', 'fecha_fin', 'monto_total', 'estado', 'sucursal_devolucion']

    def validate(self, data):
        # Obtener el modelo del vehículo solicitado
        vehiculo = data['vehiculo']
        fecha_inicio = data['fecha_inicio']
        fecha_fin = data['fecha_fin']
        
        # Validar que la fecha de fin sea posterior a la fecha de inicio
        if fecha_fin <= fecha_inicio:
            raise serializers.ValidationError("La fecha de fin debe ser posterior a la fecha de inicio")
        
        # Validar que el vehículo esté disponible para las fechas especificadas
        if not vehiculo.esta_disponible(fecha_inicio, fecha_fin):
            raise serializers.ValidationError("El vehículo no está disponible para las fechas especificadas")
        
        return data

    def create(self, validated_data):
        # Obtener el estado "Confirmado" (id=1)
        estado_confirmado = EstadoAlquiler.objects.get(id=1)
        validated_data['estado'] = estado_confirmado
        
        # Crear el alquiler
        alquiler = Alquiler.objects.create(**validated_data)
        
        # Cambiar el estado del vehículo a "Alquilado" (id=2)
        estado_alquilado = EstadoVehiculo.objects.get(id=2)
        alquiler.vehiculo.estado = estado_alquilado
        alquiler.vehiculo.save()
        
        return alquiler

class EstadoAlquilerSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoAlquiler
        fields = ['id', 'nombre'] 