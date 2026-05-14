
# Create your models here.
from django.db import models
from django.conf import settings

class Task(models.Model):

    # Priority choices — instead of storing "high", "medium", "low" as free text
    # we restrict it to only these values
    class Priority(models.TextChoices):
        LOW    = 'low',    'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH   = 'high',   'High'

    class Status(models.TextChoices):
        TODO       = 'todo',        'Todo'
        IN_PROGRESS = 'in_progress', 'In Progress'
        DONE       = 'done',        'Done'

    # settings.AUTH_USER_MODEL points to your custom User model
    # on_delete=CASCADE means if user is deleted, their tasks are deleted too
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tasks'   # lets you do user.tasks.all() later
    )

    title       = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    priority    = models.CharField(max_length=10, choices=Priority.choices, default=Priority.MEDIUM)
    status      = models.CharField(max_length=20, choices=Status.choices, default=Status.TODO)
    due_date    = models.DateField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)  # set once on creation
    updated_at  = models.DateTimeField(auto_now=True)      # updates every time you save

    class Meta:
        ordering = ['-created_at']   # newest tasks first by default

    def __str__(self):
        return self.title  