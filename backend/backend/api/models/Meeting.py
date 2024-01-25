from django.db import models

class Meeting(models.Model):
    classroom_id = models.ForeignKey('ClassRoom', on_delete=models.CASCADE)
    owner_id = models.ForeignKey('ClassMember', on_delete=models.CASCADE)
    meeting_presentor_id = models.ManyToManyField('Pitch', through='MeetingPresentor')
    meeting_criteria_id = models.ManyToManyField('Criteria', through='MeetingCriteria')
    meeting_comment_id = models.ManyToManyField('MeetingComment')

    name = models.CharField(max_length=100)
    description = models.TextField()
    
    teacher_weight_score = models.DecimalField(max_digits=3, decimal_places=2, default=1)
    student_weight_score = models.DecimalField(max_digits=3, decimal_places=2, default=0)

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    video = models.CharField(max_length=50, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)
