from django.shortcuts import get_object_or_404
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
        elif self.action in ['modificar', 'baja', 'perfil', 'mis_alquileres']:
            return [IsAuthenticated()]
        return [IsAdmin()]

    @action(detail=False, methods=['put'])
    def modificar(self, request):
        usuario = request.user
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            # Si se está cambiando la contraseña
            if 'nueva_contraseña' in request.data:
                # Verificar que se proporcionó la contraseña actual
                if 'contraseña' not in request.data:
                    return Response(
                        {'error': 'Debe proporcionar la contraseña actual'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Verificar que la contraseña actual sea correcta
                if not usuario.check_password(request.data['contraseña']):
                    return Response(
                        {'error': 'La contraseña actual es incorrecta'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                contraseña = request.data['nueva_contraseña']
                # Validar longitud mínima
                if len(contraseña) < 8:
                    return Response(
                        {'error': 'La contraseña debe tener al menos 8 caracteres'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                # Validar que contenga al menos una letra mayúscula
                if not any(c.isupper() for c in contraseña):
                    return Response(
                        {'error': 'La contraseña debe contener al menos una letra mayúscula'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                # Validar que contenga al menos una letra minúscula
                if not any(c.islower() for c in contraseña):
                    return Response(
                        {'error': 'La contraseña debe contener al menos una letra minúscula'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                # Validar que contenga al menos un número
                if not any(c.isdigit() for c in contraseña):
                    return Response(
                        {'error': 'La contraseña debe contener al menos un número'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                usuario.set_password(contraseña)
                usuario.save()
            
            # Actualizar los demás campos
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def baja(self, request, pk=None):
        usuario = self.get_object()
        if request.user.rol.id not in [2, 3]:  # 2: empleado, 3: admin
            return Response({'error': 'No tienes permiso para dar de baja usuarios'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        usuario.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['put'])
    def cambiar_rol(self, request, pk=None):
        if request.user.rol.id != 3:  # 3: admin
            return Response({'error': 'Solo los administradores pueden cambiar roles'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        usuario = self.get_object()
        nuevo_rol = request.data.get('rol')
        nuevo_puesto = request.data.get('puesto')
        nueva_localidad = request.data.get('localidad')

        if nuevo_rol not in [1, 2, 3]:  # 1: cliente, 2: empleado, 3: admin
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
        codigo_admin = request.data.get('codigo_admin')

        try:
            user = Usuario.objects.get(email=email)
            
            if user.is_locked:
                return Response({
                    'error': 'Cuenta bloqueada. Por favor, use la clave de recuperación "123456789" para desbloquear su cuenta.'
                }, status=status.HTTP_403_FORBIDDEN)

            authenticated_user = authenticate(request, email=email, password=password)
            
            if authenticated_user is None:
                # Incrementar contador de intentos fallidos
                user.increment_login_attempts()
                if user.is_locked:
                    return Response({
                        'error': 'Demasiados intentos fallidos. La cuenta ha sido bloqueada.'
                    }, status=status.HTTP_403_FORBIDDEN)
                return Response({
                    'error': 'Credenciales inválidas'
                }, status=status.HTTP_401_UNAUTHORIZED)

            # Verificar si es administrador
            if authenticated_user.rol and authenticated_user.rol.id == 3:
                # Si es admin y no se proporcionó código, pedir código
                if not codigo_admin:
                    return Response({
                        'error': 'Se requiere código de administrador',
                        'require_admin_code': True
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Si es admin y se proporcionó código, verificar
                if codigo_admin != "12345":
                    authenticated_user.increment_admin_code_attempts()
                    if authenticated_user.admin_code_attempts >= 3:
                        return Response({
                            'error': 'La clave ingresada es incorrecta. Se ha bloqueado la cuenta y se ha enviado un email al correo asociado'
                        }, status=status.HTTP_403_FORBIDDEN)
                    return Response({
                        'error': 'La clave ingresada es incorrecta'
                    }, status=status.HTTP_401_UNAUTHORIZED)

            # Si llegamos aquí, el login es válido
            refresh = RefreshToken.for_user(authenticated_user)
            authenticated_user.reset_login_attempts()
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': authenticated_user.id,
                    'email': authenticated_user.email,
                    'nombre': authenticated_user.nombre,
                    'apellido': authenticated_user.apellido,
                    'telefono': authenticated_user.telefono,
                    'fecha_nacimiento': authenticated_user.fecha_nacimiento,
                    'rol': authenticated_user.rol.id if authenticated_user.rol else 1,  # 1 es cliente por defecto
                    'puesto': authenticated_user.puesto,
                    'localidad': authenticated_user.localidad.id if authenticated_user.localidad else None
                }
            })
        except Usuario.DoesNotExist:
            return Response({
                'error': 'Credenciales inválidas'
            }, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({
                'error': 'Error al procesar la solicitud'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def perfil(self, request):
        """
        Obtiene los datos del usuario autenticado.
        No requiere parámetros adicionales.
        """
        usuario = request.user
        serializer = UsuarioSerializer(usuario)
        return Response({
            'id': usuario.id,
            'email': usuario.email,
            'nombre': usuario.nombre,
            'apellido': usuario.apellido,
            'telefono': usuario.telefono,
            'fecha_nacimiento': usuario.fecha_nacimiento,
            'rol': usuario.rol.nombre if usuario.rol else None,
            'puesto': usuario.puesto,
            'localidad': usuario.localidad.id if usuario.localidad else None
        })

    @action(detail=False, methods=['get'], url_path='mis-alquileres')
    def mis_alquileres(self, request):
        try:
            usuario = request.user
            if not usuario:
                return Response({'error': 'Usuario no encontrado en la solicitud'}, 
                              status=status.HTTP_401_UNAUTHORIZED)
            
            alquileres = Alquiler.objects.filter(cliente=usuario).order_by('-fecha_inicio')
            if not alquileres:
                return Response({'error': 'No hay alquileres asociados al usuario'},) 
                              #status=status.HTTP_404_NOT_FOUND)
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

    def get_permissions(self):
        if self.action in ['list', 'modelos_disponibles']:
            return [AllowAny()]
        return [IsEmpleadoOrAdmin()]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response(
                {'error': 'No hay vehículos registrados'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.get_serializer(queryset, many=True)
        response = Response(serializer.data)
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        try:
            # Obtener la categoría
            categoria_id = data.get('categoria')
            if not categoria_id:
                return Response({'error': 'La categoría es requerida'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Obtener la política y capacidad según la categoría
            categoria = Categoria.objects.get(id=categoria_id)
            
            # Asignar la política según la categoría
            if categoria.id == 1:  # Apto discapacitados
                data['politica'] = 1  # 100% devolución
                data['capacidad'] = 5  # Capacidad estándar para vehículos adaptados
            elif categoria.id == 2:  # Chico
                data['politica'] = 2  # 20% devolución
                data['capacidad'] = 4  # Capacidad para autos chicos
            elif categoria.id == 3:  # Deportivo
                data['politica'] = 2  # 20% devolución
                data['capacidad'] = 2  # Capacidad típica de deportivos
            elif categoria.id == 4:  # Mediano
                data['politica'] = 2  # 20% devolución
                data['capacidad'] = 5  # Capacidad estándar
            elif categoria.id == 5:  # SUV
                data['politica'] = 3  # Sin devolución
                data['capacidad'] = 7  # Capacidad típica de SUV
            else:  # Van (id = 6)
                data['politica'] = 3  # Sin devolución
                data['capacidad'] = 9  # Capacidad máxima para vans

            serializer = VehiculoCreateSerializer(data=data)
            if serializer.is_valid():
                if Vehiculo.objects.filter(patente=serializer.validated_data['patente']).exists():
                    return Response({'error': 'La patente ya está registrada'}, status=status.HTTP_400_BAD_REQUEST)
                vehiculo = serializer.save()
                return Response(VehiculoSerializer(vehiculo).data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Categoria.DoesNotExist:
            return Response({'error': 'La categoría especificada no existe'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def baja(self, request, pk=None):
        vehiculo = self.get_object()
        vehiculo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['put', 'patch'])
    def modificar(self, request, pk=None):
        vehiculo = self.get_object()
        data = request.data.copy()
        
        try:
            # Si se está cambiando la categoría, actualizar la política y capacidad
            if 'categoria' in data:
                categoria = Categoria.objects.get(id=data['categoria'])
                # Asignar la política y capacidad según la categoría
                if categoria.id == 1:  # Apto discapacitados
                    data['politica'] = 1  # 100% devolución
                    data['capacidad'] = 5  # Capacidad estándar para vehículos adaptados
                elif categoria.id == 2:  # Chico
                    data['politica'] = 2  # 20% devolución
                    data['capacidad'] = 4  # Capacidad para autos chicos
                elif categoria.id == 3:  # Deportivo
                    data['politica'] = 2  # 20% devolución
                    data['capacidad'] = 2  # Capacidad típica de deportivos
                elif categoria.id == 4:  # Mediano
                    data['politica'] = 2  # 20% devolución
                    data['capacidad'] = 5  # Capacidad estándar
                elif categoria.id == 5:  # SUV
                    data['politica'] = 3  # Sin devolución
                    data['capacidad'] = 7  # Capacidad típica de SUV
                else:  # Van (id = 6)
                    data['politica'] = 3  # Sin devolución
                    data['capacidad'] = 9  # Capacidad máxima para vans

            serializer = VehiculoCreateSerializer(vehiculo, data=data, partial=True)
            if serializer.is_valid():
                # Verificar si la patente ya existe (solo si se está modificando la patente)
                if 'patente' in request.data and request.data['patente'] != vehiculo.patente:
                    if Vehiculo.objects.filter(patente=request.data['patente']).exists():
                        return Response({'error': 'La patente ya está registrada'}, status=status.HTTP_400_BAD_REQUEST)
                vehiculo = serializer.save()
                return Response(VehiculoSerializer(vehiculo).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Categoria.DoesNotExist:
            return Response({'error': 'La categoría especificada no existe'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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

            if not modelos_disponibles.exists():
                return Response(
                    {"error": "No se encuentran autos disponibles en las fechas seleccionadas"},
                    status=status.HTTP_404_NOT_FOUND
                )

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
        return [IsAdmin()]

    def get_queryset(self):
        return Publicacion.objects.all().select_related('categoria')

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
            
            publicacion = serializer.save()
            # Recargar la publicación con todos los datos de la categoría
            publicacion = Publicacion.objects.select_related('categoria').get(id=publicacion.id)
            return Response({
                'message': 'Alta de publicación exitosa',
                'data': PublicacionSerializer(publicacion).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        publicacion = self.get_object()
        publicacion.delete()
        return Response({
            'message': 'Publicación dada de baja exitosamente'
        }, status=status.HTTP_200_OK)

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

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdmin()]

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
    permission_classes = [AllowAny]  # Permitir acceso público

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

    @action(detail=True, methods=['post'])
    def responder(self, request, pk=None):
        if request.user.rol.id not in [2, 3]:  # 2: empleado, 3: admin
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

            # Validar que la fecha de inicio sea futura
            ahora = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
            fecha_inicio_sin_hora = fecha_inicio.replace(hour=0, minute=0, second=0, microsecond=0)
            
            if fecha_inicio_sin_hora < ahora:
                return Response(
                    {"error": "La fecha de inicio debe ser futura"},
                    status=status.HTTP_400_BAD_REQUEST
                )

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
        alquiler = serializer.save()

        # Usar el AlquilerSerializer para la respuesta
        response_serializer = AlquilerSerializer(alquiler)
        headers = self.get_success_headers(serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

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
                    {'error': 'No tienes permiso para cancelar esta reserva'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer = self.get_serializer(alquiler)
            alquiler = serializer.cancel(alquiler)
            
            # Obtener los datos serializados
            serialized_data = serializer.data
            
            # Calcular el monto de devolución basado en la política
            try:
                monto_total = float(serialized_data.get('monto_total', 0))
                porcentaje_devolucion = float(serialized_data.get('vehiculo', {}).get('politica', {}).get('porcentaje', {}))
                monto_devolucion = (monto_total * porcentaje_devolucion) / 100
            except (ValueError, AttributeError) as e:
                return Response(
                    {'error': f'Error al calcular el monto de devolución: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            return Response({
                'message': 'Alquiler cancelado exitosamente',
                'alquiler': serialized_data,
                'monto_devolucion': monto_devolucion,
                'porcentaje_devolucion': porcentaje_devolucion
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

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

def searchAvailableCategories(request):
    """
    Busca las categorías que tienen vehículos disponibles.
    """
    try:
        # Obtener todas las categorías que tienen al menos un vehículo disponible
        categorias_disponibles = Categoria.objects.filter(
            vehiculo__estado__id=1  # estado disponible
        ).distinct()

        if not categorias_disponibles.exists():
            return Response(
                {"error": "No hay categorías con vehículos disponibles"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Serializar las categorías
        serializer = CategoriaSerializer(categorias_disponibles, many=True)
        
        return Response({
            "categorias": serializer.data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": f"Error al buscar categorías disponibles: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 