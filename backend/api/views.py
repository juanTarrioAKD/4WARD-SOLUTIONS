from rest_framework import viewsets, status, serializers
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
from datetime import datetime

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

    @action(detail=False, methods=['put'])
    def modificar(self, request):
        usuario = request.user
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            # Si se está cambiando la contraseña
            if 'contraseña' in request.data:
                usuario.set_password(request.data['contraseña'])
                usuario.save()
            
            # Actualizar los demás campos
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

    @action(detail=False, methods=['get'], url_path='mis-alquileres')
    def mis_alquileres(self, request):
        try:
            usuario = request.user
            if not usuario:
                return Response({'error': 'Usuario no encontrado en la solicitud'}, 
                              status=status.HTTP_401_UNAUTHORIZED)
            
            alquileres = Alquiler.objects.filter(cliente=usuario).order_by('-fecha_inicio')
            if not alquileres:
                return Response({'error': 'No hay alquileres asociados al usuario'}, 
                              status=status.HTTP_400_BAD_REQUEST)
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
        if self.action in ['list', 'modelos_disponibles']:
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

    @action(detail=False, methods=['post'])
    def modelos_disponibles(self, request):
        """
        Lista los modelos disponibles para una categoría y rango de fechas específico.
        Body requerido:
        {
            "categoria_id": int,
            "fecha_inicio": "YYYY-MM-DDTHH:MM:SSZ",
            "fecha_fin": "YYYY-MM-DDTHH:MM:SSZ"
        }
        """
        try:
            # Obtener y validar parámetros del body
            categoria_id = request.data.get('categoria_id')
            fecha_inicio = request.data.get('fecha_inicio')
            fecha_fin = request.data.get('fecha_fin')

            if not all([categoria_id, fecha_inicio, fecha_fin]):
                return Response(
                    {"error": "Se requieren los parámetros: categoria_id, fecha_inicio y fecha_fin"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Convertir fechas
            try:
                fecha_inicio = datetime.fromisoformat(fecha_inicio.replace('Z', '+00:00'))
                fecha_fin = datetime.fromisoformat(fecha_fin.replace('Z', '+00:00'))
            except ValueError:
                return Response(
                    {"error": "Formato de fecha inválido. Use formato ISO (YYYY-MM-DDTHH:MM:SSZ)"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validar que la fecha de inicio sea anterior a la fecha de fin
            if fecha_inicio >= fecha_fin:
                return Response(
                    {"error": "La fecha de inicio debe ser anterior a la fecha de fin"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Obtener vehículos de la categoría que estén disponibles
            vehiculos_disponibles = Vehiculo.objects.filter(
                categoria_id=categoria_id,
                estado__id=1  # estado disponible
            ).exclude(
                # Excluir vehículos con reservas que se solapan
                alquileres__estado__id=1,  # Solo reservas confirmadas
                alquileres__fecha_inicio__lte=fecha_fin,
                alquileres__fecha_fin__gte=fecha_inicio
            ).distinct()

            # Obtener los modelos únicos de los vehículos disponibles
            modelos_disponibles = Modelo.objects.filter(
                vehiculo__in=vehiculos_disponibles
            ).distinct()

            # Serializar los modelos con información adicional
            modelos_data = []
            for modelo in modelos_disponibles:
                # Contar cuántos vehículos disponibles hay de este modelo
                vehiculos_modelo = vehiculos_disponibles.filter(modelo=modelo)
                cantidad_disponible = vehiculos_modelo.count()

                # Obtener el precio de la categoría
                precio_categoria = Categoria.objects.get(id=categoria_id).precio

                modelos_data.append({
                    'id': modelo.id,
                    'nombre': modelo.nombre,
                    'cantidad_disponible': cantidad_disponible,
                    'precio_por_dia': precio_categoria,
                    'vehiculos': [
                        {
                            'id': v.id,
                            'patente': v.patente,
                            'marca': v.marca.nombre,
                            'año': v.año_fabricacion,
                            'capacidad': v.capacidad
                        } for v in vehiculos_modelo
                    ]
                })

            return Response({
                'categoria_id': categoria_id,
                'fecha_inicio': fecha_inicio,
                'fecha_fin': fecha_fin,
                'modelos_disponibles': modelos_data
            })

        except Categoria.DoesNotExist:
            return Response(
                {"error": "Categoría no encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Error al procesar la solicitud: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PublicacionViewSet(viewsets.ModelViewSet):
    queryset = Publicacion.objects.all()
    serializer_class = PublicacionSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'list':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return Publicacion.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return PublicacionCreateSerializer
        return PublicacionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Verificar si ya existe una publicación para esta categoría
            categoria_id = serializer.validated_data['categoria'].id
            if Publicacion.objects.filter(categoria_id=categoria_id).exists():
                return Response({
                    'error': 'Ya existe una publicación activa para esta categoría'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            return Response({
                'message': 'Alta de publicacion exitosa',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
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
        return Response( {'message': 'Categoria eliminada exitosamente'},
                status=status.HTTP_200_OK)

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
        return Response( {'message': 'Calificacion eliminada exitosamente'},
                status=status.HTTP_200_OK)

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

    def get_queryset(self):
        user = self.request.user
        if user.rol.id == 1:  # Si es administrador
            return Alquiler.objects.all()
        return Alquiler.objects.filter(cliente=user)

    def get_serializer_class(self):
        if self.action == 'create':
            return AlquilerCreateSerializer
        return AlquilerSerializer

    def create(self, request, *args, **kwargs):
        # Obtener el modelo del vehículo solicitado
        modelo_id = request.data.get('modelo_id')
        if not modelo_id:
            return Response(
                {"error": "Se requiere especificar el modelo del vehículo"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calcular la cantidad de días
        try:
            fecha_inicio = datetime.fromisoformat(request.data['fecha_inicio'].replace('Z', '+00:00'))
            fecha_fin = datetime.fromisoformat(request.data['fecha_fin'].replace('Z', '+00:00'))
            dias = (fecha_fin - fecha_inicio).days
        except ValueError as e:
            return Response(
                {"error": f"Formato de fecha inválido: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Buscar un vehículo disponible del modelo especificado
        vehiculo_disponible = None
        vehiculos_modelo = Vehiculo.objects.filter(modelo_id=modelo_id, estado__id=1)

        for vehiculo in vehiculos_modelo:
            if vehiculo.esta_disponible(fecha_inicio, fecha_fin):
                vehiculo_disponible = vehiculo
                break

        if not vehiculo_disponible:
            return Response(
                {"error": "No hay vehículos disponibles del modelo seleccionado para las fechas especificadas"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calcular el monto total basado en el precio de la categoría del vehículo
        monto_total = vehiculo_disponible.categoria.precio * dias

        # Obtener el estado "Confirmado" (ID 1)
        try:
            estado_confirmado = EstadoAlquiler.objects.get(id=1)
        except EstadoAlquiler.DoesNotExist:
            return Response(
                {"error": "Estado de alquiler no encontrado"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Preparar los datos para crear el alquiler
        alquiler_data = {
            'cliente': request.user.id,
            'vehiculo': vehiculo_disponible.id,
            'fecha_inicio': fecha_inicio,
            'fecha_fin': fecha_fin,
            'monto_total': monto_total,
            'estado': estado_confirmado.id
        }

        serializer = self.get_serializer(data=alquiler_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['get'], url_path='mis-alquileres')
    def mis_alquileres(self, request):
        try:
            usuario = request.user
            if not usuario:
                return Response({'error': 'Usuario no encontrado en la solicitud'}, 
                              status=status.HTTP_401_UNAUTHORIZED)
            
            alquileres = Alquiler.objects.filter(cliente=usuario).order_by('-fecha_inicio')
            if not alquileres:
                return Response({'error': 'No hay alquileres asociados al usuario'}, 
                              status=status.HTTP_400_BAD_REQUEST)
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
        try:
            alquiler = self.get_object()
            
            # Verificar que el usuario sea el cliente dueño del alquiler
            if request.user != alquiler.cliente:
                return Response(
                    {'error': 'Los datos ingresados son incorrectos'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer = self.get_serializer(alquiler)
            alquiler = serializer.cancel(alquiler)
            
            return Response({
                'message': 'Alquiler cancelado exitosamente',
                'alquiler': serializer.data,
                'monto_devolucion': float(alquiler.monto_devolucion),
                'porcentaje_devolucion': float(alquiler.vehiculo.politica.porcentaje)
            }, status=status.HTTP_200_OK)
            
        except serializers.ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {'error': 'Los datos ingresados son incorrectos'},
                status=status.HTTP_400_BAD_REQUEST)

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