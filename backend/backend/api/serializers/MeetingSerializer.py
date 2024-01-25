from rest_framework import serializers

from api.models import Meeting

from .MeetingPresentorSerializer import MeetingPresentorSerializer
from .MeetingCommentSerializer import MeetingCommentSerializer
from .MeetingCriteriaSerializer import MeetingCriteriaSerializer

class MeetingSerializer(serializers.ModelSerializer):
    presentors = serializers.SerializerMethodField(read_only=True)
    comments = serializers.SerializerMethodField(read_only=True)
    criterias = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Meeting
        fields = '__all__'
        
    def get_presentors(self, obj):
        return MeetingPresentorSerializer(obj.presentor_id, many=True).data
    
    def get_comments(self, obj):
        return MeetingCommentSerializer(obj.meeting_comment_id, many=True).data
    
    def get_criterias(self, obj):
        return MeetingCriteriaSerializer(obj.meeting_criteria_id, many=True).data
            



