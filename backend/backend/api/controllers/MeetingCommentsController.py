from rest_framework import viewsets, mixins, permissions, status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import action
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response

from api.models import MeetingComment

from api.serializers import MeetingCommentSerializer

class MeetingCommentsController(viewsets.GenericViewSet,
                      mixins.ListModelMixin, 
                      mixins.CreateModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin,
                      mixins.DestroyModelMixin):
    
    queryset = MeetingComment.objects.all()
    serializer_class = MeetingCommentSerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        return [permissions.IsAuthenticated()]
    