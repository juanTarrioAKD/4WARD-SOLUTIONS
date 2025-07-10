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
    # Sobrescribir los campos de AbstractUser para usar nombre y apellido
    first_name = models.CharField(max_length=150, verbose_name='nombre', db_column='nombre')
    last_name = models.CharField(max_length=150, verbose_name='apellido', db_column='apellido')
    
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20)
    fecha_nacimiento = models.DateField()
    rol = models.ForeignKey(Rol, on_delete=models.PROTECT)
    puesto = models.CharField(max_length=100, null=True, blank=True)
    localidad = models.ForeignKey('Localidad', on_delete=models.SET_NULL, null=True, blank=True)
    sucursal = models.ForeignKey('Sucursal', on_delete=models.SET_NULL, null=True, blank=True)
    is_locked = models.BooleanField(default=False)
    login_attempts = models.IntegerField(default=0)
    admin_code_attempts = models.IntegerField(default=0)
    last_login_attempt = models.DateTimeField(null=True, blank=True)
    last_admin_code_attempt = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'telefono', 'fecha_nacimiento']

    def increment_login_attempts(self):
        self.login_attempts += 1
        self.last_login_attempt = timezone.now()
        if self.login_attempts >= 3:
            self.is_locked = True
        self.save()

    def increment_admin_code_attempts(self):
        self.admin_code_attempts += 1
        self.last_admin_code_attempt = timezone.now()
        if self.admin_code_attempts >= 3:
            self.is_locked = True
        self.save()

    def reset_login_attempts(self):
        self.login_attempts = 0
        self.admin_code_attempts = 0
        self.is_locked = False
        self.save()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

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
    cliente = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='ID_Usuario')
    vehiculo = models.ForeignKey('Vehiculo', on_delete=models.CASCADE, related_name='alquileres', db_column='ID_Vehiculo')
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    fecha_reserva = models.DateTimeField(auto_now_add=True)
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.ForeignKey(EstadoAlquiler, on_delete=models.CASCADE, db_column='ID_Estado')
    sucursal_devolucion = models.ForeignKey('Sucursal', on_delete=models.CASCADE, related_name='alquileres_devolucion', db_column='ID_Sucursal_Devolucion', null=True, blank=True)

    class Meta:
        db_table = 'alquiler'

    def __str__(self):
        return f"Alquiler {self.id} - {self.vehiculo} ({self.fecha_inicio} a {self.fecha_fin})"

    def cancelar(self):
        """
        Cancela la reserva y actualiza el estado del vehículo si es necesario.
        """
        print(f"Estado actual: {self.estado.id}")
        print(f"DEBUG cancelar: Estado actual: {self.estado.id}")
        # Solo se puede cancelar si está en estado Confirmado (ID 4)
        if self.estado.id != 4:
            print("DEBUG cancelar: Lanzando error por estado no confirmado")
            raise ValueError("Solo se puede cancelar una reserva confirmada")
        
        # Obtener el estado "Cancelado"
        estado_cancelado = EstadoAlquiler.objects.get(id=5)
        
        # Actualizar el estado del alquiler
        self.estado = estado_cancelado
        self.save()
        
        # Calcular el monto a devolver según la política de cancelación
        porcentaje_devolucion = self.vehiculo.politica.porcentaje
        monto_devolucion = self.monto_total * (porcentaje_devolucion / 100)
        
        return monto_devolucion

    def registrar_devolucion(self, sucursal_devolucion_real):
        """
        Registra la devolución del vehículo y calcula el monto extra si es necesario.
        Solo se puede devolver un vehículo que esté en curso (estado id=7).
        """
        if self.estado.id == 5:  # Cancelado (ID 5)
            raise ValueError("No se puede registrar devolución: el alquiler ya está cancelado")
        if self.estado.id == 6:  # Finalizado (ID 6)
            raise ValueError("No se puede registrar devolución: la reserva ya ha sido finalizada")
        if self.estado.id == 4:  # Confirmado pero no en curso (ID 4)
            raise ValueError("No se puede registrar devolución: la reserva está confirmada pero no en curso. Primero debe retirar el vehículo.")
        if self.estado.id != 7:  # No está en curso (usando ID 7 como "En Curso")
            raise ValueError("No se puede registrar devolución: el alquiler no está en curso")

        # Obtener el estado "Finalizado" (usando ID 6)
        estado_finalizado = EstadoAlquiler.objects.get(id=6)
        # Actualizar el estado del alquiler
        self.estado = estado_finalizado
        self.save()

        # Calcular monto extra si la devolución es en sucursal diferente
        monto_extra = 0
        if sucursal_devolucion_real.id != self.sucursal_devolucion.id:
            monto_extra = 5000  # $5000 pesos por devolución en sucursal diferente  
        return monto_extra

    def retirar_vehiculo(self):
        """
        Cambia el estado de la reserva a "En Curso" cuando el cliente retira el vehículo.
        """
        print(f"DEBUG: Estado actual del alquiler {self.id}: {self.estado.id} - {self.estado.nombre}")
        
        if self.estado.id == 5:  # Si está cancelado (ID 5)
            raise ValueError("No se puede retirar un vehículo de una reserva cancelada")
        
        if self.estado.id == 6:  # Si ya está finalizado (ID 6)
            raise ValueError("No se puede retirar un vehículo de una reserva finalizada")
        
        if self.estado.id == 7:  # Si ya está en curso
            raise ValueError("El vehículo ya ha sido retirado")
        
        # Obtener el estado "En Curso" (usando ID 7)
        try:
            estado_en_curso = EstadoAlquiler.objects.get(id=7)
            print(f"DEBUG: Estado 'En Curso' encontrado: {estado_en_curso.id} - {estado_en_curso.nombre}")
        except EstadoAlquiler.DoesNotExist:
            print("ERROR: El estado con ID 7 ('En Curso') no existe en la base de datos")
            raise ValueError("El estado 'En Curso' no existe en la base de datos")
        
        # Actualizar el estado del alquiler
        print(f"DEBUG: Cambiando estado de {self.estado.id} a {estado_en_curso.id}")
        self.estado = estado_en_curso
        self.save()
        
        print(f"DEBUG: Estado actualizado. Nuevo estado: {self.estado.id} - {self.estado.nombre}")
        return True

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

    def __str__(self):
        return self.nombre

