from django.db import models

class Chatbot(models.Model):
    classmember_id = models.ForeignKey('ClassMember', on_delete=models.CASCADE)
    message_id = models.ManyToManyField('Message')
    
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)
    