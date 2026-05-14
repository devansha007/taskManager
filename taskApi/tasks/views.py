from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task
from .serializers import TaskSerializer
from .permissions import IsOwner  # ← import your new permission

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class   = TaskSerializer
    permission_classes = [IsAuthenticated, IsOwner]  # ← add this line
    filter_backends    = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields   = ['status', 'priority']
    search_fields      = ['title', 'description']
    ordering_fields    = ['due_date', 'created_at', 'priority']

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        task = self.get_object()
        task.status = 'done'
        task.save()
        return Response(self.get_serializer(task).data)

    @action(detail=False, methods=['get'])
    def urgent(self, request):
        urgent = self.get_queryset().filter(priority='high', status='todo')
        return Response(self.get_serializer(urgent, many=True).data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        return Response({
            'total':       queryset.count(),
            'todo':        queryset.filter(status='todo').count(),
            'in_progress': queryset.filter(status='in_progress').count(),
            'done':        queryset.filter(status='done').count(),
            'urgent':      queryset.filter(priority='high', status='todo').count(),
        })