class Sucursal(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
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
    anio_fabricacion = models.IntegerField()
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, db_column='ID_Cate')
    estado = models.ForeignKey(EstadoVehiculo, on_delete=models.CASCADE, db_column='ID_EstVehi')
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE, db_column='ID_Marca')
    modelo = models.ForeignKey(Modelo, on_delete=models.CASCADE, db_column='ID_Modelo')
    politica = models.ForeignKey(PoliticaDeCancelacion, on_delete=models.CASCADE, db_column='ID_Politica')
    sucursal = models.ForeignKey(Sucursal, on_delete=models.CASCADE, db_column='ID_Sucursal')

    class Meta:
        db_table = 'vehiculo'

    def __str__(self):
        return f"{self.marca} {self.modelo} - {self.patente}"

    def esta_disponible(self, fecha_inicio, fecha_fin):
        """
        Verifica si el vehículo está disponible para las fechas especificadas.
        Un vehículo está disponible si:
        1. Su estado es "Disponible" (id=1)
        2. No tiene reservas confirmadas que se solapen con las fechas especificadas
        """
        # Verificar si el vehículo está en estado disponible
        if self.estado.id != 1:  # Si no está disponible
            return False
            
        # Verificar si hay reservas que se solapan
        # Una reserva se solapa si:
        # - La fecha de inicio de la reserva es menor o igual a la fecha de fin solicitada Y
        # - La fecha de fin de la reserva es mayor o igual a la fecha de inicio solicitada
        reservas_solapadas = self.alquileres.filter(
            estado__id=1,  # Solo reservas confirmadas
            fecha_inicio__lte=fecha_fin,
            fecha_fin__gte=fecha_inicio
        ).exists()
        
        return not reservas_solapadas

class Foto(models.Model):
    vehiculo = models.ForeignKey(Vehiculo, on_delete=models.CASCADE, db_column='IDVehi')
    imagen = models.ImageField(upload_to='vehiculos/')

    class Meta:
        db_table = 'foto'

class Publicacion(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    imagen = models.ImageField(upload_to='publicaciones/', null=True, blank=True)

    class Meta:
        db_table = 'publicacion'

class Calificacion(models.Model):
    puntaje = models.IntegerField()
    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE, db_column='IDPubli')
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='IDUsuario')

    class Meta:
        db_table = 'calificacion'

class Pregunta(models.Model):
    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE, db_column='IDPubli')
    comentario = models.TextField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='IDUsuario')

    class Meta:
        db_table = 'pregunta'

class Respuesta(models.Model):
    comentario = models.TextField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, null=True, blank=True, db_column='IDUsuario')

    class Meta:
        db_table = 'respuesta' 