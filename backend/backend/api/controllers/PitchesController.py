from rest_framework import viewsets, mixins, permissions, status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import action
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response

from api.custom_permissions import IsTeamLeader

from api.models import Pitch

from api.serializers import PitchSerializer

class PitchesController(viewsets.GenericViewSet,
                      mixins.ListModelMixin, 
                      mixins.CreateModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin,
                      mixins.DestroyModelMixin):
    
    queryset = Pitch.objects.all()
    serializer_class = PitchSerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.action in ['create','destroy', 'update', 'partial_update']:
            return [permissions.IsAuthenticated(), IsTeamLeader()]
        elif self.action in ['retrieve', 'list', 'join']:
            return [permissions.IsAuthenticated()]

        return super().get_permissions()
    