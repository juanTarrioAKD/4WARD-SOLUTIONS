from rest_framework import serializers
from .models import (
    Usuario, Vehiculo, Publicacion,
    Marca, Modelo, EstadoVehiculo, Sucursal, Categoria,
    PoliticaDeCancelacion, Foto, Calificacion, Localidad, Pregunta, Category
)

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ('id', 'email', 'nombre', 'apellido', 'telefono', 'fecha_nacimiento', 'rol', 'puesto', 'localidad')

class UsuarioCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(required=False, write_only=True)  # No requerimos el username ya que lo generaremos

    class Meta:
        model = Usuario
        fields = ('email', 'password', 'nombre', 'apellido', 'telefono', 'fecha_nacimiento', 'rol', 'puesto', 'localidad', 'username')

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('username', None)  # Removemos el username si existe
        usuario = Usuario(**validated_data)
        usuario.username = validated_data['email']  # Usamos el email como username
        usuario.set_password(password)
        usuario.save()
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
    class Meta:
        model = Calificacion
        fields = ['id', 'puntaje', 'publicacion', 'usuario']

class PreguntaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pregunta
        fields = ['id', 'publicacion', 'comentario', 'usuario'] 