from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class Rol(models.Model):
    nombre = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'rol'

class Usuario(AbstractUser):
    email = models.EmailField(unique=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    fecha_nacimiento = models.DateField()
    rol = models.ForeignKey(Rol, on_delete=models.PROTECT)
    puesto = models.CharField(max_length=100, null=True, blank=True)
    localidad = models.ForeignKey('Localidad', on_delete=models.SET_NULL, null=True, blank=True)
    login_attempts = models.IntegerField(default=0)
    is_locked = models.BooleanField(default=False)
    last_login_attempt = models.DateTimeField(null=True, blank=True)

    # Eliminamos los campos redundantes
    first_name = None
    last_name = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre', 'apellido', 'telefono', 'fecha_nacimiento']

    def increment_login_attempts(self):
        self.login_attempts += 1
        self.last_login_attempt = timezone.now()
        if self.login_attempts >= 3:
            self.is_locked = True
        self.save()

    def reset_login_attempts(self):
        self.login_attempts = 0
        self.is_locked = False
        self.save()

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

    class Meta:
        db_table = 'usuario'

class Puesto(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'puesto'

class Localidad(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'localidad'

class EstadoAlquiler(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'estado_alquiler'

class Alquiler(models.Model):
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    fecha_reserva = models.DateTimeField()
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.ForeignKey(EstadoAlquiler, on_delete=models.CASCADE, db_column='IDEstado')
    cliente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='alquileres')
    vehiculo = models.ForeignKey('Vehiculo', on_delete=models.CASCADE, related_name='alquileres', null=True)

    class Meta:
        db_table = 'alquiler'

class Marca(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'marca'

class Modelo(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'modelo'

class EstadoVehiculo(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'estado_vehiculo'

class Sucursal(models.Model):
    nombre = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    localidad = models.ForeignKey(Localidad, on_delete=models.CASCADE, db_column='ID_Localidad')
    direccion = models.CharField(max_length=200)

    class Meta:
        db_table = 'sucursal'

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'categoria'

class PoliticaDeCancelacion(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(max_length=100)
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        db_table = 'politica_de_cancelacion'

class Vehiculo(models.Model):
    patente = models.CharField(max_length=20, unique=True)
    capacidad = models.IntegerField()
    año_fabricacion = models.IntegerField()
    sucursal = models.ForeignKey(Sucursal, on_delete=models.CASCADE, db_column='ID_Sucursal')
    politica = models.ForeignKey(PoliticaDeCancelacion, on_delete=models.CASCADE, db_column='ID_Politica')
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE, db_column='ID_Marca')
    estado = models.ForeignKey(EstadoVehiculo, on_delete=models.CASCADE, db_column='ID_EstVehi')
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, db_column='ID_Cate')

    class Meta:
        db_table = 'vehiculo'

class Foto(models.Model):
    vehiculo = models.ForeignKey(Vehiculo, on_delete=models.CASCADE, db_column='ID_Vehi')
    imagen = models.ImageField(upload_to='vehiculos/')

    class Meta:
        db_table = 'foto'

class Publicacion(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'publicacion'

class Calificacion(models.Model):
    puntaje = models.IntegerField()
    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE, db_column='ID_Publi')
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='ID_Usuario')

    class Meta:
        db_table = 'calificacion'

class Pregunta(models.Model):
    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE, db_column='ID_Publi')
    comentario = models.TextField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='ID_Usuario')

    class Meta:
        db_table = 'pregunta'

class Respuesta(models.Model):
    comentario = models.TextField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, null=True, blank=True, db_column='ID_Usuario')

    class Meta:
        db_table = 'respuesta' 