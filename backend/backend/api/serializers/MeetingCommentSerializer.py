from rest_framework import serializers

from api.models import MeetingComment
from api.models import User
from api.models import ClassMember

class MeetingCommentSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MeetingComment
        fields = '__all__'

    def get_full_name(self, obj):
        classmember = ClassMember.objects.get(id=obj.classmember_id)
        return User.objects.get(id=classmember.user_id).get_full_name()
        