from rest_framework import serializers

from api.models import MeetingPresentor

from .PitchSerializer import PitchSerializer

class MeetingPresentorSerializer(serializers.ModelSerializer):
    pitch = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MeetingPresentor
        fields = '__all__'

    def get_pitch(self, obj):
        return PitchSerializer(obj.pitch_id).data
