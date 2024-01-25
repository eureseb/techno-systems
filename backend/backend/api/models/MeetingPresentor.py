from django.db import models

class MeetingPresentor(models.Model):
    meeting_id = models.ForeignKey('Meeting', on_delete=models.CASCADE)
    pitch_id = models.ForeignKey('Pitch', on_delete=models.CASCADE)
    is_rate_open = models.BooleanField(default=False)
