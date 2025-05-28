import re

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
        fields = ['id', 'name', 'image', 'price']

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

    class Meta:
        model = Alquiler
        fields = ['id', 'fecha_inicio', 'fecha_fin', 'fecha_reserva', 'monto_total', 'estado', 'cliente', 'vehiculo']

class AlquilerCreateSerializer(serializers.ModelSerializer):
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(),
        write_only=True
    )

    class Meta:
        model = Alquiler
        fields = ['fecha_inicio', 'fecha_fin', 'fecha_reserva', 'categoria_id']

    def validate(self, data):
        fecha_inicio = data['fecha_inicio']
        fecha_fin = data['fecha_fin']
        fecha_reserva = data['fecha_reserva']

        if fecha_inicio >= fecha_fin:
            raise serializers.ValidationError("La fecha de inicio debe ser anterior a la fecha de fin")

        if fecha_reserva > fecha_inicio:
            raise serializers.ValidationError("La fecha de reserva debe ser anterior a la fecha de inicio")

        return data

    def create(self, validated_data):
        categoria = validated_data.pop('categoria_id')
        cliente = self.context['request'].user  # Obtenemos el usuario autenticado
        
        # Calcular la cantidad de días
        dias = (validated_data['fecha_fin'] - validated_data['fecha_inicio']).days
        
        # Calcular el monto total
        monto_total = categoria.precio * dias
        
        # Obtener el estado inicial (asumiendo que existe un estado "Pendiente" con ID 1)
        estado = EstadoAlquiler.objects.get(id=1)

        # Buscar un vehículo disponible de la categoría seleccionada
        # Primero obtenemos el ID del estado "Disponible" (asumiendo que es 1)
        estado_disponible = EstadoVehiculo.objects.get(id=1)
        
        # Buscamos un vehículo disponible de la categoría que no tenga alquileres en las fechas solicitadas
        vehiculo_disponible = Vehiculo.objects.filter(
            categoria=categoria,
            estado=estado_disponible
        ).exclude(
            alquileres__fecha_inicio__lte=validated_data['fecha_fin'],
            alquileres__fecha_fin__gte=validated_data['fecha_inicio']
        ).first()

        if not vehiculo_disponible:
            raise serializers.ValidationError("No hay vehículos disponibles en la categoría seleccionada para las fechas especificadas")
        
        # 🔧 ACTUALIZAR ESTADO DEL VEHÍCULO
        vehiculo_disponible.estado_id = 2  # "Alquilado"
        vehiculo_disponible.save()

        # Crear el alquiler
        alquiler = Alquiler.objects.create(
            **validated_data,
            cliente=cliente,
            vehiculo=vehiculo_disponible,
            monto_total=monto_total,
            estado=estado
        )
        
        return alquiler

class EstadoAlquilerSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoAlquiler
        fields = ['id', 'nombre'] 