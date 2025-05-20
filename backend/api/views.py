from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from .models import (
    Usuario, Vehiculo, Publicacion,
    Marca, Modelo, EstadoVehiculo, Sucursal, Categoria,
    PoliticaDeCancelacion, TipoPolitica, Foto
)
from .serializers import (
    UsuarioSerializer, UsuarioCreateSerializer,
    VehiculoSerializer, VehiculoCreateSerializer,
    PublicacionSerializer, PublicacionCreateSerializer
)

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'register']:
            return UsuarioCreateSerializer
        return UsuarioSerializer

    def get_permissions(self):
        if self.action in ['create', 'register', 'login']:
            return [AllowAny()]
        return super().get_permissions()

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
        if not email or not password:
            return Response({'error': 'Por favor proporcione email y contraseña'}, status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(username=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UsuarioSerializer(user).data
            })
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

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

class VehiculoViewSet(viewsets.ModelViewSet):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return VehiculoCreateSerializer
        return VehiculoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            if Vehiculo.objects.filter(patente=serializer.validated_data['patente']).exists():
                return Response({'error': 'La patente ya está registrada'}, status=status.HTTP_400_BAD_REQUEST)
            vehiculo = serializer.save()
            return Response(VehiculoSerializer(vehiculo).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PublicacionViewSet(viewsets.ModelViewSet):
    queryset = Publicacion.objects.all()
    serializer_class = PublicacionSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return PublicacionCreateSerializer
        return PublicacionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            publicacion = serializer.save()
            return Response(PublicacionSerializer(publicacion).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 