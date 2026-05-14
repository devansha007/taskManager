from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):

    # read_only means this field appears in responses
    # but the user cannot set it manually — we set it automatically
    owner = serializers.StringRelatedField(read_only=True)

    class Meta:
        model  = Task
        fields = [
            'id', 'owner', 'title', 'description',
            'priority', 'status', 'due_date',
            'created_at', 'updated_at'
        ]
        # these are set by the server, not the user
        read_only_fields = ['id', 'created_at', 'updated_at']