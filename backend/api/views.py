from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from .models import (
    Usuario, Vehiculo, Publicacion,
    Marca, Modelo, EstadoVehiculo, Sucursal, Categoria,
    PoliticaDeCancelacion, Foto, Calificacion, Localidad, Pregunta,
    Alquiler, EstadoAlquiler
)
from .serializers import (
    UsuarioSerializer, UsuarioCreateSerializer,
    VehiculoSerializer, VehiculoCreateSerializer,
    PublicacionSerializer, PublicacionCreateSerializer,
    SucursalSerializer, PoliticaDeCancelacionSerializer,
    MarcaSerializer, ModeloSerializer, EstadoVehiculoSerializer,
    CategoriaSerializer, CalificacionSerializer,
    LocalidadSerializer, PreguntaSerializer,
    AlquilerSerializer, AlquilerCreateSerializer,
    EstadoAlquilerSerializer, CalificacionCreateSerializer,
    PreguntaCreateSerializer
)
from .permissions import *
from django.utils import timezone

# Mock users for testing with login attempts counter and lock status
MOCK_USERS = {
    "admin@admin.com": {
        "id": 1,
        "email": "admin@admin.com",
        "password": "Admin123",
        "nombre": "Admin",
        "apellido": "Usuario",
        "telefono": "123456789",
        "fecha_nacimiento": "1990-01-01",
        "rol": "admin",
        "puesto": "Administrador General",
        "localidad": 1,
        "failed_attempts": 0,
        "is_locked": False
    },
    "cliente@cliente.com": {
        "id": 2,
        "email": "cliente@cliente.com",
        "password": "Cliente123",
        "nombre": "Cliente",
        "apellido": "Usuario",
        "telefono": "987654321",
        "fecha_nacimiento": "1995-01-01",
        "rol": "cliente",
        "puesto": None,
        "localidad": 1,
        "failed_attempts": 0,
        "is_locked": False
    }
}

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]  # Permitimos acceso público para registro y login

    def get_serializer_class(self):
        if self.action in ['create', 'register']:
            return UsuarioCreateSerializer
        return UsuarioSerializer

    def get_permissions(self):
        if self.action in ['register', 'login', 'logout']:
            return [AllowAny()]
        elif self.action in ['modificar', 'baja']:
            return [IsAuthenticated()]
        return [IsAdmin()]

    @action(detail=True, methods=['put'])
    def modificar(self, request, pk=None):
        usuario = self.get_object()
        if request.user != usuario and request.user.rol not in ['admin', 'empleado']:
            return Response({'error': 'No tienes permiso para modificar este usuario'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def baja(self, request, pk=None):
        usuario = self.get_object()
        if request.user.rol not in ['admin', 'empleado']:
            return Response({'error': 'No tienes permiso para dar de baja usuarios'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        usuario.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['put'])
    def cambiar_rol(self, request, pk=None):
        if request.user.rol != 'admin':
            return Response({'error': 'Solo los administradores pueden cambiar roles'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        usuario = self.get_object()
        nuevo_rol = request.data.get('rol')
        nuevo_puesto = request.data.get('puesto')
        nueva_localidad = request.data.get('localidad')

        if nuevo_rol not in ['cliente', 'empleado', 'admin']:
            return Response({'error': 'Rol inválido'}, status=status.HTTP_400_BAD_REQUEST)

        usuario.rol = nuevo_rol
        if nuevo_puesto:
            usuario.puesto = nuevo_puesto
        if nueva_localidad:
            usuario.localidad_id = nueva_localidad
        usuario.save()

        return Response(UsuarioSerializer(usuario).data)

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UsuarioCreateSerializer(data=request.data)
        if serializer.is_valid():
            if Usuario.objects.filter(email=serializer.validated_data['email']).exists():
                return Response({'error': 'El email ya está registrado'}, status=status.HTTP_400_BAD_REQUEST)
            usuario = serializer.save()
            return Response(UsuarioSerializer(usuario).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = Usuario.objects.get(email=email)
            
            if user.is_locked:
                return Response({
                    'error': 'Cuenta bloqueada. Por favor, use la clave de recuperación "123456789" para desbloquear su cuenta.'
                }, status=status.HTTP_403_FORBIDDEN)

            user = authenticate(request, email=email, password=password)
            
            if user is None:
                user = Usuario.objects.get(email=email)
                user.increment_login_attempts()
                return Response({
                    'error': 'Credenciales inválidas'
                }, status=status.HTTP_401_UNAUTHORIZED)

            refresh = RefreshToken.for_user(user)
            user.reset_login_attempts()
            
            # Obtener el nombre del rol
            rol_nombre = user.rol.nombre if user.rol else 'cliente'
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'nombre': user.nombre,
                    'apellido': user.apellido,
                    'telefono': user.telefono,
                    'fecha_nacimiento': user.fecha_nacimiento,
                    'rol': rol_nombre,
                    'puesto': user.puesto,
                    'localidad': user.localidad.id if user.localidad else None
                }
            })
        except Usuario.DoesNotExist:
            return Response({
                'error': 'Credenciales inválidas'
            }, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def perfil(self, request, pk=None):
        usuario = self.get_object()
        serializer = self.get_serializer(usuario)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='mis-alquileres', permission_classes=[IsAuthenticated])
    def mis_alquileres(self, request):
        try:
            usuario = request.user
            if not usuario:
                return Response({'error': 'Usuario no encontrado en la solicitud'}, 
                              status=status.HTTP_401_UNAUTHORIZED)
            
            alquileres = Alquiler.objects.filter(usuario=usuario).order_by('-fecha_inicio')
            serializer = AlquilerSerializer(alquileres, many=True)
            return Response({
                'alquileres': serializer.data,
                'usuario_id': usuario.id,
                'usuario_email': usuario.email
            })
        except Exception as e:
            return Response({
                'error': f'Error al obtener alquileres: {str(e)}',
                'user_info': str(request.user) if request.user else 'No user found'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VehiculoViewSet(viewsets.ModelViewSet):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer
    permission_classes = [AllowAny]  # Permitir acceso público para listar vehículos

    def get_permissions(self):
        if self.action == 'list':
            return [AllowAny()]
        return [IsEmpleadoOrAdmin()]

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            if Vehiculo.objects.filter(patente=serializer.validated_data['patente']).exists():
                return Response({'error': 'La patente ya está registrada'}, status=status.HTTP_400_BAD_REQUEST)
            vehiculo = serializer.save()
            return Response(VehiculoSerializer(vehiculo).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def baja(self, request, pk=None):
        vehiculo = self.get_object()
        vehiculo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['put', 'patch'])
    def modificar(self, request, pk=None):
        vehiculo = self.get_object()
        serializer = VehiculoCreateSerializer(vehiculo, data=request.data, partial=True)
        if serializer.is_valid():
            # Verificar si la patente ya existe (solo si se está modificando la patente)
            if 'patente' in request.data and request.data['patente'] != vehiculo.patente:
                if Vehiculo.objects.filter(patente=request.data['patente']).exists():
                    return Response({'error': 'La patente ya está registrada'}, status=status.HTTP_400_BAD_REQUEST)
            vehiculo = serializer.save()
            return Response(VehiculoSerializer(vehiculo).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def buscar_por_patente(self, request):
        patente = request.query_params.get('patente', '')
        vehiculos = Vehiculo.objects.filter(patente__icontains=patente)
        serializer = self.get_serializer(vehiculos, many=True)
        return Response(serializer.data)

class PublicacionViewSet(viewsets.ModelViewSet):
    queryset = Publicacion.objects.all()
    serializer_class = PublicacionSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'list':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.action == 'list':
            return Publicacion.objects.filter(estado_id=1)  # Solo publicaciones activas
        return Publicacion.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put', 'patch'])
    def modificar(self, request, pk=None):
        publicacion = self.get_object()
        serializer = PublicacionSerializer(publicacion, data=request.data, partial=True)
        if serializer.is_valid():
            publicacion = serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def baja(self, request, pk=None):
        publicacion = self.get_object()
        publicacion.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class SucursalViewSet(viewsets.ModelViewSet):
    queryset = Sucursal.objects.all()
    serializer_class = SucursalSerializer
    permission_classes = [IsAdmin]

    @action(detail=True, methods=['put', 'patch'])
    def modificar(self, request, pk=None):
        sucursal = self.get_object()
        serializer = SucursalSerializer(sucursal, data=request.data, partial=True)
        if serializer.is_valid():
            sucursal = serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def baja(self, request, pk=None):
        sucursal = self.get_object()
        sucursal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PoliticaDeCancelacionViewSet(viewsets.ModelViewSet):
    queryset = PoliticaDeCancelacion.objects.all()
    serializer_class = PoliticaDeCancelacionSerializer
    permission_classes = [IsAdmin]

class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer
    permission_classes = [IsAdmin]

    @action(detail=True, methods=['delete'])
    def baja(self, request, pk=None):
        marca = self.get_object()
        marca.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class EstadoVehiculoViewSet(viewsets.ModelViewSet):
    queryset = EstadoVehiculo.objects.all()
    serializer_class = EstadoVehiculoSerializer
    permission_classes = [IsAdmin]

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAdmin]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            categoria = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put', 'patch'])
    def modificar(self, request, pk=None):
        categoria = self.get_object()
        serializer = CategoriaSerializer(categoria, data=request.data, partial=True)
        if serializer.is_valid():
            categoria = serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def baja(self, request, pk=None):
        categoria = self.get_object()
        categoria.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CalificacionViewSet(viewsets.ModelViewSet):
    queryset = Calificacion.objects.all()
    serializer_class = CalificacionSerializer
    permission_classes = [IsCliente]

    def get_serializer_class(self):
        if self.action == 'create':
            return CalificacionCreateSerializer
        return CalificacionSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                # Verificar que el usuario no haya calificado la misma publicación antes
                if Calificacion.objects.filter(
                    publicacion=serializer.validated_data['publicacion'],
                    usuario=request.user
                ).exists():
                    return Response(
                        {'error': 'Ya has calificado esta publicación'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                calificacion = serializer.save()
                return Response(CalificacionSerializer(calificacion).data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {'error': f'Error al procesar la solicitud: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['delete'])
    def baja(self, request, pk=None):
        calificacion = self.get_object()
        calificacion.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ModeloViewSet(viewsets.ModelViewSet):
    queryset = Modelo.objects.all()
    serializer_class = ModeloSerializer
    permission_classes = [IsAdmin]

    @action(detail=True, methods=['delete'])
    def baja(self, request, pk=None):
        modelo = self.get_object()
        modelo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class LocalidadViewSet(viewsets.ModelViewSet):
    queryset = Localidad.objects.all()
    serializer_class = LocalidadSerializer
    permission_classes = [IsAdmin]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Verificar si la localidad ya existe
            if Localidad.objects.filter(nombre=serializer.validated_data['nombre']).exists():
                return Response(
                    {'error': 'Ya existe una localidad con ese nombre'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            localidad = serializer.save()
            return Response(LocalidadSerializer(localidad).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def baja(self, request, pk=None):
        localidad = self.get_object()
        localidad.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PreguntaViewSet(viewsets.ModelViewSet):
    queryset = Pregunta.objects.all()
    serializer_class = PreguntaSerializer
    permission_classes = [IsClienteOrEmpleadoOrAdmin]

    def get_serializer_class(self):
        if self.action == 'create':
            return PreguntaCreateSerializer
        return PreguntaSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            pregunta = serializer.save()
            return Response(PreguntaSerializer(pregunta).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def baja(self, request, pk=None):
        pregunta = self.get_object()
        pregunta.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['put'])
    def responder(self, request, pk=None):
        if request.user.rol not in ['admin', 'empleado']:
            return Response({'error': 'Solo empleados y administradores pueden responder preguntas'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        pregunta = self.get_object()
        respuesta = request.data.get('respuesta')
        pregunta.respuesta = respuesta
        pregunta.save()
        return Response(PreguntaSerializer(pregunta).data)

class AlquilerViewSet(viewsets.ModelViewSet):
    queryset = Alquiler.objects.all()
    serializer_class = AlquilerSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return AlquilerCreateSerializer
        return AlquilerSerializer

    def get_queryset(self):
        if self.action == 'list' and self.request.user.rol.id == 1:  # Cliente
            return Alquiler.objects.none()  # No permite listar todos los alquileres
        elif self.action == 'mis_alquileres':
            return Alquiler.objects.filter(cliente=self.request.user)
        return Alquiler.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Establecer fecha_reserva y estado automáticamente
            serializer.validated_data['fecha_reserva'] = timezone.now()
            serializer.validated_data['estado_id'] = 1  # Estado Pendiente
            alquiler = serializer.save()
            return Response(AlquilerSerializer(alquiler).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='mis-alquileres')
    def mis_alquileres(self, request):
        try:
            usuario = request.user
            if not usuario:
                return Response({'error': 'Usuario no encontrado en la solicitud'}, 
                              status=status.HTTP_401_UNAUTHORIZED)
            
            alquileres = Alquiler.objects.filter(cliente=usuario).order_by('-fecha_inicio')
            serializer = AlquilerSerializer(alquileres, many=True)
            return Response({
                'alquileres': serializer.data,
                'usuario_id': usuario.id,
                'usuario_email': usuario.email
            })
        except Exception as e:
            return Response({
                'error': f'Error al obtener alquileres: {str(e)}',
                'user_info': str(request.user) if request.user else 'No user found'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['put', 'patch'])
    def modificar(self, request, pk=None):
        alquiler = self.get_object()
        serializer = AlquilerSerializer(alquiler, data=request.data, partial=True)
        if serializer.is_valid():
            alquiler = serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def baja(self, request, pk=None):
        alquiler = self.get_object()
        alquiler.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        alquiler = self.get_object()
        if request.user.rol.id not in [2, 3]:  # No es empleado ni admin
            return Response({'error': 'No tienes permiso para cancelar alquileres'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        alquiler.estado_id = 3  # Estado "Cancelado"
        alquiler.save()
        return Response(AlquilerSerializer(alquiler).data)

class EstadoAlquilerViewSet(viewsets.ModelViewSet):
    queryset = EstadoAlquiler.objects.all()
    serializer_class = EstadoAlquilerSerializer
    permission_classes = [IsAdmin]

    @action(detail=True, methods=['delete'])
    def baja(self, request, pk=None):
        estado = self.get_object()
        estado.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class EstadisticasViewSet(viewsets.ViewSet):
    permission_classes = [IsAdmin]

    @action(detail=False, methods=['get'])
    def mejor_calificado(self, request):
        # Implementar lógica para obtener el vehículo mejor calificado
        pass

    @action(detail=False, methods=['get'])
    def registros_periodo(self, request):
        # Implementar lógica para obtener registros en un período
        pass

    @action(detail=False, methods=['get'])
    def mas_alquilado(self, request):
        # Implementar lógica para obtener el vehículo más alquilado
        pass 

@api_view(['GET'])
@permission_classes([AllowAny])
def getDatosCategorias(request):
    # Categories with direct image URLs
    categories = [
        {
            "id": 1,
            "name": "SUV",
            "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&h=600",
            "price": 150.00
        },
        {
            "id": 2,
            "name": "Chico",
            "image": "https://images.unsplash.com/photo-1567818735868-e71b99932e29?auto=format&fit=crop&w=800&h=600",
            "price": 100.00
        },
        {
            "id": 3,
            "name": "Mediano",
            "image": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&h=600",
            "price": 250.00
        },
        {
            "id": 4,
            "name": "Van",
            "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&h=600",
            "price": 180.00
        },
        {
            "id": 5,
            "name": "Deportivo",
            "image": "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&h=600",
            "price": 300.00
        }
    ]
    
    return Response(categories)

@api_view(['POST'])
@permission_classes([AllowAny])
def getMockLogin(request):
    email = request.data.get('email')
    password = request.data.get('password')

    # Find user with matching email
    user = MOCK_USERS.get(email)

    if not user:
        return Response({
            "error": "Credenciales inválidas"
        }, status=status.HTTP_401_UNAUTHORIZED)

    # Check if account is locked
    if user["is_locked"]:
        return Response({
            "error": "Cuenta bloqueada por múltiples intentos fallidos. Se le ha enviado un correo para recuperar su cuenta."
        }, status=status.HTTP_403_FORBIDDEN)

    # Check password
    if user["password"] != password:
        user["failed_attempts"] += 1
        
        # Check if should lock account
        if user["failed_attempts"] >= 3:
            user["is_locked"] = True
            return Response({
                "error": "Cuenta bloqueada por múltiples intentos fallidos. Se le ha enviado un correo para recuperar su cuenta."
            }, status=status.HTTP_403_FORBIDDEN)
        
        remaining_attempts = 3 - user["failed_attempts"]
        return Response({
            "error": f"Contraseña incorrecta. Intentos restantes: {remaining_attempts}"
        }, status=status.HTTP_401_UNAUTHORIZED)

    # Successful login - reset failed attempts
    user["failed_attempts"] = 0
    
    # Create a mock token
    mock_token = {
        "refresh": "mock_refresh_token",
        "access": "mock_access_token"
    }

    return Response({
        "refresh": mock_token["refresh"],
        "access": mock_token["access"],
        "user": {
            "id": user["id"],
            "email": user["email"],
            "nombre": user["nombre"],
            "apellido": user["apellido"],
            "telefono": user["telefono"],
            "fecha_nacimiento": user["fecha_nacimiento"],
            "rol": user["rol"],
            "puesto": user["puesto"],
            "localidad": user["localidad"]
        }
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def getMockRegister(request):
    # Mock de usuarios existentes
    existing_users = [
        {
            "email": "cliente@cliente.com",
            "password": "Cliente123"  # Cumple con los requisitos
        },
        {
            "email": "admin@admin.com",
            "password": "Admin123"    # Cumple con los requisitos
        }
    ]

    # Validar que todos los campos requeridos estén presentes
    required_fields = ['nombre', 'apellido', 'email', 'telefono', 'password', 'fecha_nacimiento']
    for field in required_fields:
        if field not in request.data:
            return Response({
                'error': f'El campo {field} es requerido'
            }, status=status.HTTP_400_BAD_REQUEST)

    # Validar requisitos de contraseña
    password = request.data['password']
    if len(password) < 8:
        return Response({
            'error': 'La contraseña debe tener al menos 8 caracteres'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not any(c.isupper() for c in password):
        return Response({
            'error': 'La contraseña debe contener al menos una letra mayúscula'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not any(c.isdigit() for c in password):
        return Response({
            'error': 'La contraseña debe contener al menos un número'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Verificar si el email ya existe
    if any(user["email"] == request.data["email"] for user in existing_users):
        return Response({
            'error': 'El email ya está registrado en el sistema'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Simular registro exitoso
    return Response({
        'success': True,
        'message': 'Usuario registrado exitosamente'
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])
def getMockReservations(request):
    # Add CORS headers
    response = Response([
        {
            "id": "1",
            "numeroReserva": "1234"
        },
        {
            "id": "2",
            "numeroReserva": "5678"
        }
    ])
    response["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"
    return response

@api_view(['GET'])
@permission_classes([AllowAny])
def getMockPolicies(request):
    # Mock de políticas de cancelación
    policies = [
        {
            "id": 1,
            "nombre": "Política Flexible",
            "descripcion": "Cancelación gratuita hasta 24 horas antes del inicio del alquiler",
            "porcentaje": 100
        },
        {
            "id": 2,
            "nombre": "Política Moderada",
            "descripcion": "Cancelación con 50% de reembolso hasta 48 horas antes del inicio",
            "porcentaje": 50
        },
        {
            "id": 3,
            "nombre": "Política Estricta",
            "descripcion": "Cancelación con 20% de reembolso hasta 72 horas antes del inicio",
            "porcentaje": 20
        }
    ]
    
    # Add CORS headers
    response = Response(policies)
    response["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"
    return response

